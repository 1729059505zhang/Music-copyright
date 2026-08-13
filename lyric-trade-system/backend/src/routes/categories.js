const express = require('express');
const database = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  const list = database.db.prepare(`
    SELECT categories.*, (SELECT COUNT(*) FROM works WHERE works.category_id = categories.id AND works.status = 'approved') as works_count
    FROM categories ORDER BY categories.id ASC
  `).all();
  res.json(list);
});

router.post('/', (req, res) => {
  const { name, description, icon } = req.body;
  if (!name) return res.status(400).json({ message: '请输入分类名称' });
  try {
    const result = database.db.prepare('INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)').run(name, description || null, icon || null);
    res.json({ id: result.lastInsertRowid, message: '创建成功' });
  } catch (e) {
    res.status(400).json({ message: '分类名已存在' });
  }
});

module.exports = router;
