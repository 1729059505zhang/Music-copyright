const { Op } = require('sequelize');
const dayjs = require('dayjs');
const {
  Order, OrderItem, MusicLyricWork, WorkLicensePackage,
  User, CreatorAccount, FinancialFlow, SettlementRecord,
  UserMessage,
} = require('../models');
const { sequelize } = require('../db/sequelize');
const ResponseUtil = require('../utils/response');
const {
  generateOrderNo, generateFlowNo, generateSettlementNo,
  parsePagination,
} = require('../utils/common');
const config = require('../config');

class OrderController {
  /**
   * 创建订单
   */
  static async createOrder(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { items, buyerContact, buyerPhone, remark } = ctx.request.body;

    if (!items || items.length === 0) {
      return ResponseUtil.fail(ctx, '订单商品不能为空');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return ResponseUtil.fail(ctx, '用户不存在');
    }

    const t = await sequelize.transaction();

    try {
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const work = await MusicLyricWork.findByPk(item.workId, { transaction: t });
        if (!work) {
          await t.rollback();
          return ResponseUtil.fail(ctx, `作品不存在: ${item.workId}`);
        }
        if (work.status !== 1 || work.audit_status !== 1) {
          await t.rollback();
          return ResponseUtil.fail(ctx, `作品不可购买: ${work.title}`);
        }

        const pkg = await WorkLicensePackage.findOne({
          where: { work_id: item.workId, license_type: item.licenseType, status: 1 },
          transaction: t,
        });

        if (!pkg) {
          await t.rollback();
          return ResponseUtil.fail(ctx, '授权套餐不存在');
        }

        const creator = await CreatorAccount.findByPk(work.creator_id, { transaction: t });

        const quantity = item.quantity || 1;
        const itemTotal = pkg.price * quantity;
        totalAmount += itemTotal;

        orderItems.push({
          work_id: work.id,
          item_type: 1,
          item_name: work.title,
          item_cover: work.cover_url,
          license_type: item.licenseType,
          license_duration: pkg.duration,
          price: pkg.price,
          quantity,
          total_price: itemTotal,
          creator_id: work.creator_id,
          creator_name: creator?.creator_name,
        });
      }

      const orderNo = generateOrderNo();
      const frozenDays = config.finance.settlementFreezeDays;

      const order = await Order.create({
        tenant_id: tenantId,
        order_no: orderNo,
        buyer_id: userId,
        order_type: 1,
        total_amount: totalAmount,
        pay_amount: totalAmount,
        discount_amount: 0,
        pay_status: 0,
        order_status: 0,
        settlement_status: 0,
        frozen_until: dayjs().add(frozenDays, 'day').toDate(),
        buyer_company: user.company_name,
        buyer_contact: buyerContact || user.real_name || user.nickname,
        buyer_phone: buyerPhone || user.phone,
        remark,
      }, { transaction: t });

      for (const item of orderItems) {
        item.order_id = order.id;
        item.tenant_id = tenantId;
      }
      await OrderItem.bulkCreate(orderItems, { transaction: t });

      await t.commit();

      ResponseUtil.success(ctx, {
        orderId: order.id,
        orderNo: order.order_no,
        payAmount: order.pay_amount,
      }, '订单创建成功');
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * 支付订单（模拟支付/余额支付）
   */
  static async payOrder(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { orderId, payType = 1 } = ctx.request.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return ResponseUtil.fail(ctx, '用户不存在');
    }

    const order = await Order.findOne({
      where: { id: orderId, tenant_id: tenantId, buyer_id: userId },
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order) {
      return ResponseUtil.fail(ctx, '订单不存在');
    }
    if (order.pay_status === 1) {
      return ResponseUtil.fail(ctx, '订单已支付');
    }
    if (order.order_status === 3) {
      return ResponseUtil.fail(ctx, '订单已取消');
    }

    const t = await sequelize.transaction();

    try {
      if (payType === 1) {
        if (user.balance < order.pay_amount) {
          await t.rollback();
          return ResponseUtil.fail(ctx, '余额不足，请先充值');
        }

        const balanceBefore = user.balance;
        const balanceAfter = user.balance - order.pay_amount;

        await User.update(
          { balance: balanceAfter },
          { where: { id: userId }, transaction: t }
        );

        await FinancialFlow.create({
          tenant_id: tenantId,
          flow_no: generateFlowNo(),
          flow_type: 1,
          flow_direction: 2,
          amount: order.pay_amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          related_user_id: userId,
          related_order_id: order.id,
          remark: `订单支付: ${order.order_no}`,
        }, { transaction: t });
      }

      await Order.update({
        pay_status: 1,
        pay_type: payType,
        pay_time: new Date(),
        order_status: 1,
      }, {
        where: { id: orderId },
        transaction: t,
      });

      const items = order.items || [];
      for (const item of items) {
        await MusicLyricWork.increment('sale_count', {
          where: { id: item.work_id },
          transaction: t,
        });
      }

      await UserMessage.create({
        tenant_id: tenantId,
        user_id: userId,
        msg_type: 2,
        title: '订单支付成功',
        content: `您的订单 ${order.order_no} 已支付成功，金额：${(order.pay_amount / 100).toFixed(2)}元`,
        related_id: order.id,
        related_type: 'order',
      }, { transaction: t });

      await t.commit();

      ResponseUtil.success(ctx, null, '支付成功');
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * 获取我的订单列表（买家）
   */
  static async getMyOrders(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { status, keyword } = ctx.query;

    const where = {
      tenant_id: tenantId,
      buyer_id: userId,
    };

    if (status !== undefined && status !== '') {
      where.order_status = Number(status);
    }

    const orderWhere = {};
    if (keyword) {
      orderWhere['$items.item_name$'] = { [Op.like]: `%${keyword}%` };
    }

    const { count, rows } = await Order.findAndCountAll({
      where: { ...where, ...orderWhere },
      include: [{ model: OrderItem, as: 'items' }],
      distinct: true,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 获取订单详情
   */
  static async getOrderDetail(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { id } = ctx.params;

    const order = await Order.findOne({
      where: { id, tenant_id: tenantId, buyer_id: userId },
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order) {
      return ResponseUtil.fail(ctx, '订单不存在');
    }

    const canAccessFull = order.pay_status === 1;
    const items = await Promise.all(order.items.map(async (item) => {
      const itemJson = item.toJSON();
      if (item.work_id && canAccessFull) {
        const work = await MusicLyricWork.findByPk(item.work_id, {
          attributes: ['id', 'title', 'lyric', 'score_url', 'demo_url', 'demo_preview_url', 'cover_url'],
        });
        itemJson.workDetail = work;
      }
      return itemJson;
    }));

    ResponseUtil.success(ctx, { ...order.toJSON(), items });
  }

  /**
   * 取消订单
   */
  static async cancelOrder(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { id } = ctx.params;
    const { reason } = ctx.request.body;

    const order = await Order.findOne({
      where: { id, tenant_id: tenantId, buyer_id: userId },
    });

    if (!order) {
      return ResponseUtil.fail(ctx, '订单不存在');
    }
    if (order.pay_status === 1) {
      return ResponseUtil.fail(ctx, '已支付订单不可取消，请申请退款');
    }
    if (order.order_status === 3) {
      return ResponseUtil.fail(ctx, '订单已取消');
    }

    await order.update({
      order_status: 3,
      cancel_reason: reason,
    });

    ResponseUtil.success(ctx, null, '订单已取消');
  }

  /**
   * 执行结算（定时任务/手动触发，冷静期结束后分账）
   */
  static async executeSettlement(orderId, transaction) {
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'items' }],
      transaction,
    });

    if (!order || order.settlement_status === 2) return;

    for (const item of order.items) {
      const creator = await CreatorAccount.findByPk(item.creator_id, { transaction });
      const tenant = order.tenant_id;

      const platformRate = config.finance.defaultPlatformShareRatio;
      const tenantRate = config.finance.defaultTenantShareRatio;
      const creatorRate = 100 - platformRate - tenantRate;

      const platformAmount = Math.floor(item.total_price * platformRate / 100);
      const tenantAmount = Math.floor(item.total_price * tenantRate / 100);
      const creatorAmount = item.total_price - platformAmount - tenantAmount;

      await SettlementRecord.create({
        tenant_id: order.tenant_id,
        settlement_no: generateSettlementNo(),
        order_id: order.id,
        order_item_id: item.id,
        creator_id: item.creator_id,
        work_id: item.work_id,
        total_amount: item.total_price,
        platform_rate: platformRate,
        platform_amount: platformAmount,
        tenant_rate: tenantRate,
        tenant_amount: tenantAmount,
        creator_rate: creatorRate,
        creator_amount: creatorAmount,
        status: 1,
      }, { transaction });

      await OrderItem.update(
        {
          settlement_amount: creatorAmount,
          platform_commission: platformAmount,
          tenant_share: tenantAmount,
        },
        { where: { id: item.id }, transaction }
      );

      if (creator) {
        const user = await User.findOne({
          where: { id: creator.user_id },
          transaction,
        });
        if (user) {
          const balanceBefore = user.balance;
          const balanceAfter = user.balance + creatorAmount;
          await User.update(
            { balance: balanceAfter },
            { where: { id: user.id }, transaction }
          );
          await CreatorAccount.increment('total_sales', {
            by: creatorAmount,
            where: { id: creator.id },
            transaction,
          });
          await FinancialFlow.create({
            tenant_id: order.tenant_id,
            flow_no: generateFlowNo('SE'),
            flow_type: 5,
            flow_direction: 1,
            amount: creatorAmount,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            related_user_id: user.id,
            related_order_id: order.id,
            remark: `结算收入: ${order.order_no}`,
          }, { transaction });
        }
      }
    }

    await Order.update(
      { settlement_status: 2, settlement_time: new Date(), order_status: 2 },
      { where: { id: orderId }, transaction }
    );
  }
}

module.exports = OrderController;
