const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'lyrics-melody-trade-secret-2024';

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ============ 数据存储 ============
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const loadData = (file) => {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
};

const saveData = (file, data) => {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
};

let users = loadData('users.json');
let works = loadData('works.json');
let orders = loadData('orders.json');
let messages = loadData('messages.json');

// 初始化示例数据
if (users.length === 0) {
  const initUsers = [
    { id: 1, username: 'lyric_master', nickname: '词圣·李白', password: bcrypt.hashSync('123456', 8), email: 'libai@example.com', role: 'seller', avatar: '🎭', balance: 5200, bio: '专业作词人20年，擅长古风、流行', createdAt: Date.now() - 86400000 * 300 },
    { id: 2, username: 'melody_king', nickname: '曲神·莫扎特', password: bcrypt.hashSync('123456', 8), email: 'mozart@example.com', role: 'seller', avatar: '🎹', balance: 8800, bio: '音乐世家出身，精通多种乐器', createdAt: Date.now() - 86400000 * 200 },
    { id: 3, username: 'music_lover', nickname: '音乐爱好者', password: bcrypt.hashSync('123456', 8), email: 'lover@example.com', role: 'buyer', avatar: '🎧', balance: 15000, bio: '寻找优秀的原创音乐作品', createdAt: Date.now() - 86400000 * 100 }
  ];
  users = initUsers;
  saveData('users.json', users);
}

if (works.length === 0) {
  const initWorks = [
    { id: 1, title: '红尘客栈', type: 'lyrics', authorId: 1, authorName: '词圣·李白', authorAvatar: '🎭', price: 2800, category: '古风', tags: ['古风', '江湖', '抒情'], content: '天涯的尽头是风沙\n红尘的故事叫牵挂\n封刀隐没在寻常人家 东篱下\n闲云野鹤古刹\n\n快马在江湖里厮杀\n无非是名和利放不下\n心中有江山的人岂能快意潇洒\n我只求与你共华发', description: '一首充满江湖气息的古风歌词，讲述归隐山林的侠骨柔情。', plays: 3420, likes: 128, status: 'onsale', createdAt: Date.now() - 86400000 * 45 },
    { id: 2, title: '夜曲旋律', type: 'melody', authorId: 2, authorName: '曲神·莫扎特', authorAvatar: '🎹', price: 5600, category: '流行', tags: ['流行', '夜晚', '浪漫'], melodyNotes: 'C4-E4-G4-C5-B4-G4-E4-C4\nD4-F4-A4-D5-C5-A4-F4-D4\nE4-G4-B4-E5-D5-B4-G4-E4', bpm: 76, key: 'C大调', description: '优美动听的流行钢琴曲，适合夜晚独自聆听。', plays: 5680, likes: 256, status: 'onsale', createdAt: Date.now() - 86400000 * 30 },
    { id: 3, title: '春日花语', type: 'lyrics', authorId: 1, authorName: '词圣·李白', authorAvatar: '🎭', price: 1800, category: '流行', tags: ['春天', '爱情', '清新'], content: '春风拂过窗台\n花开花落又一载\n你的笑容如暖阳\n照进我心海\n\n樱花瓣飘下来\n落在你发梢裙摆\n牵着手走过那条小巷\n是我们最美的时光', description: '清新甜美的春日情歌，描绘初恋般的美好。', plays: 2100, likes: 89, status: 'onsale', createdAt: Date.now() - 86400000 * 20 },
    { id: 4, title: '命运交响曲', type: 'melody', authorId: 2, authorName: '曲神·莫扎特', authorAvatar: '🎹', price: 8800, category: '古典', tags: ['古典', '交响', '史诗'], melodyNotes: 'G4-G4-G4-Eb4-F4-F4-F4-D4\nE4-E4-E4-C4-D4-D4-D4-Bb3', bpm: 120, key: 'C小调', description: '气势磅礴的古典交响旋律，充满力量与希望。', plays: 8900, likes: 512, status: 'onsale', createdAt: Date.now() - 86400000 * 60 },
    { id: 5, title: '都市夜归人', type: 'lyrics', authorId: 1, authorName: '词圣·李白', authorAvatar: '🎭', price: 2200, category: '摇滚', tags: ['都市', '孤独', '奋斗'], content: '霓虹灯下的城市\n每个人都在赶路\n皮鞋踏碎了梦想\n却换不回当初的模样\n\n末班地铁的车窗\n映出疲惫的脸庞\n家的方向在远方\n那里有温暖的灯光', description: '都市打工族的心声，讲述奋斗路上的孤独与坚持。', plays: 1560, likes: 67, status: 'onsale', createdAt: Date.now() - 86400000 * 15 },
    { id: 6, title: '月光奏鸣曲', type: 'melody', authorId: 2, authorName: '曲神·莫扎特', authorAvatar: '🎹', price: 6800, category: '古典', tags: ['古典', '钢琴', '月光'], melodyNotes: 'C#5-B4-A4-G#4-F#4-E4-D#4-C#4\nB4-A4-G#4-F#4-E4-D#4-C#4-B3', bpm: 66, key: 'C#小调', description: '如月光般温柔流淌的钢琴旋律，静谧而深邃。', plays: 6780, likes: 389, status: 'onsale', createdAt: Date.now() - 86400000 * 50 }
  ];
  works = initWorks;
  saveData('works.json', works);
}

// ============ 认证中间件 ============
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: '未登录' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = users.find(u => u.id === decoded.id);
    if (!req.user) return res.status(401).json({ error: '用户不存在' });
    next();
  } catch {
    res.status(401).json({ error: '登录已过期' });
  }
};

// ============ 用户API ============
app.post('/api/auth/register', (req, res) => {
  const { username, nickname, email, password, role } = req.body;
  if (!username || !password || !nickname) return res.status(400).json({ error: '请填写完整信息' });
  if (users.find(u => u.username === username)) return res.status(400).json({ error: '用户名已存在' });
  const id = Date.now();
  const avatars = ['🎭', '🎹', '🎧', '🎸', '🎺', '🎻', '🥁', '🎤'];
  const user = {
    id, username, nickname, email,
    password: bcrypt.hashSync(password, 8),
    role: role || 'buyer',
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    balance: 1000,
    bio: '',
    createdAt: Date.now()
  };
  users.push(user);
  saveData('users.json', users);
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: '用户名或密码错误' });
  }
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

app.get('/api/user/me', auth, (req, res) => {
  const { password: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

app.get('/api/user/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: '用户不存在' });
  const { password: _, ...safeUser } = user;
  safeUser.worksCount = works.filter(w => w.authorId === user.id).length;
  safeUser.soldCount = orders.filter(o => o.sellerId === user.id && o.status === 'completed').length;
  res.json({ user: safeUser });
});

app.put('/api/user/me', auth, (req, res) => {
  const { nickname, bio, avatar, email } = req.body;
  if (nickname) req.user.nickname = nickname;
  if (bio !== undefined) req.user.bio = bio;
  if (avatar) req.user.avatar = avatar;
  if (email) req.user.email = email;
  saveData('users.json', users);
  const { password: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// ============ 作品API ============
app.get('/api/works', (req, res) => {
  const { type, category, sort, search, authorId } = req.query;
  let list = [...works].filter(w => w.status === 'onsale');
  if (type) list = list.filter(w => w.type === type);
  if (category && category !== '全部') list = list.filter(w => w.category === category);
  if (search) list = list.filter(w => w.title.includes(search) || w.description.includes(search) || w.tags.some(t => t.includes(search)));
  if (authorId) list = list.filter(w => w.authorId === parseInt(authorId));
  if (sort === 'hot') list.sort((a, b) => b.plays - a.plays);
  else if (sort === 'new') list.sort((a, b) => b.createdAt - a.createdAt);
  else if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => b.likes - a.likes);
  res.json({ works: list });
});

app.get('/api/works/:id', (req, res) => {
  const work = works.find(w => w.id === parseInt(req.params.id));
  if (!work) return res.status(404).json({ error: '作品不存在' });
  work.plays = (work.plays || 0) + 1;
  saveData('works.json', works);
  res.json({ work });
});

app.post('/api/works', auth, (req, res) => {
  const { title, type, price, category, tags, content, description, melodyNotes, bpm, key } = req.body;
  if (!title || !type || !price || !category) return res.status(400).json({ error: '请填写完整信息' });
  const id = Date.now();
  const work = {
    id, title, type, price: Number(price), category,
    tags: tags || [],
    content: content || '',
    melodyNotes: melodyNotes || '',
    bpm: bpm || '',
    key: key || '',
    description: description || '',
    authorId: req.user.id,
    authorName: req.user.nickname,
    authorAvatar: req.user.avatar,
    plays: 0, likes: 0,
    status: 'onsale',
    createdAt: Date.now()
  };
  works.unshift(work);
  saveData('works.json', works);
  res.json({ work });
});

app.delete('/api/works/:id', auth, (req, res) => {
  const idx = works.findIndex(w => w.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: '作品不存在' });
  if (works[idx].authorId !== req.user.id) return res.status(403).json({ error: '无权限操作' });
  works[idx].status = 'offline';
  saveData('works.json', works);
  res.json({ success: true });
});

app.post('/api/works/:id/like', (req, res) => {
  const work = works.find(w => w.id === parseInt(req.params.id));
  if (!work) return res.status(404).json({ error: '作品不存在' });
  work.likes = (work.likes || 0) + 1;
  saveData('works.json', works);
  res.json({ likes: work.likes });
});

// ============ 订单/交易API ============
app.post('/api/orders', auth, (req, res) => {
  const { workId } = req.body;
  const work = works.find(w => w.id === parseInt(workId));
  if (!work) return res.status(404).json({ error: '作品不存在' });
  if (work.authorId === req.user.id) return res.status(400).json({ error: '不能购买自己的作品' });
  
  const existing = orders.find(o => o.workId === work.id && o.buyerId === req.user.id && o.status === 'completed');
  if (existing) return res.status(400).json({ error: '您已购买过此作品' });
  
  if (req.user.balance < work.price) return res.status(400).json({ error: '余额不足，请先充值' });
  
  const seller = users.find(u => u.id === work.authorId);
  req.user.balance -= work.price;
  seller.balance += Math.floor(work.price * 0.9);
  
  const order = {
    id: Date.now(),
    workId: work.id,
    workTitle: work.title,
    workType: work.type,
    workThumb: work.authorAvatar,
    price: work.price,
    buyerId: req.user.id,
    buyerName: req.user.nickname,
    sellerId: seller.id,
    sellerName: seller.nickname,
    status: 'completed',
    createdAt: Date.now()
  };
  orders.unshift(order);
  saveData('orders.json', orders);
  saveData('users.json', users);
  
  const { password: _, ...safeUser } = req.user;
  res.json({ order, user: safeUser });
});

app.get('/api/orders', auth, (req, res) => {
  const { role } = req.query;
  let list;
  if (role === 'seller') {
    list = orders.filter(o => o.sellerId === req.user.id);
  } else {
    list = orders.filter(o => o.buyerId === req.user.id);
  }
  res.json({ orders: list });
});

app.get('/api/orders/my-works', auth, (req, res) => {
  const purchasedIds = orders.filter(o => o.buyerId === req.user.id && o.status === 'completed').map(o => o.workId);
  const purchasedWorks = works.filter(w => purchasedIds.includes(w.id));
  res.json({ works: purchasedWorks });
});

// ============ 统计API ============
app.get('/api/stats', (req, res) => {
  res.json({
    worksCount: works.filter(w => w.status === 'onsale').length,
    usersCount: users.length,
    ordersCount: orders.filter(o => o.status === 'completed').length,
    totalAmount: orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.price, 0)
  });
});

app.get('/api/dashboard', auth, (req, res) => {
  const myWorks = works.filter(w => w.authorId === req.user.id);
  const myOrders = orders.filter(o => o.buyerId === req.user.id);
  const soldOrders = orders.filter(o => o.sellerId === req.user.id && o.status === 'completed');
  const income = soldOrders.reduce((s, o) => s + Math.floor(o.price * 0.9), 0);
  const expense = myOrders.filter(o => o.status === 'completed').reduce((s, o) => s + o.price, 0);
  
  res.json({
    worksCount: myWorks.length,
    soldCount: soldOrders.length,
    boughtCount: myOrders.length,
    income,
    expense,
    balance: req.user.balance,
    recentWorks: myWorks.slice(0, 5),
    recentOrders: [...orders.filter(o => o.buyerId === req.user.id || o.sellerId === req.user.id)].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8)
  });
});

// ============ 启动 ============
app.listen(PORT, () => {
  console.log(`🚀 作词作曲交易平台已启动: http://localhost:${PORT}`);
  console.log(`📌 测试账号: lyric_master / 123456 (卖家)`);
  console.log(`📌 测试账号: melody_king / 123456 (卖家)`);
  console.log(`📌 测试账号: music_lover / 123456 (买家 - 余额15000)`);
});
