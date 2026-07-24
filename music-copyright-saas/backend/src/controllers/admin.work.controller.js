const { Op } = require('sequelize');
const {
  MusicLyricWork, WorkLicensePackage, MusicCategory,
  CreatorAccount, UserMessage,
} = require('../models');
const ResponseUtil = require('../utils/response');
const { parsePagination } = require('../utils/common');

class AdminWorkController {
  /**
   * 词曲作品列表（后台）
   */
  static async getWorkList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { status, auditStatus, keyword, creatorId } = ctx.query;

    const where = { tenant_id: tenantId };
    if (status !== undefined && status !== '') where.status = Number(status);
    if (auditStatus !== undefined && auditStatus !== '') where.audit_status = Number(auditStatus);
    if (keyword) where.title = { [Op.like]: `%${keyword}%` };
    if (creatorId) where.creator_id = creatorId;

    const { count, rows } = await MusicLyricWork.findAndCountAll({
      where,
      include: [
        { model: MusicCategory, as: 'category', attributes: ['id', 'name'] },
        { model: CreatorAccount, as: 'creator', attributes: ['id', 'creator_name'] },
      ],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 审核作品
   */
  static async auditWork(ctx) {
    const adminUser = ctx.state.adminUser;
    const { id } = ctx.params;
    const { pass, reason } = ctx.request.body;

    const work = await MusicLyricWork.findByPk(id);
    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在');
    }

    await work.update({
      audit_status: pass ? 1 : 2,
      audit_reject_reason: pass ? null : reason,
      audit_time: new Date(),
      audit_user_id: adminUser.userId,
      status: pass ? 1 : 0,
    });

    if (work.creator_id) {
      const creator = await CreatorAccount.findByPk(work.creator_id);
      if (creator) {
        await UserMessage.create({
          tenant_id: work.tenant_id,
          user_id: creator.user_id,
          msg_type: 4,
          title: pass ? '作品审核通过' : '作品审核未通过',
          content: pass
            ? `您的作品"${work.title}"已通过审核，现已上架。`
            : `您的作品"${work.title}"审核未通过，原因：${reason}`,
          related_id: work.id,
          related_type: 'work_audit',
        });
      }
    }

    ResponseUtil.success(ctx, null, pass ? '审核通过' : '已驳回');
  }

  /**
   * 上架/下架作品
   */
  static async toggleWorkStatus(ctx) {
    const { id } = ctx.params;
    const { status, reason } = ctx.request.body;

    const work = await MusicLyricWork.findByPk(id);
    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在');
    }

    await work.update({
      status: Number(status),
      offline_reason: status === 0 ? reason : null,
    });

    ResponseUtil.success(ctx, null, status === 1 ? '已上架' : '已下架');
  }

  /**
   * 获取作品详情（后台）
   */
  static async getWorkDetail(ctx) {
    const { id } = ctx.params;

    const work = await MusicLyricWork.findByPk(id, {
      include: [
        { model: WorkLicensePackage, as: 'packages' },
        { model: CreatorAccount, as: 'creator', attributes: ['id', 'creator_name'] },
      ],
    });

    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在');
    }

    ResponseUtil.success(ctx, work);
  }

  /**
   * 删除作品
   */
  static async deleteWork(ctx) {
    const { id } = ctx.params;

    const work = await MusicLyricWork.findByPk(id);
    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在');
    }

    await work.destroy();
    await WorkLicensePackage.destroy({ where: { work_id: id } });

    ResponseUtil.success(ctx, null, '作品已删除');
  }
}

module.exports = AdminWorkController;
