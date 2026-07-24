const { Op } = require('sequelize');
const {
  CopyrightApply, CopyrightCertificate, MusicLyricWork,
  MusicReleaseWork, UserMessage, CreatorAccount,
} = require('../models');
const ResponseUtil = require('../utils/response');
const { generateCopyrightNo, parsePagination, sha256Hash } = require('../utils/common');

class AdminCopyrightController {
  /**
   * 版权登记申请列表
   */
  static async getApplyList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { status, keyword } = ctx.query;

    const where = { tenant_id: tenantId };
    if (status !== undefined && status !== '') where.apply_status = Number(status);
    if (keyword) where.work_title = { [Op.like]: `%${keyword}%` };

    const { count, rows } = await CopyrightApply.findAndCountAll({
      where,
      include: [{
        model: CreatorAccount,
        as: 'creator',
        attributes: ['id', 'creator_name'],
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
    const { id } = ctx.params;

    const apply = await CopyrightApply.findByPk(id, {
      include: [
        { model: MusicLyricWork, as: 'work' },
        { model: CreatorAccount, as: 'creator' },
        { model: CopyrightCertificate, as: 'certificate' },
      ],
    });

    if (!apply) {
      return ResponseUtil.fail(ctx, '申请不存在');
    }

    ResponseUtil.success(ctx, apply);
  }

  /**
   * 审核版权登记申请
   */
  static async auditApply(ctx) {
    const adminUser = ctx.state.adminUser;
    const { id } = ctx.params;
    const { pass, reason } = ctx.request.body;

    const apply = await CopyrightApply.findByPk(id);
    if (!apply) {
      return ResponseUtil.fail(ctx, '申请不存在');
    }
    if (apply.apply_status !== 1) {
      return ResponseUtil.fail(ctx, '该申请已审核');
    }

    if (pass) {
      const certNo = generateCopyrightNo();
      const registerDate = new Date();

      const hashInput = `${apply.work_id}-${apply.work_title}-${registerDate.getTime()}`;
      const hashValue = sha256Hash(hashInput);

      const certificate = await CopyrightCertificate.create({
        tenant_id: apply.tenant_id,
        certificate_no: certNo,
        apply_id: apply.id,
        work_id: apply.work_id,
        work_title: apply.work_title,
        work_type: apply.work_type,
        author_name: apply.author_name,
        copyright_owner: apply.copyright_owner,
        register_date: registerDate,
        hash_value: hashValue,
        status: 1,
      });

      await apply.update({
        apply_status: 2,
        audit_user_id: adminUser.userId,
        audit_time: new Date(),
        certificate_id: certificate.id,
        registered_no: certNo,
      });

      if (apply.work_type === 1) {
        await MusicLyricWork.update(
          { copyright_registered: 1, copyright_cert_id: certificate.id },
          { where: { id: apply.work_id } }
        );
      }

      const creator = await CreatorAccount.findByPk(apply.creator_id);
      if (creator) {
        await UserMessage.create({
          tenant_id: apply.tenant_id,
          user_id: creator.user_id,
          msg_type: 4,
          title: '版权登记申请通过',
          content: `您对作品"${apply.work_title}"的版权登记申请已通过，证书编号：${certNo}`,
          related_id: apply.id,
          related_type: 'copyright_apply',
        });
      }
    } else {
      await apply.update({
        apply_status: 3,
        audit_user_id: adminUser.userId,
        audit_time: new Date(),
        reject_reason: reason,
      });

      const creator = await CreatorAccount.findByPk(apply.creator_id);
      if (creator) {
        await UserMessage.create({
          tenant_id: apply.tenant_id,
          user_id: creator.user_id,
          msg_type: 4,
          title: '版权登记申请未通过',
          content: `您对作品"${apply.work_title}"的版权登记申请未通过，原因：${reason}`,
          related_id: apply.id,
          related_type: 'copyright_apply',
        });
      }
    }

    ResponseUtil.success(ctx, null, pass ? '审核通过' : '已驳回');
  }

  /**
   * 版权证书列表
   */
  static async getCertificateList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { keyword, status } = ctx.query;

    const where = { tenant_id: tenantId };
    if (keyword) {
      where[Op.or] = [
        { work_title: { [Op.like]: `%${keyword}%` } },
        { certificate_no: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (status !== undefined && status !== '') where.status = Number(status);

    const { count, rows } = await CopyrightCertificate.findAndCountAll({
      where,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 补发证书
   */
  static async reissueCertificate(ctx) {
    const { id } = ctx.params;

    const cert = await CopyrightCertificate.findByPk(id);
    if (!cert) {
      return ResponseUtil.fail(ctx, '证书不存在');
    }

    await cert.increment('reissue_count');

    ResponseUtil.success(ctx, null, '证书已补发');
  }

  /**
   * 发行作品审核列表
   */
  static async getReleaseWorkList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { auditStatus, keyword } = ctx.query;

    const where = { tenant_id: tenantId };
    if (auditStatus !== undefined && auditStatus !== '') where.audit_status = Number(auditStatus);
    if (keyword) where.title = { [Op.like]: `%${keyword}%` };

    const { count, rows } = await MusicReleaseWork.findAndCountAll({
      where,
      include: [{
        model: CreatorAccount,
        as: 'creator',
        attributes: ['id', 'creator_name'],
      }],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 审核发行作品
   */
  static async auditReleaseWork(ctx) {
    const adminUser = ctx.state.adminUser;
    const { id } = ctx.params;
    const { pass, reason } = ctx.request.body;

    const work = await MusicReleaseWork.findByPk(id);
    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在');
    }

    await work.update({
      audit_status: pass ? 1 : 2,
      audit_reject_reason: pass ? null : reason,
      audit_time: new Date(),
      status: pass ? 1 : 0,
    });

    ResponseUtil.success(ctx, null, pass ? '审核通过' : '已驳回');
  }
}

module.exports = AdminCopyrightController;
