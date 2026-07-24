const { Op } = require('sequelize');
const {
  MusicLyricWork, MusicReleaseWork, MusicCategory,
  CreatorAccount, User, Order, CopyrightApply,
  WorkLicensePackage,
} = require('../models');
const ResponseUtil = require('../utils/response');
const { parsePagination } = require('../utils/common');

class AdminDashboardController {
  /**
   * 运营仪表盘数据
   */
  static async getDashboardStats(ctx) {
    const tenantId = ctx.state.tenantId || 0;

    const workCount = await MusicLyricWork.count({
      where: { tenant_id: tenantId, audit_status: 1 },
    });

    const pendingWorkCount = await MusicLyricWork.count({
      where: { tenant_id: tenantId, audit_status: 0 },
    });

    const userCount = await User.count({
      where: { tenant_id: tenantId, status: 1 },
    });

    const creatorCount = await CreatorAccount.count({
      where: { tenant_id: tenantId, status: 1 },
    });

    const pendingCreatorCount = await CreatorAccount.count({
      where: { tenant_id: tenantId, status: 0 },
    });

    const orderCount = await Order.count({
      where: { tenant_id: tenantId, pay_status: 1 },
    });

    const totalAmount = await Order.sum('pay_amount', {
      where: { tenant_id: tenantId, pay_status: 1 },
    }) || 0;

    const pendingCopyrightCount = await CopyrightApply.count({
      where: { tenant_id: tenantId, apply_status: 1 },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrderCount = await Order.count({
      where: { tenant_id: tenantId, pay_status: 1, created_at: { [Op.gte]: today } },
    });
    const todayAmount = await Order.sum('pay_amount', {
      where: { tenant_id: tenantId, pay_status: 1, created_at: { [Op.gte]: today } },
    }) || 0;

    ResponseUtil.success(ctx, {
      workCount,
      pendingWorkCount,
      userCount,
      creatorCount,
      pendingCreatorCount,
      orderCount,
      totalAmount,
      pendingCopyrightCount,
      todayOrderCount,
      todayAmount,
    });
  }

  /**
   * 获取最近7天订单趋势
   */
  static async getOrderTrend(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const days = 7;
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - i);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      const count = await Order.count({
        where: {
          tenant_id: tenantId,
          pay_status: 1,
          created_at: { [Op.between]: [startDate, endDate] },
        },
      });

      const amount = await Order.sum('pay_amount', {
        where: {
          tenant_id: tenantId,
          pay_status: 1,
          created_at: { [Op.between]: [startDate, endDate] },
        },
      }) || 0;

      result.push({
        date: startDate.toISOString().split('T')[0],
        count,
        amount,
      });
    }

    ResponseUtil.success(ctx, result);
  }
}

module.exports = AdminDashboardController;
