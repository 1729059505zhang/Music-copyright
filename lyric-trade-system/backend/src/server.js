const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase, db } = require('./database');

const usersRouter = require('./routes/users');
const worksRouter = require('./routes/works');
const ordersRouter = require('./routes/orders');
const categoriesRouter = require('./routes/categories');
const adminRouter = require('./routes/admin');
const messagesRouter = require('./routes/messages');

async function start() {
  await initDatabase();

  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '词曲交易系统 API 服务正常', time: new Date().toISOString() });
  });

  app.use('/api/users', usersRouter);
  app.use('/api/works', worksRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/messages', messagesRouter);

  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: '服务器内部错误', error: err.message });
  });

  app.use((req, res) => {
    res.status(404).json({ message: '接口不存在' });
  });

  app.listen(PORT, () => {
    console.log('');
    console.log('🎵 词曲交易系统后端服务启动成功！');
    console.log(`📡 API 服务地址: http://localhost:${PORT}`);
    console.log(`💡 健康检查: http://localhost:${PORT}/api/health`);
    console.log('');
  });
}

start().catch(e => {
  console.error('启动失败:', e);
  process.exit(1);
});
