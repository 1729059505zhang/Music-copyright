const { Op } = require('sequelize');
const {
  MusicLyricWork, WorkLicensePackage, MusicCategory,
  CreatorAccount, Collection, InquiryRecord, UserMessage,
} = require('../models');
const ResponseUtil = require('../utils/response');
const { parsePagination } = require('../utils/common');

class WorkController {
  /**
   * 词曲作品列表（采购方集市）
   */
  static async getWorkList(ctx) {
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const {
      keyword, categoryId, style, language, tempoMin, tempoMax,
      tonality, mood, scenario, priceMin, priceMax,
      isExclusive, saleMode, sortBy,
    } = ctx.query;

    const where = {
      tenant_id: tenantId,
      status: 1,
      audit_status: 1,
    };

    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { subtitle: { [Op.like]: `%${keyword}%` } },
      ];
    }
    if (categoryId) where.category_id = categoryId;
    if (language) where.language = language;
    if (tonality) where.tonality = tonality;
    if (mood) where.mood = mood;
    if (scenario) where.scenario = scenario;
    if (isExclusive !== undefined) where.is_exclusive_available = isExclusive === '1' ? 1 : 0;
    if (saleMode) where.sale_mode = Number(saleMode);
    if (tempoMin || tempoMax) {
      where.tempo = {};
      if (tempoMin) where.tempo[Op.gte] = Number(tempoMin);
      if (tempoMax) where.tempo[Op.lte] = Number(tempoMax);
    }

    let order = [['created_at', 'DESC']];
    if (sortBy === 'sales') order = [['sale_count', 'DESC']];
    else if (sortBy === 'views') order = [['view_count', 'DESC']];
    else if (sortBy === 'price_asc') order = [['id', 'ASC']];
    else if (sortBy === 'price_desc') order = [['id', 'DESC']];

    const { count, rows } = await MusicLyricWork.findAndCountAll({
      where,
      include: [
        { model: MusicCategory, as: 'category', attributes: ['id', 'name'] },
        { model: CreatorAccount, as: 'creator', attributes: ['id', 'creator_name', 'creator_type', 'logo'] },
        { model: WorkLicensePackage, as: 'packages', where: { status: 1 }, required: false },
      ],
      distinct: true,
      offset,
      limit,
      order,
    });

    if (priceMin || priceMax) {
      const filtered = rows.filter(work => {
        if (!work.packages || work.packages.length === 0) return false;
        const prices = work.packages.map(p => p.price);
        const minPrice = Math.min(...prices);
        if (priceMin && minPrice < Number(priceMin)) return false;
        if (priceMax && minPrice > Number(priceMax)) return false;
        return true;
      });
      return ResponseUtil.successList(ctx, filtered, filtered.length);
    }

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 作品详情
   */
  static async getWorkDetail(ctx) {
    const { id } = ctx.params;
    const tenantId = ctx.state.tenantId || 0;

    const work = await MusicLyricWork.findOne({
      where: { id, tenant_id: tenantId },
      include: [
        { model: MusicCategory, as: 'category', attributes: ['id', 'name'] },
        { model: CreatorAccount, as: 'creator', attributes: ['id', 'creator_name', 'creator_type', 'logo', 'description', 'total_works', 'total_sales'] },
        { model: WorkLicensePackage, as: 'packages', where: { status: 1 }, required: false },
      ],
    });

    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在', 404, 404);
    }

    await MusicLyricWork.increment('view_count', { where: { id } });

    let isFavorited = false;
    if (ctx.state.user) {
      const fav = await Collection.findOne({
        where: {
          tenant_id: tenantId,
          user_id: ctx.state.user.userId,
          work_id: id,
          work_type: 1,
        },
      });
      isFavorited = !!fav;
    }

    ResponseUtil.success(ctx, {
      ...work.toJSON(),
      isFavorited,
    });
  }

  /**
   * 收藏/取消收藏
   */
  static async toggleFavorite(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { workId, workType = 1 } = ctx.request.body;

    if (!workId) {
      return ResponseUtil.fail(ctx, '作品ID不能为空');
    }

    const existing = await Collection.findOne({
      where: { tenant_id: tenantId, user_id: userId, work_id: workId, work_type: workType },
    });

    if (existing) {
      await existing.destroy();
      await MusicLyricWork.decrement('favorite_count', { where: { id: workId } });
      ResponseUtil.success(ctx, { isFavorited: false }, '已取消收藏');
    } else {
      await Collection.create({
        tenant_id: tenantId,
        user_id: userId,
        work_id: workId,
        work_type: workType,
      });
      await MusicLyricWork.increment('favorite_count', { where: { id: workId } });
      ResponseUtil.success(ctx, { isFavorited: true }, '收藏成功');
    }
  }

  /**
   * 我的收藏列表
   */
  static async getFavoriteList(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);

    const { count, rows } = await Collection.findAndCountAll({
      where: { tenant_id: tenantId, user_id: userId, work_type: 1 },
      include: [{
        model: MusicLyricWork,
        as: 'work',
        include: [
          { model: CreatorAccount, as: 'creator', attributes: ['id', 'creator_name'] },
          { model: WorkLicensePackage, as: 'packages', where: { status: 1 }, required: false },
        ],
      }],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    ResponseUtil.successList(ctx, rows, count);
  }

  /**
   * 发起询价
   */
  static async createInquiry(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const {
      workId, licenseType, expectedPrice, usageScenario,
      contactName, contactPhone, contactEmail, message,
    } = ctx.request.body;

    if (!workId) {
      return ResponseUtil.fail(ctx, '作品ID不能为空');
    }

    const work = await MusicLyricWork.findByPk(workId);
    if (!work) {
      return ResponseUtil.fail(ctx, '作品不存在');
    }

    const inquiry = await InquiryRecord.create({
      tenant_id: tenantId,
      work_id: workId,
      buyer_id: userId,
      creator_id: work.creator_id,
      license_type: licenseType,
      expected_price: expectedPrice,
      usage_scenario: usageScenario,
      contact_name: contactName,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      message,
      inquiry_status: 0,
    });

    await UserMessage.create({
      tenant_id: tenantId,
      user_id: userId,
      msg_type: 3,
      title: '询价提交成功',
      content: `您对作品"${work.title}"的询价已提交，创作者将尽快回复。`,
      related_id: inquiry.id,
      related_type: 'inquiry',
    });

    ResponseUtil.success(ctx, inquiry, '询价已提交');
  }

  /**
   * 我的询价记录
   */
  static async getInquiryList(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);

    const { count, rows } = await InquiryRecord.findAndCountAll({
      where: { tenant_id: tenantId, buyer_id: userId },
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
}

module.exports = WorkController;
