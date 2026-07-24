const ResponseUtil = require('../utils/response');

/**
 * 全局异常处理中间件
 */
function errorHandler() {
  return async (ctx, next) => {
    try {
      await next();

      if (ctx.status === 404 && !ctx.body) {
        ResponseUtil.fail(ctx, '接口不存在', 404, 404);
      }
    } catch (error) {
      console.error('[Error]', error);

      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message).join('; ');
        ResponseUtil.fail(ctx, `参数验证失败: ${errors}`, 400, 400);
        return;
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        ResponseUtil.fail(ctx, '数据唯一约束冲突', 400, 400);
        return;
      }

      if (error.status === 401 || error.code === 401) {
        ResponseUtil.fail(ctx, error.message || '未授权', 401, 401);
        return;
      }

      if (error.status === 403 || error.code === 403) {
        ResponseUtil.fail(ctx, error.message || '权限不足', 403, 403);
        return;
      }

      if (error.code === 'LIMIT_FILE_SIZE') {
        ResponseUtil.fail(ctx, '文件大小超出限制', 413, 413);
        return;
      }

      ResponseUtil.error(ctx, error);
    }
  };
}

module.exports = errorHandler;
