const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const database = require('./database');

async function seed() {
  // 删除旧数据库，确保是新的
  const dbPath = path.join(__dirname, '..', 'data.db');
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

  await database.initDatabase();
  const db = database.db;

  const hashedPassword = bcrypt.hashSync('123456', 10);

  const insertUser = db.prepare(`
    INSERT INTO users (username, email, password, role, avatar, bio, balance, is_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('admin', 'admin@lyric.com', hashedPassword, 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', '系统管理员', 99999, 1);
  insertUser.run('音乐制作人老王', 'seller1@lyric.com', hashedPassword, 'seller', 'https://api.dicebear.com/7.x/avataaars/svg?seed=laowang', '资深音乐制作人，从业15年，擅长流行、摇滚风格', 5000, 1);
  insertUser.run('小李词曲', 'seller2@lyric.com', hashedPassword, 'seller', 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoli', '青年词曲作者，擅长古风、民谣', 3200, 1);
  insertUser.run('张大作曲家', 'seller3@lyric.com', hashedPassword, 'seller', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangda', '音乐学院教授，作曲系主任', 18000, 1);
  insertUser.run('音乐爱好者小明', 'buyer1@lyric.com', hashedPassword, 'buyer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming', '音乐爱好者', 2000, 0);
  insertUser.run('梦想歌手小红', 'buyer2@lyric.com', hashedPassword, 'buyer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaohong', '网络歌手，正在寻找优质词曲', 8500, 1);
  insertUser.run('独立音乐人阿杰', 'buyer3@lyric.com', hashedPassword, 'buyer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ajie', '独立音乐人，需要原创歌曲', 1200, 0);

  const insertCategory = db.prepare(`
    INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)
  `);

  insertCategory.run('流行歌曲', '大众喜闻乐见的流行风格歌曲', '🎵');
  insertCategory.run('古风词曲', '中国风古典韵味的词曲作品', '🏮');
  insertCategory.run('摇滚音乐', '充满力量感的摇滚风格', '🎸');
  insertCategory.run('民谣乡村', '清新朴实的民谣风格', '🌾');
  insertCategory.run('电子舞曲', '动感十足的EDM电子音乐', '🎧');
  insertCategory.run('儿童歌曲', '适合儿童演唱的歌曲', '🧒');
  insertCategory.run('影视配乐', '电影电视剧专用配乐', '🎬');
  insertCategory.run('纯音乐', '无人声的纯音乐作品', '🎹');

  const works = [
    { title: '夏日恋歌', type: 'song', seller_id: 2, category_id: 1, price: 2800, views: 1523, sales: 38, rating: 4.8, tags: '流行,情歌,夏日,年轻', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop' },
    { title: '红尘醉', type: 'lyrics', seller_id: 3, category_id: 2, price: 1500, views: 2340, sales: 56, rating: 4.9, tags: '古风,中国风,古典,意境', cover: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&fit=crop' },
    { title: '燃烧吧青春', type: 'song', seller_id: 4, category_id: 3, price: 3500, views: 892, sales: 12, rating: 4.7, tags: '摇滚,励志,青春,激情', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop' },
    { title: '故乡的云', type: 'song', seller_id: 3, category_id: 4, price: 1800, views: 3201, sales: 89, rating: 4.95, tags: '民谣,故乡,思念,治愈', cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop' },
    { title: 'Electric Dreams', type: 'song', seller_id: 2, category_id: 5, price: 4200, views: 567, sales: 8, rating: 4.6, tags: '电子,EDM,舞曲,夜店', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop' },
    { title: '小星星变奏曲', type: 'lyrics', seller_id: 4, category_id: 6, price: 600, views: 1890, sales: 145, rating: 4.9, tags: '儿歌,儿童,童趣,简单', cover: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop' },
    { title: '岁月无声', type: 'song', seller_id: 4, category_id: 7, price: 6800, views: 432, sales: 5, rating: 5.0, tags: '影视,配乐,大气,感人', cover: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop' },
    { title: '月光奏鸣曲', type: 'music', seller_id: 2, category_id: 8, price: 2200, views: 789, sales: 23, rating: 4.85, tags: '纯音乐,钢琴,古典,宁静', cover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=300&fit=crop' },
    { title: '追梦人', type: 'song', seller_id: 2, category_id: 1, price: 3200, views: 1123, sales: 31, rating: 4.75, tags: '励志,流行,追梦,选秀', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop' },
    { title: '离人愁', type: 'lyrics', seller_id: 3, category_id: 2, price: 1200, views: 2567, sales: 72, rating: 4.88, tags: '古风,离别,思念,古装', cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop' },
    { title: '午夜狂想曲', type: 'song', seller_id: 2, category_id: 5, price: 3800, views: 445, sales: 9, rating: 4.5, tags: '电子,摇滚,现代,年轻人', cover: 'https://images.unsplash.com/photo-1571266028305-e4733b0f0bb0?w=400&h=300&fit=crop' },
    { title: '童年的秋千', type: 'song', seller_id: 3, category_id: 4, price: 1600, views: 987, sales: 42, rating: 4.82, tags: '民谣,怀旧,童年,回忆', cover: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop' },
  ];

  const descriptions = {
    1: '一首充满夏日气息的流行情歌，适合年轻歌手演唱。曲调朗朗上口，副歌部分记忆点强，非常适合打榜。',
    2: '一首意境深远的古风词作，用词考究，适合搭配古典乐器伴奏。',
    3: '充满激情的摇滚歌曲，能量满满，适合乐队演出或励志场合。',
    4: '一首温暖治愈的民谣歌曲，描写对故乡的思念，适合吉他弹唱。',
    5: '动感十足的电子舞曲，节奏感强，适合夜店、派对场合。',
    6: '为小朋友创作的儿歌，简单易学，充满童趣。',
    7: '电影片尾曲风格的配乐歌曲，情感深沉大气，适合剧情感人的场景。',
    8: '钢琴独奏纯音乐，宁静优美，适合冥想、阅读、咖啡馆背景音乐。',
    9: '励志流行歌曲，讲述追梦路上的坚持与感动，适合选秀比赛演唱。',
    10: '古风离别词作，情感真挚，适合古装剧插曲。',
    11: '电子与摇滚结合的作品，现代感十足，适合年轻人。',
    12: '民谣风格的怀旧歌曲，回忆童年美好时光。',
  };

  const contents = {
    1: `《夏日恋歌》

【Verse 1】
阳光下的沙滩
海风轻拂你的发
我牵着你的手
走过了整个盛夏

【Chorus】
哦～夏日恋歌
唱着你和我的故事
每一个音符都是你
每一句都是甜蜜

让这一刻停留在你我心中`,
    2: `《红尘醉》

【主歌】
月下独酌酒一杯
往事如烟随风飞
青丝染霜人渐老
功名富贵皆成灰

【副歌】
红尘醉 梦一场
醒来已是泪千行
山河在 人已非
只剩孤影对斜阳`,
    3: `《燃烧吧青春》

站在人生的十字路口
心里有个声音在呼喊
不要怕 不要退

燃烧吧 青春！
用尽全力去追逐梦想
就算跌倒也要爬起来
我们是不可阻挡的一代！`,
    4: `《故乡的云》

在异乡的城市里漂泊
看着天上飘过的云朵
那朵云好像从故乡来
带着熟悉的泥土芬芳

故乡的云啊 请你慢些走
替我看看那村口的老槐树
替我问问那年迈的爹娘`,
    5: `《Electric Dreams》

霓虹灯闪烁的夜晚
城市变成了游乐场
音乐穿透了灵魂
我们在旋律中飞翔

Electric Dreams!
带我飞向宇宙的尽头
没有终点 只有自由`,
    6: `《小星星变奏曲》

一闪一闪亮晶晶
满天都是小星星
挂在天上放光明
好像许多小眼睛

小星星呀眨眨眼
好像在和我聊天`,
    7: `《岁月无声》

时光从指缝间溜走
岁月在脸上刻下痕迹
那些曾经以为过不去的坎
如今都成了下酒菜

岁月无声 却最有力量
它把尖锐的都磨成圆
它把浓烈的都酿成甜`,
    8: `《月光奏鸣曲》

调性：升C小调
速度：Adagio sostenuto

左手分解和弦缓缓进入
右手旋律如月光洒落
主题如流水般优美
发展部和声变化丰富
渐渐远去，消失在夜色中`,
    9: `《追梦人》

背着行囊 离开了家
前方的路 不知道在哪
有人嘲笑 有人质疑
但心里的火 从未熄灭啊

我是一个追梦人
跌倒了也会再站起来
就算风再大 雨再狂
也挡不住我前进的方向`,
    10: `《离人愁》

长亭外 古道边
芳草碧连天
你执手相看泪眼
竟无语凝噎

离人愁 愁断三千丈
青丝一夜白如霜
明月不解相思苦
偏照离人泪成行`,
    11: `《午夜狂想曲》

午夜12点 城市才刚刚醒来
脱下白天的伪装 做回真实的自己
霓虹灯是我们的太阳
这是属于我们的时光

午夜狂想 让音乐释放
烦恼全部丢掉 尽情舞蹈`,
    12: `《童年的秋千》

老家院子的老槐树下
有一个破旧的秋千
那是爷爷亲手做的
承载了我整个童年

摇啊摇 秋千摇啊摇
摇到了外婆桥
摇啊摇 时光摇啊摇
摇走了青春年少`,
  };

  const insertWork = db.prepare(`
    INSERT INTO works (title, type, seller_id, category_id, description, content, preview, price, status, views, sales, rating, tags, cover_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?, ?, ?, ?)
  `);

  works.forEach((w, i) => {
    const idx = i + 1;
    const content = contents[idx];
    const preview = content.split('\n').slice(0, 8).join('\n');
    insertWork.run(w.title, w.type, w.seller_id, w.category_id, descriptions[idx], content, preview, w.price, w.views, w.sales, w.rating, w.tags, w.cover);
  });

  const insertOrder = db.prepare(`
    INSERT INTO orders (order_no, buyer_id, seller_id, work_id, price, status, payment_method, payment_time, delivery_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const orders = [
    ['ORD2024080001', 5, 2, 1, 2800, 'completed', 'alipay', '2024-08-01 10:23:45', '2024-08-01 10:23:45'],
    ['ORD2024080002', 6, 3, 2, 1500, 'completed', 'wechat', '2024-08-02 15:12:30', '2024-08-02 15:12:30'],
    ['ORD2024080003', 5, 4, 3, 3500, 'completed', 'balance', '2024-08-03 09:45:20', '2024-08-03 09:45:20'],
    ['ORD2024080004', 7, 3, 4, 1800, 'completed', 'alipay', '2024-08-04 20:33:15', '2024-08-04 20:33:15'],
    ['ORD2024080005', 6, 2, 9, 3200, 'pending', 'wechat', null, null],
    ['ORD2024080006', 7, 4, 7, 6800, 'paid', 'alipay', '2024-08-05 14:20:00', null],
  ];
  orders.forEach(o => insertOrder.run(...o));

  const insertReview = db.prepare(`
    INSERT INTO reviews (order_id, buyer_id, seller_id, work_id, rating, content)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertReview.run(1, 5, 2, 1, 5, '非常好听的一首歌！副歌部分特别抓耳，已经录制成小样了，朋友都说好！');
  insertReview.run(2, 6, 3, 2, 5, '古风词写得太有意境了！用词考究，画面感很强，配乐之后效果非常好，强烈推荐！');
  insertReview.run(3, 5, 4, 3, 4, '摇滚风格很正，能量满满，小建议是第二段可以再变化多一点。总体很不错！');
  insertReview.run(4, 7, 3, 4, 5, '听哭了... 作为在外漂泊多年的游子，这首歌写出了我的心声。');

  db._save();

  console.log('✅ 种子数据初始化完成！');
  console.log('');
  console.log('📋 测试账号（密码统一: 123456）：');
  console.log('  管理员：   admin / 123456');
  console.log('  卖家1：    音乐制作人老王 / 123456');
  console.log('  卖家2：    小李词曲 / 123456');
  console.log('  买家1：    音乐爱好者小明 / 123456');
  console.log('  买家2：    梦想歌手小红 / 123456');
  console.log('');
  console.log('💡 请先 npm install 然后运行 npm run seed 初始化数据');
}

seed().catch(e => {
  console.error('种子数据初始化失败:', e);
  process.exit(1);
});
