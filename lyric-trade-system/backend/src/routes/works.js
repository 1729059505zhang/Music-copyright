const express = require('express');
const database = require('../database');
const { authMiddleware, sellerMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { page = 1, pageSize = 12, keyword, category, type, sort = 'new', minPrice, maxPrice, seller_id } = req.query;
  const offset = (page - 1) * pageSize;
  let where = ['works.status = ?'];
  let params = ['approved'];
  let joins = '';

  if (keyword) {
    where.push('(works.title LIKE ? OR works.description LIKE ? OR works.tags LIKE ?)');
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }
  if (category && category !== 'all') {
    where.push('works.category_id = ?');
    params.push(category);
  }
  if (type && type !== 'all') {
    where.push('works.type = ?');
    params.push(type);
  }
  if (seller_id) {
    where.push('works.seller_id = ?');
    params.push(seller_id);
  }
  if (minPrice) {
    where.push('works.price >= ?');
    params.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    where.push('works.price <= ?');
    params.push(parseFloat(maxPrice));
  }

  let orderBy = 'works.created_at DESC';
  if (sort === 'sales') orderBy = 'works.sales DESC';
  else if (sort === 'price-asc') orderBy = 'works.price ASC';
  else if (sort === 'price-desc') orderBy = 'works.price DESC';
  else if (sort === 'rating') orderBy = 'works.rating DESC';
  else if (sort === 'views') orderBy = 'works.views DESC';

  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const sql = `
    SELECT works.*, users.username as seller_name, users.avatar as seller_avatar, categories.name as category_name, categories.icon as category_icon
    FROM works
    LEFT JOIN users ON works.seller_id = users.id
    LEFT JOIN categories ON works.category_id = categories.id
    ${whereStr}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;
  params.push(parseInt(pageSize), parseInt(offset));
  const list = database.db.prepare(sql).all(...params);

  const countSql = `SELECT COUNT(*) as count FROM works ${joins} ${whereStr}`;
  const countParams = params.slice(0, -2);
  const { count } = database.db.prepare(countSql).get(...countParams);

  res.json({ list, total: count, page: parseInt(page), pageSize: parseInt(pageSize) });
});

router.get('/hot', (req, res) => {
  const { limit = 6 } = req.query;
  const list = database.db.prepare(`
    SELECT works.*, users.username as seller_name, categories.name as category_name
    FROM works LEFT JOIN users ON works.seller_id = users.id
    LEFT JOIN categories ON works.category_id = categories.id
    WHERE works.status = 'approved'
    ORDER BY works.sales DESC, works.views DESC
    LIMIT ?
  `).all(parseInt(limit));
  res.json(list);
});

router.get('/new', (req, res) => {
  const { limit = 6 } = req.query;
  const list = database.db.prepare(`
    SELECT works.*, users.username as seller_name, categories.name as category_name
    FROM works LEFT JOIN users ON works.seller_id = users.id
    LEFT JOIN categories ON works.category_id = categories.id
    WHERE works.status = 'approved'
    ORDER BY works.created_at DESC
    LIMIT ?
  `).all(parseInt(limit));
  res.json(list);
});

router.get('/:id', (req, res) => {
  const work = database.db.prepare(`
    SELECT works.*, users.username as seller_name, users.avatar as seller_avatar, users.bio as seller_bio,
      users.is_verified as seller_verified, categories.name as category_name, categories.icon as category_icon
    FROM works LEFT JOIN users ON works.seller_id = users.id
    LEFT JOIN categories ON works.category_id = categories.id
    WHERE works.id = ?
  `).get(req.params.id);
  if (!work) {
    return res.status(404).json({ message: '作品不存在' });
  }
  database.db.prepare('UPDATE works SET views = views + 1 WHERE id = ?').run(req.params.id);
  work.views++;

  const reviews = database.db.prepare(`
    SELECT reviews.*, users.username as buyer_name, users.avatar as buyer_avatar
    FROM reviews LEFT JOIN users ON reviews.buyer_id = users.id
    WHERE reviews.work_id = ? ORDER BY reviews.created_at DESC LIMIT 20
  `).all(req.params.id);

  const related = database.db.prepare(`
    SELECT works.*, users.username as seller_name
    FROM works LEFT JOIN users ON works.seller_id = users.id
    WHERE works.status = 'approved' AND works.id != ? AND works.category_id = ?
    ORDER BY works.sales DESC LIMIT 6
  `).all(req.params.id, work.category_id);

  const sellerWorks = database.db.prepare(`
    SELECT works.*, categories.name as category_name
    FROM works LEFT JOIN categories ON works.category_id = categories.id
    WHERE works.status = 'approved' AND works.seller_id = ? AND works.id != ?
    ORDER BY works.created_at DESC LIMIT 4
  `).all(work.seller_id, req.params.id);

  let isFavorite = false, isInCart = false, hasPurchased = false;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const jwt = require('jsonwebtoken');
      const { JWT_SECRET } = require('../middleware/auth');
      const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
      const fav = database.db.prepare('SELECT id FROM favorites WHERE buyer_id = ? AND work_id = ?').get(decoded.userId, req.params.id);
      const cart = database.db.prepare('SELECT id FROM carts WHERE buyer_id = ? AND work_id = ?').get(decoded.userId, req.params.id);
      const pur = database.db.prepare('SELECT id FROM orders WHERE buyer_id = ? AND work_id = ? AND status IN (?, ?)').get(decoded.userId, req.params.id, 'paid', 'completed');
      isFavorite = !!fav;
      isInCart = !!cart;
      hasPurchased = !!pur;
    } catch (e) {}
  }

  res.json({ work, reviews, related, sellerWorks, isFavorite, isInCart, hasPurchased });
});

router.post('/', authMiddleware, sellerMiddleware, (req, res) => {
  const { title, type, category_id, description, content, preview, price, tags, cover_image } = req.body;
  if (!title || !type || !description || !content || !price) {
    return res.status(400).json({ message: '请填写必填项' });
  }
  const result = database.db.prepare(`
    INSERT INTO works (title, type, seller_id, category_id, description, content, preview, price, tags, cover_image, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(title, type, req.user.id, category_id || null, description, content, preview || null, parseFloat(price), tags || null, cover_image || null);
  res.json({ id: result.lastInsertRowid, message: '作品提交成功，等待审核' });
});

router.put('/:id', authMiddleware, sellerMiddleware, (req, res) => {
  const work = database.db.prepare('SELECT * FROM works WHERE id = ?').get(req.params.id);
  if (!work) return res.status(404).json({ message: '作品不存在' });
  if (work.seller_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: '无权操作' });
  }
  const { title, type, category_id, description, content, preview, price, tags, cover_image } = req.body;
  database.db.prepare(`
    UPDATE works SET title = COALESCE(?, title), type = COALESCE(?, type), category_id = ?,
      description = COALESCE(?, description), content = COALESCE(?, content), preview = ?, price = COALESCE(?, price),
      tags = ?, cover_image = ?, status = CASE WHEN status = 'approved' THEN 'pending' ELSE status END
    WHERE id = ?
  `).run(title || null, type || null, category_id || null, description || null, content || null, preview || null,
         price ? parseFloat(price) : null, tags || null, cover_image || null, req.params.id);
  res.json({ message: '作品更新成功，如之前已上架则需重新审核' });
});

router.delete('/:id', authMiddleware, (req, res) => {
  const work = database.db.prepare('SELECT * FROM works WHERE id = ?').get(req.params.id);
  if (!work) return res.status(404).json({ message: '作品不存在' });
  if (work.seller_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: '无权操作' });
  }
  database.db.prepare('DELETE FROM works WHERE id = ?').run(req.params.id);
  res.json({ message: '删除成功' });
});

router.post('/favorite/:id', authMiddleware, (req, res) => {
  try {
    database.db.prepare('INSERT INTO favorites (buyer_id, work_id) VALUES (?, ?)').run(req.user.id, req.params.id);
    res.json({ message: '收藏成功', isFavorite: true });
  } catch (e) {
    database.db.prepare('DELETE FROM favorites WHERE buyer_id = ? AND work_id = ?').run(req.user.id, req.params.id);
    res.json({ message: '取消收藏', isFavorite: false });
  }
});

router.get('/my/favorites', authMiddleware, (req, res) => {
  const list = database.db.prepare(`
    SELECT works.*, users.username as seller_name, categories.name as category_name
    FROM favorites LEFT JOIN works ON favorites.work_id = works.id
    LEFT JOIN users ON works.seller_id = users.id
    LEFT JOIN categories ON works.category_id = categories.id
    WHERE favorites.buyer_id = ? ORDER BY favorites.created_at DESC
  `).all(req.user.id);
  res.json(list);
});

router.post('/cart/:id', authMiddleware, (req, res) => {
  try {
    database.db.prepare('INSERT INTO carts (buyer_id, work_id) VALUES (?, ?)').run(req.user.id, req.params.id);
    res.json({ message: '已加入购物车', isInCart: true });
  } catch (e) {
    database.db.prepare('DELETE FROM carts WHERE buyer_id = ? AND work_id = ?').run(req.user.id, req.params.id);
    res.json({ message: '已移除购物车', isInCart: false });
  }
});

router.get('/my/cart', authMiddleware, (req, res) => {
  const list = database.db.prepare(`
    SELECT works.*, users.username as seller_name, categories.name as category_name, carts.id as cart_id
    FROM carts LEFT JOIN works ON carts.work_id = works.id
    LEFT JOIN users ON works.seller_id = users.id
    LEFT JOIN categories ON works.category_id = categories.id
    WHERE carts.buyer_id = ? AND works.status = 'approved' ORDER BY carts.created_at DESC
  `).all(req.user.id);
  res.json(list);
});

router.delete('/cart/:cartId', authMiddleware, (req, res) => {
  database.db.prepare('DELETE FROM carts WHERE id = ? AND buyer_id = ?').run(req.params.cartId, req.user.id);
  res.json({ message: '移除成功' });
});

module.exports = router;
