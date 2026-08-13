const express = require('express');
const { v4: uuidv4 } = require('uuid');
const database = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

function generateOrderNo() {
  const now = new Date();
  const date = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD${date}${rand}`;
}

router.post('/create', authMiddleware, (req, res) => {
  const { work_id, payment_method = 'balance' } = req.body;
  const work = database.db.prepare('SELECT * FROM works WHERE id = ? AND status = ?').get(work_id, 'approved');
  if (!work) {
    return res.status(400).json({ message: '作品不存在或未上架' });
  }
  if (work.seller_id === req.user.id) {
    return res.status(400).json({ message: '不能购买自己的作品' });
  }
  const existing = database.db.prepare("SELECT id FROM orders WHERE buyer_id = ? AND work_id = ? AND status IN ('paid','completed')").get(req.user.id, work_id);
  if (existing) {
    return res.status(400).json({ message: '您已购买过该作品，可在订单中查看' });
  }
  const orderNo = generateOrderNo();
  const status = 'pending';

  try {
    database.db.exec('BEGIN');
    database.db.prepare('INSERT INTO orders (order_no, buyer_id, seller_id, work_id, price, status, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(orderNo, req.user.id, work.seller_id, work_id, work.price, status, payment_method);
    database.db.exec('COMMIT');
  } catch (e) {
    database.db.exec('ROLLBACK');
    throw e;
  }
  const order = database.db.prepare('SELECT * FROM orders WHERE order_no = ?').get(orderNo);
  res.json({ order, message: '订单创建成功' });
});

router.post('/cart-checkout', authMiddleware, (req, res) => {
  const { payment_method = 'balance' } = req.body;
  const cartItems = database.db.prepare(`
    SELECT works.* FROM carts LEFT JOIN works ON carts.work_id = works.id
    WHERE carts.buyer_id = ? AND works.status = 'approved' AND works.seller_id != ?
  `).all(req.user.id, req.user.id);
  if (!cartItems.length) {
    return res.status(400).json({ message: '购物车为空' });
  }
  const orders = [];
  try {
    database.db.exec('BEGIN');
    for (const work of cartItems) {
      const existing = database.db.prepare("SELECT id FROM orders WHERE buyer_id = ? AND work_id = ? AND status IN ('paid','completed')").get(req.user.id, work.id);
      if (existing) continue;
      const orderNo = generateOrderNo();
      database.db.prepare('INSERT INTO orders (order_no, buyer_id, seller_id, work_id, price, status, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(orderNo, req.user.id, work.seller_id, work.id, work.price, 'pending', payment_method);
      orders.push(orderNo);
    }
    database.db.prepare('DELETE FROM carts WHERE buyer_id = ?').run(req.user.id);
    database.db.exec('COMMIT');
  } catch (e) {
    database.db.exec('ROLLBACK');
    throw e;
  }
  res.json({ orders, count: orders.length, message: `已创建${orders.length}个订单` });
});

router.post('/pay/:orderNo', authMiddleware, (req, res) => {
  const order = database.db.prepare('SELECT * FROM orders WHERE order_no = ?').get(req.params.orderNo);
  if (!order) return res.status(404).json({ message: '订单不存在' });
  if (order.buyer_id !== req.user.id) return res.status(403).json({ message: '无权操作' });
  if (order.status !== 'pending') return res.status(400).json({ message: '订单状态不正确' });

  const payment_method = order.payment_method || 'balance';
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (payment_method === 'balance') {
    const user = database.db.prepare('SELECT balance FROM users WHERE id = ?').get(req.user.id);
    if (user.balance < order.price) {
      return res.status(400).json({ message: `余额不足！当前余额 ¥${user.balance.toFixed(2)}，需要 ¥${order.price.toFixed(2)}` });
    }
    try {
      database.db.exec('BEGIN');
      database.db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(order.price, req.user.id);
      database.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(order.price * 0.9, order.seller_id);
      database.db.prepare("UPDATE orders SET status = 'paid', payment_time = ? WHERE id = ?").run(now, order.id);
      database.db.prepare('UPDATE works SET sales = sales + 1 WHERE id = ?').run(order.work_id);
      database.db.exec('COMMIT');
    } catch (e) {
      database.db.exec('ROLLBACK');
      throw e;
    }
    return res.json({ message: '支付成功！（余额支付，卖家得90%）' });
  }

  try {
    database.db.exec('BEGIN');
    database.db.prepare("UPDATE orders SET status = 'paid', payment_time = ? WHERE id = ?").run(now, order.id);
    database.db.prepare('UPDATE works SET sales = sales + 1 WHERE id = ?').run(order.work_id);
    database.db.exec('COMMIT');
  } catch (e) {
    database.db.exec('ROLLBACK');
    throw e;
  }
  res.json({ message: '支付成功！' });
});

router.post('/confirm/:orderNo', authMiddleware, (req, res) => {
  const order = database.db.prepare('SELECT * FROM orders WHERE order_no = ?').get(req.params.orderNo);
  if (!order) return res.status(404).json({ message: '订单不存在' });
  if (order.buyer_id !== req.user.id) return res.status(403).json({ message: '无权操作' });
  if (order.status !== 'paid') return res.status(400).json({ message: '订单状态不正确' });
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  database.db.prepare("UPDATE orders SET status = 'completed', delivery_time = ? WHERE id = ?").run(now, order.id);
  res.json({ message: '已确认收货，交易完成！' });
});

router.get('/', authMiddleware, (req, res) => {
  const { status, role = 'buyer' } = req.query;
  let where = [];
  let params = [];
  if (role === 'buyer') {
    where.push('orders.buyer_id = ?');
    params.push(req.user.id);
  } else {
    where.push('orders.seller_id = ?');
    params.push(req.user.id);
  }
  if (status && status !== 'all') {
    where.push('orders.status = ?');
    params.push(status);
  }
  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const list = database.db.prepare(`
    SELECT orders.*, works.title as work_title, works.cover_image as work_cover, works.type as work_type, works.preview as work_preview,
      u1.username as buyer_name, u2.username as seller_name
    FROM orders LEFT JOIN works ON orders.work_id = works.id
    LEFT JOIN users u1 ON orders.buyer_id = u1.id
    LEFT JOIN users u2 ON orders.seller_id = u2.id
    ${whereStr} ORDER BY orders.created_at DESC
  `).all(...params);
  res.json(list);
});

router.get('/:orderNo', authMiddleware, (req, res) => {
  const order = database.db.prepare(`
    SELECT orders.*, works.*, works.id as work_real_id,
      u1.username as buyer_name, u1.email as buyer_email,
      u2.username as seller_name, u2.email as seller_email, u2.avatar as seller_avatar,
      categories.name as category_name
    FROM orders LEFT JOIN works ON orders.work_id = works.id
    LEFT JOIN users u1 ON orders.buyer_id = u1.id
    LEFT JOIN users u2 ON orders.seller_id = u2.id
    LEFT JOIN categories ON works.category_id = categories.id
    WHERE orders.order_no = ?
  `).get(req.params.orderNo);
  if (!order) return res.status(404).json({ message: '订单不存在' });
  if (order.buyer_id !== req.user.id && order.seller_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: '无权查看' });
  }
  const hasPurchased = order.status === 'paid' || order.status === 'completed';
  const review = database.db.prepare('SELECT * FROM reviews WHERE order_id = ?').get(order.id);
  res.json({ order, hasPurchased, review });
});

router.post('/review/:orderNo', authMiddleware, (req, res) => {
  const { rating, content } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: '请评分1-5星' });
  const order = database.db.prepare('SELECT * FROM orders WHERE order_no = ?').get(req.params.orderNo);
  if (!order) return res.status(404).json({ message: '订单不存在' });
  if (order.buyer_id !== req.user.id) return res.status(403).json({ message: '无权评价' });
  if (order.status !== 'completed') return res.status(400).json({ message: '请先确认收货' });
  try {
    database.db.prepare('INSERT INTO reviews (order_id, buyer_id, seller_id, work_id, rating, content) VALUES (?, ?, ?, ?, ?, ?)')
      .run(order.id, req.user.id, order.seller_id, order.work_id, rating, content || null);
  } catch (e) {
    return res.status(400).json({ message: '已评价过该订单' });
  }
  const { avg } = database.db.prepare('SELECT COALESCE(AVG(rating), 0) as avg FROM reviews WHERE work_id = ?').get(order.work_id);
  database.db.prepare('UPDATE works SET rating = ? WHERE id = ?').run(avg, order.work_id);
  res.json({ message: '评价成功！' });
});

module.exports = router;
