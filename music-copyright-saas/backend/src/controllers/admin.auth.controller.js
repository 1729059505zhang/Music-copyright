const bcrypt = require('bcryptjs');
const { AdminUser, AdminRole, AdminRolePermission, AdminPermission } = require('../models');
const ResponseUtil = require('../utils/response');
const JwtUtil = require('../utils/jwt');

class AdminAuthController {
  /**
   * 管理员登录
   */
  static async login(ctx) {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      return ResponseUtil.fail(ctx, '用户名和密码不能为空');
    }

    const adminUser = await AdminUser.findOne({
      where: { tenant_id: 0, username },
      include: [{ model: AdminRole, as: 'role' }],
    });

    if (!adminUser) {
      return ResponseUtil.fail(ctx, '用户名或密码错误');
    }

    if (adminUser.status !== 1) {
      return ResponseUtil.fail(ctx, '账号已被禁用');
    }

    const isPasswordValid = bcrypt.compareSync(password, adminUser.password);
    if (!isPasswordValid) {
      return ResponseUtil.fail(ctx, '用户名或密码错误');
    }

    await AdminUser.update(
      { last_login_time: new Date(), last_login_ip: ctx.ip },
      { where: { id: adminUser.id } }
    );

    const token = JwtUtil.generateAdminToken({
      userId: adminUser.id,
      username: adminUser.username,
      tenantId: adminUser.tenant_id,
      userType: 'admin',
      roleId: adminUser.role_id,
    });

    ResponseUtil.success(ctx, {
      token,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        realName: adminUser.real_name,
        avatar: adminUser.avatar,
        roleId: adminUser.role_id,
      },
    }, '登录成功');
  }

  /**
   * 获取当前管理员信息
   */
  static async getCurrentAdmin(ctx) {
    const adminInfo = ctx.state.adminUser;
    const admin = await AdminUser.findByPk(adminInfo.userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: AdminRole, as: 'role' }],
    });

    if (!admin) {
      return ResponseUtil.fail(ctx, '管理员不存在', 404, 404);
    }

    const permissions = await AdminRolePermission.findAll({
      where: { role_id: admin.role_id },
      include: [{ model: AdminPermission, as: 'permission' }],
    });

    const permissionList = permissions.map(p => p.permission?.permission_code).filter(Boolean);

    ResponseUtil.success(ctx, {
      user: admin,
      permissions: permissionList,
    });
  }

  /**
   * 获取管理员菜单
   */
  static async getMenus(ctx) {
    const adminInfo = ctx.state.adminUser;
    const admin = await AdminUser.findByPk(adminInfo.userId);

    let menus = [];
    if (admin.role_id) {
      const rolePermissions = await AdminRolePermission.findAll({
        where: { role_id: admin.role_id },
        include: [{ model: AdminPermission, as: 'permission', where: { permission_type: 1, status: 1 } }],
      });

      menus = rolePermissions
        .map(rp => rp.permission)
        .filter(Boolean)
        .sort((a, b) => a.sort - b.sort);
    }

    ResponseUtil.success(ctx, menus);
  }

  /**
   * 修改密码
   */
  static async changePassword(ctx) {
    const userId = ctx.state.adminUser.userId;
    const { oldPassword, newPassword } = ctx.request.body;

    if (!oldPassword || !newPassword) {
      return ResponseUtil.fail(ctx, '旧密码和新密码不能为空');
    }

    const admin = await AdminUser.findByPk(userId);
    if (!admin) {
      return ResponseUtil.fail(ctx, '管理员不存在');
    }

    const isPasswordValid = bcrypt.compareSync(oldPassword, admin.password);
    if (!isPasswordValid) {
      return ResponseUtil.fail(ctx, '旧密码错误');
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await AdminUser.update({ password: hashedPassword }, { where: { id: userId } });

    ResponseUtil.success(ctx, null, '密码修改成功');
  }
}

module.exports = AdminAuthController;
