const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const {
  AdminUser, AdminRole, AdminPermission, AdminRolePermission,
  SystemConfig, ThirdApiConfig, OperationLog, MusicCategory,
} = require('../models');
const ResponseUtil = require('../utils/response');
const { parsePagination } = require('../utils/common');

class AdminSystemController {
  /**
   * 管理员列表
   */
  static async getAdminList(ctx) {
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { keyword, roleId, status } = ctx.query;

    const where = { tenant_id: 0 };
    if (keyword) {
      where[Op.or] = [
        { username: { [Op.like]: `%${keyword}%` } },
        { real_name: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (roleId) where.role_id = roleId;
    if (status !== undefined && status !== '') where.status = Number(status);

    const { count, rows } = await AdminUser.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{ model: AdminRole, as: 'role' }],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  static async createAdmin(ctx) {
    const adminUser = ctx.state.adminUser;
    const { username, password, realName, phone, email, roleId } = ctx.request.body;

    if (!username || !password) {
      return ResponseUtil.fail(ctx, '用户名和密码不能为空');
    }

    const existing = await AdminUser.findOne({ where: { tenant_id: 0, username } });
    if (existing) {
      return ResponseUtil.fail(ctx, '用户名已存在');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const admin = await AdminUser.create({
      tenant_id: 0,
      username,
      password: hashedPassword,
      real_name: realName,
      phone,
      email,
      role_id: roleId,
      status: 1,
      created_by: adminUser.userId,
    });

    ResponseUtil.success(ctx, { id: admin.id }, '创建成功');
  }

  static async updateAdmin(ctx) {
    const { id } = ctx.params;
    const { realName, phone, email, roleId, status } = ctx.request.body;

    const admin = await AdminUser.findByPk(id);
    if (!admin) {
      return ResponseUtil.fail(ctx, '管理员不存在');
    }

    await admin.update({
      real_name: realName,
      phone,
      email,
      role_id: roleId,
      status,
    });

    ResponseUtil.success(ctx, null, '更新成功');
  }

  static async resetAdminPassword(ctx) {
    const { id } = ctx.params;
    const { newPassword } = ctx.request.body;

    if (!newPassword || newPassword.length < 6) {
      return ResponseUtil.fail(ctx, '密码长度不能少于6位');
    }

    const admin = await AdminUser.findByPk(id);
    if (!admin) {
      return ResponseUtil.fail(ctx, '管理员不存在');
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await admin.update({ password: hashedPassword });

    ResponseUtil.success(ctx, null, '密码已重置');
  }

  static async getRoleList(ctx) {
    const roles = await AdminRole.findAll({
      where: { tenant_id: 0 },
      order: [['id', 'ASC']],
    });
    ResponseUtil.success(ctx, roles);
  }

  static async createRole(ctx) {
    const { roleName, roleCode, description } = ctx.request.body;

    if (!roleName || !roleCode) {
      return ResponseUtil.fail(ctx, '角色名称和编码不能为空');
    }

    const existing = await AdminRole.findOne({ where: { tenant_id: 0, role_code: roleCode } });
    if (existing) {
      return ResponseUtil.fail(ctx, '角色编码已存在');
    }

    const role = await AdminRole.create({
      tenant_id: 0,
      role_name: roleName,
      role_code: roleCode,
      description,
      status: 1,
    });

    ResponseUtil.success(ctx, { id: role.id }, '创建成功');
  }

  static async getRolePermissions(ctx) {
    const { roleId } = ctx.params;

    const rolePermissions = await AdminRolePermission.findAll({
      where: { role_id: roleId },
      attributes: ['permission_id'],
    });

    const permissionIds = rolePermissions.map(rp => rp.permission_id);

    ResponseUtil.success(ctx, permissionIds);
  }

  static async assignRolePermissions(ctx) {
    const { roleId } = ctx.params;
    const { permissionIds } = ctx.request.body;

    await AdminRolePermission.destroy({ where: { role_id: roleId } });

    if (permissionIds && permissionIds.length > 0) {
      const rpList = permissionIds.map(pid => ({
        role_id: roleId,
        permission_id: pid,
      }));
      await AdminRolePermission.bulkCreate(rpList);
    }

    ResponseUtil.success(ctx, null, '权限已分配');
  }

  static async getPermissionTree(ctx) {
    const permissions = await AdminPermission.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC'], ['id', 'ASC']],
    });

    const buildTree = (parentId) => {
      return permissions
        .filter(p => p.parent_id === parentId)
        .map(p => ({
          ...p.toJSON(),
          children: buildTree(p.id),
        }));
    };

    const tree = buildTree(0);
    ResponseUtil.success(ctx, tree);
  }

  static async getSystemConfig(ctx) {
    const { group } = ctx.query;
    const where = {};
    if (group) where.config_group = group;

    const configs = await SystemConfig.findAll({ where, order: [['id', 'ASC']] });

    const result = {};
    configs.forEach(cfg => {
      let value = cfg.config_value;
      if (cfg.config_type === 'number') value = Number(value);
      else if (cfg.config_type === 'boolean') value = value === '1' || value === 'true';
      else if (cfg.config_type === 'json') {
        try { value = JSON.parse(value); } catch (e) { value = null; }
      }
      result[cfg.config_key] = value;
    });

    ResponseUtil.success(ctx, result);
  }

  static async updateSystemConfig(ctx) {
    const configs = ctx.request.body;

    for (const [key, value] of Object.entries(configs)) {
      const cfg = await SystemConfig.findOne({ where: { config_key: key } });
      if (cfg) {
        let strValue = value;
        if (typeof value === 'object') strValue = JSON.stringify(value);
        else if (typeof value === 'boolean') strValue = value ? '1' : '0';
        else strValue = String(value);

        await cfg.update({ config_value: strValue });
      }
    }

    ResponseUtil.success(ctx, null, '配置已更新');
  }

  static async getThirdApiList(ctx) {
    const { apiType } = ctx.query;
    const where = {};
    if (apiType) where.api_type = apiType;

    const configs = await ThirdApiConfig.findAll({ where, order: [['id', 'DESC']] });
    ResponseUtil.success(ctx, configs);
  }

  static async createThirdApi(ctx) {
    const data = ctx.request.body;
    const config = await ThirdApiConfig.create(data);
    ResponseUtil.success(ctx, { id: config.id }, '创建成功');
  }

  static async updateThirdApi(ctx) {
    const { id } = ctx.params;
    const data = ctx.request.body;

    const config = await ThirdApiConfig.findByPk(id);
    if (!config) {
      return ResponseUtil.fail(ctx, '配置不存在');
    }

    await config.update(data);
    ResponseUtil.success(ctx, null, '更新成功');
  }

  static async deleteThirdApi(ctx) {
    const { id } = ctx.params;
    await ThirdApiConfig.destroy({ where: { id } });
    ResponseUtil.success(ctx, null, '已删除');
  }

  static async getOperationLogs(ctx) {
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { module, username, startDate, endDate } = ctx.query;

    const where = {};
    if (module) where.module = module;
    if (username) where.username = { [Op.like]: `%${username}%` };
    if (startDate && endDate) {
      where.created_at = { [Op.between]: [startDate, endDate + ' 23:59:59'] };
    }

    const { count, rows } = await OperationLog.findAndCountAll({
      where,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }
}

class AdminCategoryController {
  static async getCategoryList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const categories = await MusicCategory.findAll({
      where: { tenant_id: [0, tenantId], status: 1 },
      order: [['sort', 'ASC'], ['id', 'ASC']],
    });

    const buildTree = (parentId) => {
      return categories
        .filter(c => c.parent_id === parentId)
        .map(c => ({
          ...c.toJSON(),
          children: buildTree(c.id),
        }));
    };

    const tree = buildTree(0);
    ResponseUtil.success(ctx, tree);
  }

  static async createCategory(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { parentId, name, sort, status } = ctx.request.body;

    if (!name) {
      return ResponseUtil.fail(ctx, '分类名称不能为空');
    }

    const category = await MusicCategory.create({
      tenant_id: tenantId,
      parent_id: parentId || 0,
      name,
      sort: sort || 0,
      status: status ?? 1,
    });

    ResponseUtil.success(ctx, { id: category.id }, '创建成功');
  }

  static async updateCategory(ctx) {
    const { id } = ctx.params;
    const { name, sort, status, parentId } = ctx.request.body;

    const category = await MusicCategory.findByPk(id);
    if (!category) {
      return ResponseUtil.fail(ctx, '分类不存在');
    }

    await category.update({
      name,
      sort,
      status,
      parent_id: parentId,
    });

    ResponseUtil.success(ctx, null, '更新成功');
  }

  static async deleteCategory(ctx) {
    const { id } = ctx.params;

    const hasChildren = await MusicCategory.count({ where: { parent_id: id } });
    if (hasChildren > 0) {
      return ResponseUtil.fail(ctx, '该分类下有子分类，无法删除');
    }

    await MusicCategory.destroy({ where: { id } });
    ResponseUtil.success(ctx, null, '已删除');
  }
}

module.exports = { AdminSystemController, AdminCategoryController };
