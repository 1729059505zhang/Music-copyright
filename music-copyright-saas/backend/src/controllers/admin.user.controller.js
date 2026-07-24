const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const {
  User, CreatorAccount, CreatorSubAccount, SaasTenant,
  UserMessage,
} = require('../models');
const ResponseUtil = require('../utils/response');
const { parsePagination } = require('../utils/common');

class AdminUserController {
  /**
   * 用户列表
   */
  static async getUserList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { keyword, userType, authStatus, status } = ctx.query;

    const where = { tenant_id: tenantId };
    if (keyword) {
      where[Op.or] = [
        { username: { [Op.like]: `%${keyword}%` } },
        { nickname: { [Op.like]: `%${keyword}%` } },
        { phone: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (userType !== undefined && userType !== '') where.user_type = Number(userType);
    if (authStatus !== undefined && authStatus !== '') where.auth_status = Number(authStatus);
    if (status !== undefined && status !== '') where.status = Number(status);

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 用户详情
   */
  static async getUserDetail(ctx) {
    const { id } = ctx.params;
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return ResponseUtil.fail(ctx, '用户不存在');
    }
    ResponseUtil.success(ctx, user);
  }

  /**
   * 启用/禁用用户
   */
  static async toggleUserStatus(ctx) {
    const { id } = ctx.params;
    const { status } = ctx.request.body;

    const user = await User.findByPk(id);
    if (!user) {
      return ResponseUtil.fail(ctx, '用户不存在');
    }

    await user.update({ status: Number(status) });

    ResponseUtil.success(ctx, null, status === 1 ? '已启用' : '已禁用');
  }

  /**
   * 创作者审核列表
   */
  static async getCreatorList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { status, creatorType, keyword } = ctx.query;

    const where = { tenant_id: tenantId };
    if (status !== undefined && status !== '') where.status = Number(status);
    if (creatorType) where.creator_type = Number(creatorType);
    if (keyword) where.creator_name = { [Op.like]: `%${keyword}%` };

    const { count, rows } = await CreatorAccount.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'phone', 'email'],
      }],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 审核创作者
   */
  static async auditCreator(ctx) {
    const { id } = ctx.params;
    const { pass, reason } = ctx.request.body;

    const creator = await CreatorAccount.findByPk(id);
    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者不存在');
    }

    await creator.update({
      status: pass ? 1 : 2,
      reject_reason: pass ? null : reason,
      verified_at: pass ? new Date() : null,
    });

    await UserMessage.create({
      tenant_id: creator.tenant_id,
      user_id: creator.user_id,
      msg_type: 4,
      title: pass ? '入驻审核通过' : '入驻审核未通过',
      content: pass
        ? '恭喜您的创作者入驻申请已通过审核，可以开始上传作品了。'
        : `您的创作者入驻申请未通过，原因：${reason}`,
      related_id: creator.id,
      related_type: 'creator_audit',
    });

    ResponseUtil.success(ctx, null, pass ? '审核通过' : '已驳回');
  }

  /**
   * 实名认证审核
   */
  static async auditRealName(ctx) {
    const { id } = ctx.params;
    const { pass, reason } = ctx.request.body;

    const user = await User.findByPk(id);
    if (!user) {
      return ResponseUtil.fail(ctx, '用户不存在');
    }

    await user.update({
      auth_status: pass ? 2 : 3,
      auth_reject_reason: pass ? null : reason,
    });

    await UserMessage.create({
      tenant_id: user.tenant_id,
      user_id: user.id,
      msg_type: 1,
      title: pass ? '实名认证通过' : '实名认证未通过',
      content: pass
        ? '您的实名认证已通过审核。'
        : `您的实名认证未通过，原因：${reason}`,
      related_id: user.id,
      related_type: 'realname_audit',
    });

    ResponseUtil.success(ctx, null, pass ? '审核通过' : '已驳回');
  }

  /**
   * 重置用户密码
   */
  static async resetUserPassword(ctx) {
    const { id } = ctx.params;
    const { newPassword } = ctx.request.body;

    if (!newPassword || newPassword.length < 6) {
      return ResponseUtil.fail(ctx, '新密码长度不能少于6位');
    }

    const user = await User.findByPk(id);
    if (!user) {
      return ResponseUtil.fail(ctx, '用户不存在');
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await user.update({ password: hashedPassword });

    ResponseUtil.success(ctx, null, '密码已重置');
  }
}

class AdminTenantController {
  static async getTenantList(ctx) {
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { keyword, status } = ctx.query;

    const where = {};
    if (keyword) {
      where[Op.or] = [
        { tenant_name: { [Op.like]: `%${keyword}%` } },
        { tenant_code: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (status !== undefined && status !== '') where.status = Number(status);

    const { count, rows } = await SaasTenant.findAndCountAll({
      where,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  static async createTenant(ctx) {
    const tenantData = ctx.request.body;

    if (!tenantData.tenantCode || !tenantData.tenantName) {
      return ResponseUtil.fail(ctx, '租户编码和名称不能为空');
    }

    const existing = await SaasTenant.findOne({
      where: { tenant_code: tenantData.tenantCode },
    });
    if (existing) {
      return ResponseUtil.fail(ctx, '租户编码已存在');
    }

    const tenant = await SaasTenant.create({
      tenant_code: tenantData.tenantCode,
      tenant_name: tenantData.tenantName,
      logo_url: tenantData.logoUrl,
      domain: tenantData.domain,
      contact_name: tenantData.contactName,
      contact_phone: tenantData.contactPhone,
      contact_email: tenantData.contactEmail,
      revenue_share_ratio: tenantData.revenueShareRatio,
      status: tenantData.status ?? 1,
      expire_time: tenantData.expireTime,
      remark: tenantData.remark,
    });

    ResponseUtil.success(ctx, { id: tenant.id }, '租户创建成功');
  }

  static async updateTenant(ctx) {
    const { id } = ctx.params;
    const tenantData = ctx.request.body;

    const tenant = await SaasTenant.findByPk(id);
    if (!tenant) {
      return ResponseUtil.fail(ctx, '租户不存在');
    }

    await tenant.update({
      tenant_name: tenantData.tenantName,
      logo_url: tenantData.logoUrl,
      domain: tenantData.domain,
      contact_name: tenantData.contactName,
      contact_phone: tenantData.contactPhone,
      contact_email: tenantData.contactEmail,
      revenue_share_ratio: tenantData.revenueShareRatio,
      status: tenantData.status,
      expire_time: tenantData.expireTime,
      remark: tenantData.remark,
    });

    ResponseUtil.success(ctx, null, '更新成功');
  }

  static async getTenantDetail(ctx) {
    const { id } = ctx.params;
    const tenant = await SaasTenant.findByPk(id);
    if (!tenant) {
      return ResponseUtil.fail(ctx, '租户不存在');
    }
    ResponseUtil.success(ctx, tenant);
  }
}

module.exports = { AdminUserController, AdminTenantController };
