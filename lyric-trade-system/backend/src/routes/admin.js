const express = require('express');
const database = require('../database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware, adminMiddleware);

router.get('/stats', (req, res) => {
  const totalUsers = database.db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalWorks = database.db.prepare('SELECT COUNT(*) as count FROM works').get().count;
  const approvedWorks = database.db.prepare("SELECT COUNT(*) as count FROM works WHERE status = 'approved'").get().count;
  const pendingWorks = database.db.prepare("SELECT COUNT(*) as count FROM works WHERE status = 'pending'").get().count;
  const totalOrders = database.db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  const completedOrders = database.db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'").get().count;
  const totalSales = database.db.prepare("SELECT COALESCE(SUM(price), 0) as total FROM orders WHERE status IN ('paid','completed')").get().total;
  const totalUsersByRole = database.db.prepare('SELECT role, COUNT(*) as count FROM users GROUP BY role').all();
  const recentOrders = database.db.prepare(`
    SELECT orders.*, works.title as work_title, u1.username as buyer_name, u2.username as seller_name
    FROM orders LEFT JOIN works ON orders.work_id = works.id
    LEFT JOIN users u1 ON orders.buyer_id = u1.id
    LEFT JOIN users u2 ON orders.seller_id = u2.id
    ORDER BY orders.created_at DESC LIMIT 10
  `).all();
  const topWorks = database.db.prepare(`
    SELECT works.*, users.username as seller_name FROM works
    LEFT JOIN users ON works.seller_id = users.id
    ORDER BY works.sales DESC LIMIT 5
  `).all();
  const topSellers = database.db.prepare(`
    SELECT users.id, users.username, users.avatar, users.is_verified,
      (SELECT COUNT(*) FROM works WHERE works.seller_id = users.id AND works.status = 'approved') as works_count,
      (SELECT COALESCE(SUM(works.sales),0) FROM works WHERE works.seller_id = users.id) as total_sales,
      (SELECT COALESCE(SUM(orders.price),0) FROM orders WHERE orders.seller_id = users.id AND orders.status IN ('paid','completed')) as total_earn
    FROM users WHERE users.role = 'seller' ORDER BY total_earn DESC LIMIT 5
  `).all();

  res.json({
    totalUsers, totalWorks, approvedWorks, pendingWorks,
    totalOrders, completedOrders, totalSales,
    totalUsersByRole, recentOrders, topWorks, topSellers
  });
});

router.get('/users', (req, res) => {
  const { page = 1, pageSize = 20, keyword, role } = req.query;
  const offset = (page - 1) * pageSize;
  let where = [];
  let params = [];
  if (keyword) {
    where.push('(username LIKE ? OR email LIKE ?)');
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  if (role && role !== 'all') {
    where.push('role = ?');
    params.push(role);
  }
  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const list = database.db.prepare(`SELECT * FROM users ${whereStr} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, parseInt(pageSize), parseInt(offset));
  const { count } = database.db.prepare(`SELECT COUNT(*) as count FROM users ${whereStr}`).get(...params);
  res.json({ list, total: count });
});

router.put('/users/:id', (req, res) => {
  const { role, is_verified, balance } = req.body;
  database.db.prepare(`
    UPDATE users SET role = COALESCE(?, role), is_verified = COALESCE(?, is_verified), balance = COALESCE(?, balance)
    WHERE id = ?
  `).run(role || null, is_verified !== undefined ? (is_verified ? 1 : 0) : null, balance !== undefined ? parseFloat(balance) : null, req.params.id);
  res.json({ message: '更新成功' });
});

router.get('/works', (req, res) => {
  const { page = 1, pageSize = 20, status, keyword } = req.query;
  const offset = (page - 1) * pageSize;
  let where = [];
  let params = [];
  if (status && status !== 'all') {
    where.push('works.status = ?');
    params.push(status);
  }
  if (keyword) {
    where.push('(works.title LIKE ? OR works.description LIKE ?)');
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const list = database.db.prepare(`
    SELECT works.*, users.username as seller_name, categories.name as category_name
    FROM works LEFT JOIN users ON works.seller_id = users.id
    LEFT JOIN categories ON works.category_id = categories.id
    ${whereStr} ORDER BY works.created_at DESC LIMIT ? OFFSET ?
  `).all(...params, parseInt(pageSize), parseInt(offset));
  const { count } = database.db.prepare(`SELECT COUNT(*) as count FROM works ${whereStr}`).get(...params);
  res.json({ list, total: count });
});

router.put('/works/:id/audit', (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: '无效状态' });
  }
  database.db.prepare('UPDATE works SET status = ? WHERE id = ?').run(status, req.params.id);
  database.db.prepare('INSERT INTO admin_logs (admin_id, action, target_type, target_id, detail) VALUES (?, ?, ?, ?, ?)')
    .run(req.user.id, status === 'approved' ? '作品审核通过' : '作品审核拒绝', 'work', parseInt(req.params.id), status);
  res.json({ message: status === 'approved' ? '审核通过' : '已拒绝' });
});

router.get('/orders', (req, res) => {
  const { page = 1, pageSize = 20, status } = req.query;
  const offset = (page - 1) * pageSize;
  let where = [];
  let params = [];
  if (status && status !== 'all') {
    where.push('orders.status = ?');
    params.push(status);
  }
  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const list = database.db.prepare(`
    SELECT orders.*, works.title as work_title, u1.username as buyer_name, u2.username as seller_name
    FROM orders LEFT JOIN works ON orders.work_id = works.id
    LEFT JOIN users u1 ON orders.buyer_id = u1.id
    LEFT JOIN users u2 ON orders.seller_id = u2.id
    ${whereStr} ORDER BY orders.created_at DESC LIMIT ? OFFSET ?
  `).all(...params, parseInt(pageSize), parseInt(offset));
  const { count } = database.db.prepare(`SELECT COUNT(*) as count FROM orders ${whereStr}`).get(...params);
  res.json({ list, total: count });
});

module.exports = router;
