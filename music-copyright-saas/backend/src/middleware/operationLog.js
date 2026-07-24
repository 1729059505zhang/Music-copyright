const { OperationLog } = require('../models');

/**
 * 后台操作日志中间件
 */
function operationLogMiddleware(options = {}) {
  return async (ctx, next) => {
    const startTime = Date.now();
    const adminUser = ctx.state.adminUser;

    let errorMsg = null;
    let status = 1;

    try {
      await next();
    } catch (error) {
      errorMsg = error.message;
      status = 0;
      throw error;
    } finally {
      if (adminUser && options.module) {
        const duration = Date.now() - startTime;
        try {
          await OperationLog.create({
            tenant_id: adminUser.tenantId || 0,
            user_id: adminUser.userId,
            username: adminUser.username,
            module: options.module,
            action: options.action || ctx.method + ' ' + ctx.path,
            method: ctx.method,
            path: ctx.path,
            params: JSON.stringify({
              query: ctx.query,
              body: ctx.request.body,
            }).slice(0, 5000),
            result: JSON.stringify(ctx.body).slice(0, 5000),
            ip: ctx.ip,
            user_agent: ctx.headers['user-agent'],
            status,
            error_msg: errorMsg,
            duration,
          });
        } catch (logError) {
          console.error('[OperationLog] 日志记录失败:', logError.message);
        }
      }
    }
  };
}

module.exports = operationLogMiddleware;
