const { Op } = require('sequelize');
const {
  WithdrawalApply, CreatorAccount, User, FinancialFlow,
  SettlementRecord, Order,
} = require('../models');
const { sequelize } = require('../db/sequelize');
const ResponseUtil = require('../utils/response');
const {
  generateWithdrawalNo, generateFlowNo, parsePagination,
} = require('../utils/common');
const config = require('../config');

class FinanceController {
  /**
   * 获取账户余额
   */
  static async getBalance(ctx) {
    const userId = ctx.state.user.userId;
    const user = await User.findByPk(userId, {
      attributes: ['id', 'balance', 'frozen_balance'],
    });
    ResponseUtil.success(ctx, user);
  }

  /**
   * 申请提现
   */
  static async applyWithdrawal(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { amount, withdrawalType, accountName, accountNumber, bankName } = ctx.request.body;

    if (!amount || amount <= 0) {
      return ResponseUtil.fail(ctx, '提现金额不能为空');
    }

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者账号不存在');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return ResponseUtil.fail(ctx, '用户不存在');
    }

    const minAmount = config.finance.minWithdrawalAmount;
    if (amount < minAmount) {
      return ResponseUtil.fail(ctx, `最低提现金额为 ${minAmount / 100} 元`);
    }

    if (amount > user.balance) {
      return ResponseUtil.fail(ctx, '余额不足');
    }

    const feeRate = config.finance.withdrawalFeeRate;
    const minFee = config.finance.withdrawalFeeMin;
    let fee = Math.floor(amount * feeRate / 100);
    if (fee < minFee) fee = minFee;

    const actualAmount = amount - fee;
    if (actualAmount <= 0) {
      return ResponseUtil.fail(ctx, '提现金额过低');
    }

    const t = await sequelize.transaction();

    try {
      const balanceBefore = user.balance;
      const balanceAfter = user.balance - amount;

      await User.update(
        { balance: balanceAfter },
        { where: { id: userId }, transaction: t }
      );

      const withdrawal = await WithdrawalApply.create({
        tenant_id: tenantId,
        withdrawal_no: generateWithdrawalNo(),
        creator_id: creator.id,
        user_id: userId,
        amount,
        fee,
        actual_amount: actualAmount,
        withdrawal_type: Number(withdrawalType),
        account_name: accountName,
        account_number: accountNumber,
        bank_name: bankName,
        apply_status: 0,
      }, { transaction: t });

      await FinancialFlow.create({
        tenant_id: tenantId,
        flow_no: generateFlowNo('WD'),
        flow_type: 4,
        flow_direction: 2,
        amount,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        related_user_id: userId,
        related_withdrawal_id: withdrawal.id,
        remark: `提现申请: ${withdrawal.withdrawal_no}`,
      }, { transaction: t });

      await t.commit();

      ResponseUtil.success(ctx, { id: withdrawal.id }, '提现申请已提交');
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * 提现记录
   */
  static async getWithdrawalList(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.successList(ctx, [], 0);
    }

    const { count, rows } = await WithdrawalApply.findAndCountAll({
      where: { tenant_id: tenantId, creator_id: creator.id },
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 收益概览
   */
  static async getEarningsOverview(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者账号不存在');
    }

    const user = await User.findByPk(userId);

    const totalEarnings = creator.total_sales;
    const pendingSettlement = await SettlementRecord.sum('creator_amount', {
      where: { creator_id: creator.id, status: 1 },
    }) || 0;

    const withdrawalTotal = await WithdrawalApply.sum('actual_amount', {
      where: { creator_id: creator.id, apply_status: 4 },
    }) || 0;

    const pendingWithdrawal = await WithdrawalApply.sum('amount', {
      where: { creator_id: creator.id, apply_status: { [Op.in]: [0, 1, 3] } },
    }) || 0;

    ResponseUtil.success(ctx, {
      totalEarnings,
      availableBalance: user?.balance || 0,
      pendingSettlement,
      withdrawalTotal,
      pendingWithdrawal,
    });
  }

  /**
   * 销售流水
   */
  static async getSalesFlow(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.successList(ctx, [], 0);
    }

    const { count, rows } = await SettlementRecord.findAndCountAll({
      where: { tenant_id: tenantId, creator_id: creator.id },
      include: [{
        model: Order,
        as: 'order',
        attributes: ['order_no', 'created_at'],
      }],
      offset,
      limit,
      order: [['settled_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 收款账户信息
   */
  static async getPaymentAccount(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
      attributes: [
        'bank_account_name', 'bank_account_number', 'bank_name',
        'alipay_account', 'wechat_account',
      ],
    });

    ResponseUtil.success(ctx, creator);
  }

  /**
   * 更新收款账户
   */
  static async updatePaymentAccount(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const {
      bankAccountName, bankAccountNumber, bankName,
      alipayAccount, wechatAccount,
    } = ctx.request.body;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者账号不存在');
    }

    await creator.update({
      bank_account_name: bankAccountName,
      bank_account_number: bankAccountNumber,
      bank_name: bankName,
      alipay_account: alipayAccount,
      wechat_account: wechatAccount,
    });

    ResponseUtil.success(ctx, null, '收款账户已更新');
  }
}

module.exports = FinanceController;
