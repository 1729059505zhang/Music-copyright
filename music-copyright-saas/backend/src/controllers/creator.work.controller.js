const { Op } = require('sequelize');
const {
  MusicLyricWork, WorkLicensePackage, MusicCategory,
  CreatorAccount, CreatorSubAccount,
} = require('../models');
const ResponseUtil = require('../utils/response');
const { parsePagination } = require('../utils/common');

class CreatorWorkController {
  /**
   * 获取创作者作品列表
   */
  static async getMyWorks(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { status, auditStatus, keyword } = ctx.query;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者信息不存在');
    }

    const where = {
      tenant_id: tenantId,
      creator_id: creator.id,
    };

    if (status !== undefined) where.status = Number(status);
    if (auditStatus !== undefined) where.audit_status = Number(auditStatus);
    if (keyword) where.title = { [Op.like]: `%${keyword}%` };

    const { count, rows } = await MusicLyricWork.findAndCountAll({
      where,
      include: [
        { model: MusicCategory, as: 'category', attributes: ['id', 'name'] },
        { model: WorkLicensePackage, as: 'packages', required: false },
      ],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 创建词曲作品
   */
  static async createWork(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const workData = ctx.request.body;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者信息不存在');
    }
    if (creator.status !== 1) {
      return ResponseUtil.fail(ctx, '创作者账号未通过审核，暂不能上传作品');
    }

    const { packages, ...basicData } = workData;

    const work = await MusicLyricWork.create({
      ...basicData,
      tenant_id: tenantId,
      creator_id: creator.id,
      lyric_preview: basicData.lyric ? basicData.lyric.substring(0, 300) + '...' : null,
      audit_status: 0,
      status: 0,
    });

    if (packages && packages.length > 0) {
      const pkgList = packages.map(pkg => ({
        ...pkg,
        tenant_id: tenantId,
        work_id: work.id,
      }));
      await WorkLicensePackage.bulkCreate(pkgList);
    }

    await CreatorAccount.increment('total_works', { where: { id: creator.id } });

    ResponseUtil.success(ctx, { id: work.id }, '作品创建成功，等待审核');
  }

  /**
   * 更新词曲作品
   */
  static async updateWork(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { id } = ctx.params;
    const workData = ctx.request.body;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者信息不存在');
    }

    const work = await MusicLyricWork.findOne({
      where: { id, tenant_id: tenantId, creator_id: creator.id },
    });

    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在或无权限修改');
    }

    const { packages, ...basicData } = workData;

    if (basicData.lyric) {
      basicData.lyric_preview = basicData.lyric.substring(0, 300) + '...';
    }

    basicData.audit_status = 0;
    await work.update(basicData);

    if (packages && packages.length > 0) {
      await WorkLicensePackage.destroy({ where: { work_id: id } });
      const pkgList = packages.map(pkg => ({
        ...pkg,
        tenant_id: tenantId,
        work_id: id,
      }));
      await WorkLicensePackage.bulkCreate(pkgList);
    }

    ResponseUtil.success(ctx, null, '作品更新成功，已重新提交审核');
  }

  /**
   * 上架/下架作品
   */
  static async toggleWorkStatus(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { id } = ctx.params;
    const { status, reason } = ctx.request.body;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者信息不存在');
    }

    const work = await MusicLyricWork.findOne({
      where: { id, tenant_id: tenantId, creator_id: creator.id },
    });

    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在或无权限操作');
    }

    if (status === 1 && work.audit_status !== 1) {
      return ResponseUtil.fail(ctx, '作品未通过审核，无法上架');
    }

    await work.update({
      status: Number(status),
      offline_reason: status === 0 ? reason : null,
    });

    ResponseUtil.success(ctx, null, status === 1 ? '作品已上架' : '作品已下架');
  }

  /**
   * 删除作品
   */
  static async deleteWork(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { id } = ctx.params;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者信息不存在');
    }

    const work = await MusicLyricWork.findOne({
      where: { id, tenant_id: tenantId, creator_id: creator.id },
    });

    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在或无权限删除');
    }

    await work.destroy();
    await WorkLicensePackage.destroy({ where: { work_id: id } });
    await CreatorAccount.decrement('total_works', { where: { id: creator.id } });

    ResponseUtil.success(ctx, null, '作品已删除');
  }

  /**
   * 获取作品详情（创作者端）
   */
  static async getWorkDetail(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { id } = ctx.params;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者信息不存在');
    }

    const work = await MusicLyricWork.findOne({
      where: { id, tenant_id: tenantId, creator_id: creator.id },
      include: [
        { model: WorkLicensePackage, as: 'packages' },
      ],
    });

    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在');
    }

    ResponseUtil.success(ctx, work);
  }
}

module.exports = CreatorWorkController;
