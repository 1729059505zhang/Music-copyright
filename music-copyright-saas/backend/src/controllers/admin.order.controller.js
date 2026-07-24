const { Op } = require('sequelize');
const {
  Order, OrderItem, MusicLyricWork, User,
  WithdrawalApply, FinancialFlow, SettlementRecord,
  CreatorAccount,
} = require('../models');
const { sequelize } = require('../db/sequelize');
const ResponseUtil = require('../utils/response');
const { generateFlowNo, parsePagination } = require('../utils/common');

class AdminOrderController {
  static async getOrderList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { status, keyword, orderType, startDate, endDate } = ctx.query;

    const where = { tenant_id: tenantId };
    if (status !== undefined && status !== '') where.order_status = Number(status);
    if (orderType) where.order_type = Number(orderType);
    if (keyword) where.order_no = { [Op.like]: `%${keyword}%` };
    if (startDate && endDate) {
      where.created_at = { [Op.between]: [startDate, endDate + ' 23:59:59'] };
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'buyer', attributes: ['id', 'username', 'nickname', 'phone'] },
      ],
      distinct: true,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  static async getOrderDetail(ctx) {
    const { id } = ctx.params;

    const order = await Order.findByPk(id, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'buyer', attributes: ['id', 'username', 'nickname', 'phone'] },
      ],
    });

    if (!order) {
      return ResponseUtil.fail(ctx, '订单不存在');
    }

    ResponseUtil.success(ctx, order);
  }

  static async refundOrder(ctx) {
    const adminUser = ctx.state.adminUser;
    const { id } = ctx.params;
    const { reason } = ctx.request.body;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order) {
      return ResponseUtil.fail(ctx, '订单不存在');
    }
    if (order.pay_status !== 1) {
      return ResponseUtil.fail(ctx, '未支付订单不可退款');
    }
    if (order.order_status === 4) {
      return ResponseUtil.fail(ctx, '订单已退款');
    }

    const t = await sequelize.transaction();
    try {
      const buyer = await User.findByPk(order.buyer_id, { transaction: t });
      if (buyer) {
        const balanceBefore = buyer.balance;
        const balanceAfter = buyer.balance + order.pay_amount;
        await User.update(
          { balance: balanceAfter },
          { where: { id: buyer.id }, transaction: t }
        );
        await FinancialFlow.create({
          tenant_id: order.tenant_id,
          flow_no: generateFlowNo('RF'),
          flow_type: 2,
          flow_direction: 1,
          amount: order.pay_amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          related_user_id: buyer.id,
          related_order_id: order.id,
          remark: `订单退款: ${order.order_no}`,
        }, { transaction: t });
      }

      await Order.update(
        { order_status: 4, pay_status: 2, refund_reason: reason },
        { where: { id: order.id }, transaction: t }
      );

      await t.commit();
      ResponseUtil.success(ctx, null, '退款成功');
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

class AdminFinanceController {
  static async getWithdrawalList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { status } = ctx.query;

    const where = { tenant_id: tenantId };
    if (status !== undefined && status !== '') where.apply_status = Number(status);

    const { count, rows } = await WithdrawalApply.findAndCountAll({
      where,
      include: [
        { model: CreatorAccount, as: 'creator', attributes: ['id', 'creator_name'] },
        { model: User, as: 'applicant', attributes: ['id', 'username', 'phone'] },
      ],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  static async auditWithdrawal(ctx) {
    const adminUser = ctx.state.adminUser;
    const { id } = ctx.params;
    const { pass, reason } = ctx.request.body;

    const withdrawal = await WithdrawalApply.findByPk(id);
    if (!withdrawal) {
      return ResponseUtil.fail(ctx, '提现申请不存在');
    }
    if (withdrawal.apply_status !== 0) {
      return ResponseUtil.fail(ctx, '该申请已审核');
    }

    const t = await sequelize.transaction();
    try {
      if (pass) {
        await WithdrawalApply.update(
          {
            apply_status: 4,
            audit_user_id: adminUser.userId,
            audit_time: new Date(),
            transfer_time: new Date(),
          },
          { where: { id }, transaction: t }
        );
      } else {
        const user = await User.findByPk(withdrawal.user_id, { transaction: t });
        if (user) {
          const balanceBefore = user.balance;
          const balanceAfter = user.balance + withdrawal.amount;
          await User.update(
            { balance: balanceAfter },
            { where: { id: user.id }, transaction: t }
          );
          await FinancialFlow.create({
            tenant_id: withdrawal.tenant_id,
            flow_no: generateFlowNo('WR'),
            flow_type: 4,
            flow_direction: 1,
            amount: withdrawal.amount,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            related_user_id: user.id,
            related_withdrawal_id: withdrawal.id,
            remark: `提现驳回退回: ${withdrawal.withdrawal_no}`,
          }, { transaction: t });
        }

        await WithdrawalApply.update(
          {
            apply_status: 2,
            audit_user_id: adminUser.userId,
            audit_time: new Date(),
            reject_reason: reason,
          },
          { where: { id }, transaction: t }
        );
      }

      await t.commit();
      ResponseUtil.success(ctx, null, pass ? '审核通过' : '已驳回');
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getSettlementList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);

    const { count, rows } = await SettlementRecord.findAndCountAll({
      where: { tenant_id: tenantId },
      include: [
        { model: Order, as: 'order', attributes: ['order_no'] },
        { model: CreatorAccount, as: 'creator', attributes: ['id', 'creator_name'] },
      ],
      offset,
      limit,
      order: [['settled_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  static async getFinancialFlow(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { flowType, startDate, endDate } = ctx.query;

    const where = { tenant_id: tenantId };
    if (flowType) where.flow_type = Number(flowType);
    if (startDate && endDate) {
      where.created_at = { [Op.between]: [startDate, endDate + ' 23:59:59'] };
    }

    const { count, rows } = await FinancialFlow.findAndCountAll({
      where,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }
}

module.exports = { AdminOrderController, AdminFinanceController };
