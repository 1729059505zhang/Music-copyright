const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../database');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { username, email, password, role = 'buyer' } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: '请填写完整信息' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: '密码至少6位' });
  }
  const exists = database.db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (exists) {
    return res.status(400).json({ message: '用户名或邮箱已注册' });
  }
  const hashed = bcrypt.hashSync(password, 10);
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
  const result = database.db.prepare('INSERT INTO users (username, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)').run(username, email, hashed, role, avatar);
  const user = database.db.prepare('SELECT id, username, email, role, avatar, balance, is_verified FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ user, token });
});

router.post('/login', (req, res) => {
  const { account, password } = req.body;
  if (!account || !password) {
    return res.status(400).json({ message: '请填写账号和密码' });
  }
  const user = database.db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(account, account);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: '账号或密码错误' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  const { password: pwd, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

router.put('/profile', authMiddleware, (req, res) => {
  const { bio, avatar } = req.body;
  database.db.prepare('UPDATE users SET bio = COALESCE(?, bio), avatar = COALESCE(?, avatar) WHERE id = ?').run(bio || null, avatar || null, req.user.id);
  const user = database.db.prepare('SELECT id, username, email, role, avatar, bio, balance, is_verified FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

router.put('/password', authMiddleware, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = database.db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(400).json({ message: '原密码错误' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: '新密码至少6位' });
  }
  database.db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(newPassword, 10), req.user.id);
  res.json({ message: '密码修改成功' });
});

router.post('/recharge', authMiddleware, (req, res) => {
  const { amount } = req.body;
  const amt = parseFloat(amount);
  if (!amt || amt <= 0) {
    return res.status(400).json({ message: '请输入有效金额' });
  }
  database.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(amt, req.user.id);
  const user = database.db.prepare('SELECT id, username, email, role, avatar, bio, balance, is_verified FROM users WHERE id = ?').get(req.user.id);
  res.json({ user, message: `充值成功！已充值 ¥${amt.toFixed(2)}` });
});

router.get('/:id', (req, res) => {
  const user = database.db.prepare('SELECT id, username, avatar, bio, role, is_verified, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) {
    return res.status(404).json({ message: '用户不存在' });
  }
  const worksCount = database.db.prepare('SELECT COUNT(*) as count FROM works WHERE seller_id = ? AND status = ?').get(req.params.id, 'approved').count;
  const salesCount = database.db.prepare('SELECT COALESCE(SUM(sales),0) as total FROM works WHERE seller_id = ? AND status = ?').get(req.params.id, 'approved').total;
  const avgRating = database.db.prepare('SELECT COALESCE(AVG(rating),0) as avg FROM reviews WHERE seller_id = ?').get(req.params.id).avg;
  res.json({ ...user, worksCount, salesCount, avgRating });
});

module.exports = router;
