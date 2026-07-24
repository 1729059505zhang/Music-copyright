const { UserMessage } = require('../models');
const ResponseUtil = require('../utils/response');
const { parsePagination } = require('../utils/common');

class MessageController {
  /**
   * 获取消息列表
   */
  static async getMessageList(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;
    const { page, pageSize, offset, limit } = parsePagination(ctx.query);
    const { msgType, isRead } = ctx.query;

    const where = {
      tenant_id: tenantId,
      user_id: userId,
    };
    if (msgType) where.msg_type = Number(msgType);
    if (isRead !== undefined && isRead !== '') where.is_read = Number(isRead);

    const { count, rows } = await UserMessage.findAndCountAll({
      where,
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    const unreadCount = await UserMessage.count({
      where: { tenant_id: tenantId, user_id: userId, is_read: 0 },
    });

    ResponseUtil.success(ctx, {
      list: rows,
      total: count,
      unreadCount,
    });
  }

  /**
   * 标记已读
   */
  static async markAsRead(ctx) {
    const userId = ctx.state.user.userId;
    const { id } = ctx.params;

    const msg = await UserMessage.findOne({ where: { id, user_id: userId } });
    if (!msg) {
      return ResponseUtil.fail(ctx, '消息不存在');
    }

    await msg.update({ is_read: 1, read_time: new Date() });
    ResponseUtil.success(ctx, null, '已标记为已读');
  }

  /**
   * 全部标记已读
   */
  static async markAllAsRead(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;

    await UserMessage.update(
      { is_read: 1, read_time: new Date() },
      { where: { tenant_id: tenantId, user_id: userId, is_read: 0 } }
    );

    ResponseUtil.success(ctx, null, '全部标记为已读');
  }

  /**
   * 删除消息
   */
  static async deleteMessage(ctx) {
    const userId = ctx.state.user.userId;
    const { id } = ctx.params;

    const msg = await UserMessage.findOne({ where: { id, user_id: userId } });
    if (!msg) {
      return ResponseUtil.fail(ctx, '消息不存在');
    }

    await msg.destroy();
    ResponseUtil.success(ctx, null, '已删除');
  }

  /**
   * 获取未读数量
   */
  static async getUnreadCount(ctx) {
    const userId = ctx.state.user.userId;
    const tenantId = ctx.state.tenantId || 0;

    const count = await UserMessage.count({
      where: { tenant_id: tenantId, user_id: userId, is_read: 0 },
    });

    ResponseUtil.success(ctx, { unreadCount: count });
  }
}

module.exports = MessageController;
