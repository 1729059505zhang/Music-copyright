const { Op } = require('sequelize');
const {
  CopyrightApply, CopyrightCertificate, MusicLyricWork,
  CreatorAccount, UserMessage,
} = require('../models');
const ResponseUtil = require('../utils/response');
const { generateCopyrightNo, parsePagination } = require('../utils/common');
const config = require('../config');

class CopyrightController {
  /**
   * 提交版权登记申请
   */
  static async createApply(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const applyData = ctx.request.body;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.fail(ctx, '创作者账号不存在');
    }

    if (!applyData.workId) {
      return ResponseUtil.fail(ctx, '作品ID不能为空');
    }

    const work = await MusicLyricWork.findOne({
      where: { id: applyData.workId, tenant_id: tenantId, creator_id: creator.id },
    });

    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在或无权限操作');
    }

    if (work.copyright_registered) {
      return ResponseUtil.fail(ctx, '该作品已完成版权登记');
    }

    const fee = config.finance.copyrightRegisterFee;

    const apply = await CopyrightApply.create({
      tenant_id: tenantId,
      work_id: applyData.workId,
      creator_id: creator.id,
      work_type: applyData.workType || 1,
      work_title: work.title,
      author_name: applyData.authorName || creator.creator_name,
      author_id_type: applyData.authorIdType,
      author_id_number: applyData.authorIdNumber,
      creation_date: applyData.creationDate,
      first_publish_date: applyData.firstPublishDate,
      copyright_owner: applyData.copyrightOwner || creator.creator_name,
      owner_type: applyData.ownerType || 1,
      work_sample_url: applyData.workSampleUrl,
      id_card_front: applyData.idCardFront,
      id_card_back: applyData.idCardBack,
      business_license: applyData.businessLicense,
      power_of_attorney: applyData.powerOfAttorney,
      other_materials: applyData.otherMaterials,
      apply_status: 1,
      apply_fee: fee,
      pay_status: 0,
    });

    await UserMessage.create({
      tenant_id: tenantId,
      user_id: userId,
      msg_type: 4,
      title: '版权登记申请已提交',
      content: `您对作品"${work.title}"的版权登记申请已提交，请等待审核。`,
      related_id: apply.id,
      related_type: 'copyright_apply',
    });

    ResponseUtil.success(ctx, { id: apply.id, fee }, '申请已提交');
  }

  /**
   * 我的版权登记申请列表
   */
  static async getMyApplyList(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { status } = ctx.query;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.successList(ctx, [], 0);
    }

    const where = {
      tenant_id: tenantId,
      creator_id: creator.id,
    };
    if (status !== undefined && status !== '') {
      where.apply_status = Number(status);
    }

    const { count, rows } = await CopyrightApply.findAndCountAll({
      where,
      include: [{
        model: MusicLyricWork,
        as: 'work',
        attributes: ['id', 'title', 'cover_url'],
      }],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 申请详情
   */
  static async getApplyDetail(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { id } = ctx.params;

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    const apply = await CopyrightApply.findOne({
      where: { id, tenant_id: tenantId, creator_id: creator?.id },
      include: [{
        model: MusicLyricWork,
        as: 'work',
      }, {
        model: CopyrightCertificate,
        as: 'certificate',
      }],
    });

    if (!apply) {
      return ResponseUtil.fail(ctx, '申请记录不存在');
    }

    ResponseUtil.success(ctx, apply);
  }

  /**
   * 我的版权证书
   */
  static async getMyCertificates(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);

    const creator = await CreatorAccount.findOne({
      where: { tenant_id: tenantId, user_id: userId },
    });

    if (!creator) {
      return ResponseUtil.successList(ctx, [], 0);
    }

    const applies = await CopyrightApply.findAll({
      where: { tenant_id: tenantId, creator_id: creator.id, apply_status: 2 },
      attributes: ['certificate_id'],
    });

    const certIds = applies.map(a => a.certificate_id).filter(Boolean);

    if (certIds.length === 0) {
      return ResponseUtil.successList(ctx, [], 0);
    }

    const { count, rows } = await CopyrightCertificate.findAndCountAll({
      where: { id: { [Op.in]: certIds }, status: 1 },
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }
}

module.exports = CopyrightController;
