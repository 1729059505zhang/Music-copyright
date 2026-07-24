const ResponseUtil = require('../utils/response');
const JwtUtil = require('../utils/jwt');

/**
 * 前台用户认证中间件
 */
function authMiddleware(ctx, next) {
  const token = ctx.headers.authorization?.replace('Bearer ', '') || ctx.query.token;

  if (!token) {
    return ResponseUtil.fail(ctx, '未登录，请先登录', 401, 401);
  }

  const decoded = JwtUtil.verifyToken(token);
  if (!decoded) {
    return ResponseUtil.fail(ctx, '登录已过期，请重新登录', 401, 401);
  }

  if (decoded.userType !== 'user') {
    return ResponseUtil.fail(ctx, '无效的用户令牌', 401, 401);
  }

  ctx.state.user = decoded;
  ctx.state.tenantId = decoded.tenantId || 0;
  return next();
}

/**
 * 后台管理员认证中间件
 */
function adminAuthMiddleware(ctx, next) {
  const token = ctx.headers.authorization?.replace('Bearer ', '') || ctx.query.token;

  if (!token) {
    return ResponseUtil.fail(ctx, '未登录，请先登录', 401, 401);
  }

  const decoded = JwtUtil.verifyToken(token);
  if (!decoded) {
    return ResponseUtil.fail(ctx, '登录已过期，请重新登录', 401, 401);
  }

  if (decoded.userType !== 'admin') {
    return ResponseUtil.fail(ctx, '无效的管理员令牌', 403, 403);
  }

  ctx.state.adminUser = decoded;
  ctx.state.tenantId = decoded.tenantId || 0;
  return next();
}

/**
 * 可选认证（不强制登录，但解析token）
 */
function optionalAuthMiddleware(ctx, next) {
  const token = ctx.headers.authorization?.replace('Bearer ', '') || ctx.query.token;

  if (token) {
    const decoded = JwtUtil.verifyToken(token);
    if (decoded) {
      ctx.state.user = decoded;
      ctx.state.tenantId = decoded.tenantId || 0;
    }
  }

  if (!ctx.state.tenantId) {
    ctx.state.tenantId = 0;
  }

  return next();
}

module.exports = {
  authMiddleware,
  adminAuthMiddleware,
  optionalAuthMiddleware,
};
