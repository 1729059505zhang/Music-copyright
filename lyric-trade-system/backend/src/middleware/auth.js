const jwt = require('jsonwebtoken');
const database = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'lyric-trade-secret-key-2024';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未登录，请先登录' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = database.db.prepare('SELECT id, username, email, role, avatar, balance, is_verified FROM users WHERE id = ?').get(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: '登录已过期，请重新登录' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '无权访问，需要管理员权限' });
  }
  next();
}

function sellerMiddleware(req, res, next) {
  if (!['seller', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: '无权访问，需要卖家权限' });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware, sellerMiddleware, JWT_SECRET };
