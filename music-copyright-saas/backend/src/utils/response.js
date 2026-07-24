/**
 * 统一响应工具
 */
class ResponseUtil {
  static success(ctx, data = null, message = '操作成功') {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      message,
      data,
    };
  }

  static successList(ctx, list = [], total = 0, message = '获取成功') {
    ctx.status = 200;
    ctx.body = {
      code: 0,
      message,
      data: {
        list,
        total,
      },
    };
  }

  static fail(ctx, message = '操作失败', code = 1, status = 200) {
    ctx.status = status;
    ctx.body = {
      code,
      message,
      data: null,
    };
  }

  static error(ctx, error) {
    const status = error.status || 500;
    const code = error.code || 500;
    const message = error.message || '服务器内部错误';
    ctx.status = status;
    ctx.body = {
      code,
      message,
      data: null,
    };
  }
}

module.exports = ResponseUtil;
