const express = require('express');
const database = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const myId = req.user.id;
  const { other_id } = req.query;
  if (other_id) {
    const list = database.db.prepare(`
      SELECT messages.*, u1.username as sender_name, u1.avatar as sender_avatar
      FROM messages LEFT JOIN users u1 ON messages.sender_id = u1.id
      WHERE (messages.sender_id = ? AND messages.receiver_id = ?)
         OR (messages.sender_id = ? AND messages.receiver_id = ?)
      ORDER BY messages.created_at ASC
    `).all(myId, other_id, other_id, myId);
    database.db.prepare('UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?').run(other_id, myId);
    return res.json(list);
  }
  const conversations = database.db.prepare(`
    SELECT 
      CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END as other_id,
      MAX(m.created_at) as last_time,
      SUM(CASE WHEN m.receiver_id = ? AND m.is_read = 0 THEN 1 ELSE 0 END) as unread
    FROM messages m
    WHERE m.sender_id = ? OR m.receiver_id = ?
    GROUP BY other_id
    ORDER BY last_time DESC
  `).all(myId, myId, myId, myId);

  for (const conv of conversations) {
    const user = database.db.prepare('SELECT id, username, avatar FROM users WHERE id = ?').get(conv.other_id);
    const last = database.db.prepare(`
      SELECT messages.*, u.username as sender_name FROM messages
      LEFT JOIN users u ON messages.sender_id = u.id
      WHERE (messages.sender_id = ? AND messages.receiver_id = ?)
         OR (messages.sender_id = ? AND messages.receiver_id = ?)
      ORDER BY messages.created_at DESC LIMIT 1
    `).get(myId, conv.other_id, conv.other_id, myId);
    conv.user = user;
    conv.last_message = last;
  }
  res.json(conversations);
});

router.post('/', authMiddleware, (req, res) => {
  const { receiver_id, work_id, content } = req.body;
  if (!receiver_id || !content) return res.status(400).json({ message: '请填写完整' });
  const result = database.db.prepare('INSERT INTO messages (sender_id, receiver_id, work_id, content) VALUES (?, ?, ?, ?)')
    .run(req.user.id, receiver_id, work_id || null, content);
  const msg = database.db.prepare(`
    SELECT messages.*, u.username as sender_name, u.avatar as sender_avatar
    FROM messages LEFT JOIN users u ON messages.sender_id = u.id
    WHERE messages.id = ?
  `).get(result.lastInsertRowid);
  res.json(msg);
});

router.get('/unread-count', authMiddleware, (req, res) => {
  const count = database.db.prepare('SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0').get(req.user.id).count;
  res.json({ count });
});

module.exports = router;
