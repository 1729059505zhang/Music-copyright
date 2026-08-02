// ============ API 封装 ============
const API = {
  token: () => localStorage.getItem('token'),
  headers: () => {
    const h = { 'Content-Type': 'application/json' };
    const t = API.token();
    if (t) h.Authorization = 'Bearer ' + t;
    return h;
  },
  async req(url, opt = {}) {
    const res = await fetch(url, {
      ...opt,
      headers: { ...API.headers(), ...(opt.headers || {}) }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || '请求失败');
    return data;
  },
  get: (u) => API.req(u, { method: 'GET' }),
  post: (u, b) => API.req(u, { method: 'POST', body: JSON.stringify(b || {}) }),
  put: (u, b) => API.req(u, { method: 'PUT', body: JSON.stringify(b || {}) }),
  del: (u) => API.req(u, { method: 'DELETE' })
};

// ============ 状态管理 ============
const Store = {
  user: null,
  async init() {
    if (API.token()) {
      try {
        const d = await API.get('/api/user/me');
        this.user = d.user;
      } catch {
        localStorage.removeItem('token');
      }
    }
    this.renderNav();
  },
  setAuth(token, user) {
    localStorage.setItem('token', token);
    this.user = user;
    this.renderNav();
  },
  logout() {
    localStorage.removeItem('token');
    this.user = null;
    this.renderNav();
    router.navigate('home');
    toast('已退出登录', 'success');
  },
  renderNav() {
    const el = document.getElementById('navUser');
    if (this.user) {
      el.innerHTML = `
        <div class="user-menu" onclick="router.navigate('dashboard')">
          <div class="user-avatar">${this.user.avatar || '👤'}</div>
          <div class="user-info-text">
            <span class="user-name">${this.user.nickname}</span>
            <span class="user-balance">¥${this.user.balance.toLocaleString()}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();Store.logout()">退出</button>
      `;
    } else {
      el.innerHTML = `
        <button class="btn btn-ghost" onclick="showModal('login')">登录</button>
        <button class="btn btn-primary" onclick="showModal('register')">注册</button>
      `;
    }
  }
};

// ============ Toast ============
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  setTimeout(() => { el.className = 'toast ' + type; }, 2500);
}

// ============ 弹窗 ============
function showModal(name) {
  const map = { login: 'loginModal', register: 'registerModal', work: 'workModal' };
  document.getElementById(map[name])?.classList.add('open');
}
function closeModal(name) {
  const map = { login: 'loginModal', register: 'registerModal', work: 'workModal' };
  document.getElementById(map[name])?.classList.remove('open');
}

// ============ 登录注册 ============
async function handleLogin() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!username || !password) return toast('请填写完整信息', 'error');
  try {
    const d = await API.post('/api/auth/login', { username, password });
    Store.setAuth(d.token, d.user);
    closeModal('login');
    toast('登录成功', 'success');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
  } catch (e) { toast(e.message, 'error'); }
}

async function handleRegister() {
  const username = document.getElementById('regUsername').value.trim();
  const nickname = document.getElementById('regNickname').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const role = document.querySelector('input[name="role"]:checked').value;
  if (!username || !nickname || !password) return toast('请填写完整信息', 'error');
  if (password.length < 6) return toast('密码至少6位', 'error');
  try {
    const d = await API.post('/api/auth/register', { username, nickname, email, password, role });
    Store.setAuth(d.token, d.user);
    closeModal('register');
    toast('注册成功，赠送 ¥1000 体验金！', 'success');
  } catch (e) { toast(e.message, 'error'); }
}

// ============ 路由 ============
const router = {
  current: 'home',
  params: {},
  navigate(route, params = {}) {
    this.current = route;
    this.params = params;
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.route === route);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  },
  requireAuth(route) {
    if (!Store.user) {
      toast('请先登录', 'error');
      showModal('login');
      return;
    }
    this.navigate(route);
  },
  async render() {
    const app = document.getElementById('app');
    const route = this.current;
    if (route === 'home') app.innerHTML = Views.home();
    else if (route === 'market') { app.innerHTML = Views.market(); Market.init(); }
    else if (route === 'publish') { app.innerHTML = Views.publish(); Publish.init(); }
    else if (route === 'dashboard') { app.innerHTML = Views.dashboard(); Dashboard.init(); }
    else if (route === 'work-detail') { app.innerHTML = Views.market(); Market.init(this.params.id); }
    else app.innerHTML = Views.home();
    this.afterRender();
  },
  afterRender() {
    if (this.current === 'home') Home.init();
  }
};

// ============ 首页视图 ============
const Views = {
  home() {
    return `
      <div class="container">
        <section class="hero">
          <div class="hero-ornament">𝄆 ♪ ♫ ♩ ♬ 𝄇</div>
          <h1 class="hero-title">让创作<span class="gradient"> 价值连城</span><br>让旋律<span class="gradient"> 遇见知音</span></h1>
          <p class="hero-subtitle">MuseHub 是专业的作词作曲交易平台，汇聚全球顶尖创作者，为每一首原创作品找到最好的归宿。</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="router.navigate('market')">✨ 探索作品市场</button>
            <button class="btn btn-outline btn-lg" onclick="router.requireAuth('publish')">✍️ 发布我的作品</button>
          </div>
          <div class="stats" id="homeStats"></div>
        </section>

        <section class="section">
          <div class="section-header">
            <div>
              <h2 class="section-title">精选歌词作品</h2>
              <p class="section-subtitle">字字珠玑，句句入心</p>
            </div>
            <button class="btn btn-ghost" onclick="router.navigate('market')">查看全部 →</button>
          </div>
          <div class="works-grid" id="lyricsWorks"></div>
        </section>

        <section class="section">
          <div class="section-header">
            <div>
              <h2 class="section-title">精品旋律作曲</h2>
              <p class="section-subtitle">天籁之音，绕梁三日</p>
            </div>
            <button class="btn btn-ghost" onclick="router.navigate('market')">查看全部 →</button>
          </div>
          <div class="works-grid" id="melodyWorks"></div>
        </section>
      </div>
    `;
  },

  market() {
    return `
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">作品市场</h1>
          <p class="page-subtitle">发现来自世界各地的优秀原创作品</p>
        </div>
        <div class="filter-bar">
          <div class="filter-row">
            <span class="filter-label">类型</span>
            <div class="filter-chips" id="typeFilter">
              <div class="chip active" data-type="all">全部</div>
              <div class="chip" data-type="lyrics">🎼 歌词</div>
              <div class="chip" data-type="melody">🎹 作曲</div>
            </div>
          </div>
          <div class="filter-row">
            <span class="filter-label">分类</span>
            <div class="filter-chips" id="categoryFilter">
              <div class="chip active" data-cat="全部">全部</div>
              <div class="chip" data-cat="古风">古风</div>
              <div class="chip" data-cat="流行">流行</div>
              <div class="chip" data-cat="摇滚">摇滚</div>
              <div class="chip" data-cat="古典">古典</div>
              <div class="chip" data-cat="民谣">民谣</div>
              <div class="chip" data-cat="电子">电子</div>
            </div>
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="searchInput" placeholder="搜索作品标题、描述、标签...">
            </div>
          </div>
          <div class="filter-row">
            <span class="filter-label">排序</span>
            <div class="filter-chips" id="sortFilter">
              <div class="chip active" data-sort="hot">最受欢迎</div>
              <div class="chip" data-sort="new">最新发布</div>
              <div class="chip" data-sort="price-asc">价格 低→高</div>
              <div class="chip" data-sort="price-desc">价格 高→低</div>
            </div>
          </div>
        </div>
        <div class="works-grid" id="marketWorks"></div>
        <div id="marketEmpty" class="empty-state" style="display:none">
          <div class="empty-state-icon">🎵</div>
          <h3>暂无作品</h3>
          <p>换个筛选条件试试吧</p>
        </div>
      </div>
    `;
  },

  publish() {
    return `
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">发布作品</h1>
          <p class="page-subtitle">让你的才华被世界看见，作品一经售出即可获得90%收益</p>
        </div>
        <div class="form-container">
          <div class="type-selector" id="typeSelector">
            <div class="type-card active" data-type="lyrics">
              <div class="type-card-icon">📝</div>
              <div class="type-card-title">发布歌词</div>
              <div class="type-card-desc">原创词作品</div>
            </div>
            <div class="type-card" data-type="melody">
              <div class="type-card-icon">🎹</div>
              <div class="type-card-title">发布作曲</div>
              <div class="type-card-desc">原创旋律作品</div>
            </div>
          </div>

          <div class="form-group">
            <label>作品标题</label>
            <input type="text" id="pTitle" placeholder="给作品起一个响亮的名字">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>分类</label>
              <select id="pCategory">
                <option value="古风">古风</option>
                <option value="流行">流行</option>
                <option value="摇滚">摇滚</option>
                <option value="古典">古典</option>
                <option value="民谣">民谣</option>
                <option value="电子">电子</option>
                <option value="R&B">R&B</option>
                <option value="爵士">爵士</option>
              </select>
            </div>
            <div class="form-group">
              <label>定价 (¥)</label>
              <input type="number" id="pPrice" placeholder="最低 ¥100" min="100">
            </div>
          </div>

          <div class="form-group">
            <label>标签（回车添加，最多5个）</label>
            <div class="tags-input" id="tagsInput">
              <input type="text" id="tagInput" placeholder="如：抒情、励志、伤感...">
            </div>
          </div>

          <div id="lyricsFields">
            <div class="form-group">
              <label>歌词内容</label>
              <textarea id="pContent" placeholder="主歌1：......&#10;&#10;副歌：......&#10;&#10;主歌2：......"></textarea>
            </div>
          </div>

          <div id="melodyFields" style="display:none">
            <div class="form-row">
              <div class="form-group">
                <label>速度 (BPM)</label>
                <input type="number" id="pBpm" placeholder="如：76、120">
              </div>
              <div class="form-group">
                <label>调式</label>
                <select id="pKey">
                  <option value="C大调">C大调</option>
                  <option value="C小调">C小调</option>
                  <option value="G大调">G大调</option>
                  <option value="D大调">D大调</option>
                  <option value="F大调">F大调</option>
                  <option value="A小调">A小调</option>
                  <option value="C#小调">C#小调</option>
                  <option value="E大调">E大调</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>旋律简谱（用空格或换行分隔音符）</label>
              <textarea id="pMelody" placeholder="C4-E4-G4-C5-B4-G4-E4-C4&#10;或: 1-3-5-1-7-5-3-1"></textarea>
              <div class="form-hint">支持格式：音名（C4, D5等）或简谱数字，空格/换行分隔</div>
            </div>
          </div>

          <div class="form-group">
            <label>作品描述</label>
            <textarea id="pDesc" placeholder="介绍一下创作背景、灵感来源、情感表达..."></textarea>
          </div>

          <button class="btn btn-primary btn-block btn-lg" onclick="Publish.submit()">🚀 发布作品</button>
        </div>
      </div>
    `;
  },

  dashboard() {
    return `
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">创作中心</h1>
          <p class="page-subtitle">管理你的作品、订单与收益</p>
        </div>

        <div class="dashboard-grid" id="dashStats"></div>

        <div class="tabs">
          <div class="tab active" data-tab="overview">📊 总览</div>
          <div class="tab" data-tab="myworks">🎼 我的作品</div>
          <div class="tab" data-tab="purchased">🛒 已购作品</div>
          <div class="tab" data-tab="orders">📋 交易记录</div>
          <div class="tab" data-tab="profile">👤 个人资料</div>
        </div>

        <div id="tabContent"></div>
      </div>
    `;
  }
};

// ============ 首页逻辑 ============
const Home = {
  async init() {
    try {
      const stats = await API.get('/api/stats');
      document.getElementById('homeStats').innerHTML = `
        <div class="stat-card"><div class="stat-number">${stats.worksCount}</div><div class="stat-label">在售作品</div></div>
        <div class="stat-card"><div class="stat-number">${stats.usersCount}</div><div class="stat-label">注册用户</div></div>
        <div class="stat-card"><div class="stat-number">${stats.ordersCount}</div><div class="stat-label">成功交易</div></div>
        <div class="stat-card"><div class="stat-number">¥${(stats.totalAmount / 10000).toFixed(1)}万</div><div class="stat-label">累计交易额</div></div>
      `;

      const [lyrics, melody] = await Promise.all([
        API.get('/api/works?type=lyrics&sort=hot'),
        API.get('/api/works?type=melody&sort=hot')
      ]);
      document.getElementById('lyricsWorks').innerHTML = renderWorks(lyrics.works.slice(0, 4));
      document.getElementById('melodyWorks').innerHTML = renderWorks(melody.works.slice(0, 4));
    } catch (e) { console.error(e); }
  }
};

// ============ 作品卡片渲染 ============
function renderWorks(works) {
  if (!works.length) return '<div style="grid-column:1/-1" class="empty-state"><div class="empty-state-icon">🎵</div><h3>暂无作品</h3><p>敬请期待</p></div>';
  return works.map(w => `
    <div class="work-card" onclick="Market.showDetail(${w.id})">
      <div class="work-cover ${w.type === 'lyrics' ? 'type-lyrics' : 'type-melody'}">
        <span>${w.type === 'lyrics' ? '📜' : '🎼'}</span>
        <div class="work-badge">${w.type === 'lyrics' ? '歌词作品' : '作曲作品'}</div>
        <div class="work-stats">
          <span class="work-stat">👁 ${(w.plays||0).toLocaleString()}</span>
          <span class="work-stat">❤ ${(w.likes||0).toLocaleString()}</span>
        </div>
      </div>
      <div class="work-body">
        <div class="work-title-row">
          <h3 class="work-title">${w.title}</h3>
          <span class="work-category">${w.category}</span>
        </div>
        <p class="work-desc">${w.description || '暂无描述'}</p>
        <div class="work-tags">
          ${(w.tags||[]).slice(0,3).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="work-footer">
          <div class="work-author">
            <span class="author-avatar">${w.authorAvatar || '👤'}</span>
            <span class="author-name">${w.authorName}</span>
          </div>
          <div class="work-price"><small>¥</small>${w.price.toLocaleString()}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ============ 市场逻辑 ============
const Market = {
  filters: { type: 'all', category: '全部', sort: 'hot', search: '' },
  async init(openId) {
    ['typeFilter', 'categoryFilter', 'sortFilter'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (id === 'typeFilter') this.filters.type = chip.dataset.type;
        if (id === 'categoryFilter') this.filters.category = chip.dataset.cat;
        if (id === 'sortFilter') this.filters.sort = chip.dataset.sort;
        this.load();
      });
    });
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      clearTimeout(this._t);
      this._t = setTimeout(() => { this.filters.search = e.target.value.trim(); this.load(); }, 300);
    });
    this.load();
    if (openId) setTimeout(() => this.showDetail(openId), 200);
  },
  async load() {
    const p = new URLSearchParams();
    if (this.filters.type !== 'all') p.set('type', this.filters.type);
    if (this.filters.category !== '全部') p.set('category', this.filters.category);
    if (this.filters.sort) p.set('sort', this.filters.sort);
    if (this.filters.search) p.set('search', this.filters.search);
    try {
      const d = await API.get('/api/works?' + p.toString());
      document.getElementById('marketWorks').innerHTML = renderWorks(d.works);
      document.getElementById('marketEmpty').style.display = d.works.length ? 'none' : 'block';
    } catch (e) { console.error(e); }
  },
  async showDetail(id) {
    try {
      const d = await API.get('/api/works/' + id);
      const w = d.work;
      const isOwner = Store.user && Store.user.id === w.authorId;
      const purchased = Store.user ? (await API.get('/api/orders/my-works')).works.some(x => x.id === w.id) : false;
      const showFull = isOwner || purchased;

      const titleEl = document.getElementById('workTitle');
      const bodyEl = document.getElementById('workBody');
      titleEl.textContent = w.title;

      let contentHtml = '';
      if (w.type === 'lyrics') {
        let content = w.content || '';
        if (!showFull) {
          content = content.split('\n').slice(0, 6).join('\n') + '\n\n... ...';
        }
        contentHtml = `
          ${!showFull ? '<div class="work-blur">' : '<div>'}
            <div class="work-content-box">${content}</div>
          </div>
          ${!showFull ? `<div class="buy-banner"><p>🔒 购买后可查看完整歌词内容，获得商用授权</p><button class="btn btn-primary" onclick="Market.buy(${w.id})">立即购买 ¥${w.price.toLocaleString()}</button></div>` : ''}
        `;
      } else {
        let melody = w.melodyNotes || '';
        if (!showFull) {
          melody = melody.split('\n').slice(0, 2).join('\n') + '\n... ...';
        }
        contentHtml = `
          <div class="melody-info-row">
            <div class="melody-info-item"><div class="melody-info-label">速度 (BPM)</div><div class="melody-info-value">${w.bpm || '-'}</div></div>
            <div class="melody-info-item"><div class="melody-info-label">调式</div><div class="melody-info-value">${w.key || '-'}</div></div>
            <div class="melody-info-item"><div class="melody-info-label">时长</div><div class="melody-info-value">约 ${Math.ceil((melody.length / 30))}s</div></div>
          </div>
          ${!showFull ? '<div class="work-blur">' : '<div>'}
            <div class="melody-box">${melody}</div>
          </div>
          ${!showFull ? `<div class="buy-banner"><p>🔒 购买后可查看完整旋律及商用授权</p><button class="btn btn-primary" onclick="Market.buy(${w.id})">立即购买 ¥${w.price.toLocaleString()}</button></div>` : ''}
        `;
      }

      bodyEl.innerHTML = `
        <div class="work-detail-hero">
          <div class="work-detail-cover ${w.type === 'lyrics' ? 'type-lyrics' : 'type-melody'}">${w.type === 'lyrics' ? '📜' : '🎼'}</div>
          <div class="work-detail-info">
            <h2>${w.title}</h2>
            <div class="work-detail-meta">
              <span class="meta-item">👁 ${(w.plays||0).toLocaleString()} 浏览</span>
              <span class="meta-item">❤ ${(w.likes||0).toLocaleString()} 喜欢</span>
              <span class="meta-item">🏷 ${w.category}</span>
              <span class="meta-item">🕐 ${new Date(w.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="work-tags">
              ${(w.tags||[]).map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <div style="display:flex;align-items:center;gap:14px;margin-top:16px;">
              <div class="user-avatar" style="width:44px;height:44px;font-size:22px;">${w.authorAvatar || '👤'}</div>
              <div>
                <div style="font-weight:600;">${w.authorName}</div>
                <div style="font-size:13px;color:var(--text-muted);">创作者</div>
              </div>
            </div>
            <div class="work-detail-price">
              <span class="amount">¥${w.price.toLocaleString()}</span>
              <span class="unit">含税 · 永久授权</span>
            </div>
            <div style="display:flex;gap:12px;">
              ${isOwner ? '<button class="btn btn-outline" disabled>您是作者</button>' :
                purchased ? '<button class="btn btn-primary" disabled>✅ 已购买</button>' :
                `<button class="btn btn-primary" onclick="Market.buy(${w.id})">🛒 立即购买</button>`}
              <button class="btn btn-outline" onclick="API.post('/api/works/${w.id}/like').then(d=>{toast('点赞成功','success');this.showDetail(${w.id});})">❤ 喜欢</button>
            </div>
          </div>
        </div>

        <div class="work-detail-section">
          <h4>作品描述</h4>
          <p style="color:var(--text-secondary);line-height:2;">${w.description || '暂无描述'}</p>
        </div>

        <div class="work-detail-section">
          <h4>${w.type === 'lyrics' ? '完整歌词' : '旋律简谱'}</h4>
          ${contentHtml}
        </div>
      `;
      showModal('work');
    } catch (e) { toast(e.message, 'error'); }
  },
  async buy(id) {
    if (!Store.user) { toast('请先登录', 'error'); showModal('login'); return; }
    if (!confirm('确定购买此作品？将从余额中扣款。')) return;
    try {
      const d = await API.post('/api/orders', { workId: id });
      Store.user = d.user;
      Store.renderNav();
      closeModal('work');
      toast('🎉 购买成功！可在创作中心查看作品', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }
};

// ============ 发布逻辑 ============
const Publish = {
  type: 'lyrics',
  tags: [],
  init() {
    document.getElementById('typeSelector').addEventListener('click', (e) => {
      const card = e.target.closest('.type-card');
      if (!card) return;
      document.querySelectorAll('#typeSelector .type-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      this.type = card.dataset.type;
      document.getElementById('lyricsFields').style.display = this.type === 'lyrics' ? '' : 'none';
      document.getElementById('melodyFields').style.display = this.type === 'melody' ? '' : 'none';
    });

    const tagsInput = document.getElementById('tagsInput');
    const tagInput = document.getElementById('tagInput');
    const renderTags = () => {
      tagsInput.querySelectorAll('.tag-item').forEach(e => e.remove());
      this.tags.forEach((t, i) => {
        const el = document.createElement('div');
        el.className = 'tag-item';
        el.innerHTML = `${t} <span class="tag-remove" onclick="Publish.removeTag(${i})">×</span>`;
        tagsInput.insertBefore(el, tagInput);
      });
    };
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && tagInput.value.trim()) {
        e.preventDefault();
        if (this.tags.length >= 5) return toast('最多5个标签', 'error');
        if (!this.tags.includes(tagInput.value.trim())) {
          this.tags.push(tagInput.value.trim());
          renderTags();
        }
        tagInput.value = '';
      } else if (e.key === 'Backspace' && !tagInput.value && this.tags.length) {
        this.tags.pop();
        renderTags();
      }
    });
    window.Publish.removeTag = (i) => { this.tags.splice(i, 1); renderTags(); };
  },
  async submit() {
    const title = document.getElementById('pTitle').value.trim();
    const category = document.getElementById('pCategory').value;
    const price = Number(document.getElementById('pPrice').value);
    const description = document.getElementById('pDesc').value.trim();
    const content = document.getElementById('pContent')?.value.trim() || '';
    const melodyNotes = document.getElementById('pMelody')?.value.trim() || '';
    const bpm = document.getElementById('pBpm')?.value.trim() || '';
    const key = document.getElementById('pKey')?.value || '';

    if (!title) return toast('请填写作品标题', 'error');
    if (!price || price < 100) return toast('定价不低于 ¥100', 'error');
    if (this.type === 'lyrics' && !content) return toast('请填写歌词内容', 'error');
    if (this.type === 'melody' && !melodyNotes) return toast('请填写旋律简谱', 'error');

    try {
      const d = await API.post('/api/works', {
        title, type: this.type, price, category,
        tags: this.tags, description, content, melodyNotes, bpm, key
      });
      toast('🎉 作品发布成功！', 'success');
      router.navigate('dashboard');
    } catch (e) { toast(e.message, 'error'); }
  }
};

// ============ 仪表盘逻辑 ============
const Dashboard = {
  tab: 'overview',
  async init() {
    try {
      const d = await API.get('/api/dashboard');
      document.getElementById('dashStats').innerHTML = `
        <div class="dash-card"><div class="dash-card-label">🎼 作品数量</div><div class="dash-card-value">${d.worksCount}</div></div>
        <div class="dash-card"><div class="dash-card-label">💰 累计收入</div><div class="dash-card-value gold">¥${d.income.toLocaleString()}</div></div>
        <div class="dash-card"><div class="dash-card-label">🛒 已购作品</div><div class="dash-card-value">${d.boughtCount}</div></div>
        <div class="dash-card"><div class="dash-card-label">💸 累计支出</div><div class="dash-card-value negative">¥${d.expense.toLocaleString()}</div></div>
        <div class="dash-card"><div class="dash-card-label">💳 当前余额</div><div class="dash-card-value gold">¥${d.balance.toLocaleString()}</div></div>
      `;
    } catch (e) { console.error(e); }

    document.querySelectorAll('.tabs .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.tab = tab.dataset.tab;
        this.renderTab();
      });
    });
    this.renderTab();
  },
  async renderTab() {
    const el = document.getElementById('tabContent');
    const user = Store.user;
    try {
      if (this.tab === 'overview') {
        const d = await API.get('/api/dashboard');
        const dRecent = d.recentOrders.map(o => {
          const isIncome = o.sellerId === user.id;
          return `
            <div class="list-item">
              <div class="list-icon">${o.workType === 'lyrics' ? '📜' : '🎼'}</div>
              <div class="list-content">
                <div class="list-title">${o.workTitle}</div>
                <div class="list-meta">${isIncome ? '买家：' + o.buyerName : '卖家：' + o.sellererName || o.sellerName} · ${new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div class="list-amount ${isIncome ? 'income' : 'expense'}">${isIncome ? '+' : '-'}¥${o.price.toLocaleString()}</div>
            </div>`;
        }).join('');
        el.innerHTML = `
          <div class="dashboard-main">
            <div class="dash-panel">
              <div class="dash-panel-header"><h3 class="dash-panel-title">📜 我的作品</h3><button class="btn btn-ghost btn-sm" onclick="router.requireAuth('publish')">+ 发布</button></div>
              <div class="dash-panel-body">
                ${d.recentWorks.length ? d.recentWorks.map(w => `
                  <div class="list-item" onclick="Market.showDetail(${w.id})" style="cursor:pointer">
                    <div class="list-icon">${w.type === 'lyrics' ? '📜' : '🎼'}</div>
                    <div class="list-content">
                      <div class="list-title">${w.title}</div>
                      <div class="list-meta">${w.category} · ${(w.plays||0).toLocaleString()} 播放 · ${(w.likes||0)} 喜欢 · ${new Date(w.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div class="list-amount">¥${w.price.toLocaleString()}</div>
                  </div>
                `).join('') : '<div class="empty-state"><div class="empty-state-icon">✍️</div><h3>还没有作品</h3><p>发布你的第一个作品开始创作之旅</p><button class="btn btn-primary" onclick="router.requireAuth(\'publish\')">立即发布</button></div>'}
              </div>
            </div>
            <div class="dash-panel">
              <div class="dash-panel-header"><h3 class="dash-panel-title">📋 最近交易</h3></div>
              <div class="dash-panel-body">
                ${d.recentOrders.length ? dRecent : '<div class="empty-state"><div class="empty-state-icon">💳</div><h3>暂无交易</h3><p>开始探索市场或发布作品吧</p></div>'}
              </div>
            </div>
          </div>
        `;
      } else if (this.tab === 'myworks') {
        const d = await API.get('/api/works?authorId=' + user.id);
        el.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h3 style="font-size:20px;font-family:'Noto Serif SC',serif;">共 ${d.works.length} 个作品</h3>
            <button class="btn btn-primary" onclick="router.requireAuth('publish')">+ 发布新作品</button>
          </div>
          <div class="works-grid">
            ${d.works.length ? d.works.map(w => `
              <div class="work-card">
                <div class="work-cover ${w.type === 'lyrics' ? 'type-lyrics' : 'type-melody'}" onclick="Market.showDetail(${w.id})" style="cursor:pointer">
                  <span>${w.type === 'lyrics' ? '📜' : '🎼'}</span>
                  <div class="work-badge">${w.status === 'onsale' ? '出售中' : '已下架'}</div>
                  <div class="work-stats"><span class="work-stat">👁 ${(w.plays||0).toLocaleString()}</span><span class="work-stat">❤ ${(w.likes||0)}</span></div>
                </div>
                <div class="work-body">
                  <div class="work-title-row"><h3 class="work-title">${w.title}</h3><span class="work-category">${w.category}</span></div>
                  <p class="work-desc">${w.description || '暂无描述'}</p>
                  <div class="work-footer">
                    <div class="work-tags">${(w.tags||[]).slice(0,2).map(t => `<span class="tag">${t}</span>`).join('')}</div>
                    <div style="display:flex;gap:8px;align-items:center;">
                      <div class="work-price"><small>¥</small>${w.price.toLocaleString()}</div>
                      ${w.status === 'onsale' ? `<button class="btn btn-sm btn-danger" onclick="Dashboard.delWork(${w.id})">下架</button>` : ''}
                    </div>
                  </div>
                </div>
              </div>
            `).join('') : '<div style="grid-column:1/-1" class="empty-state"><div class="empty-state-icon">✍️</div><h3>还没有作品</h3><p>发布你的第一个作品开始创作之旅</p><button class="btn btn-primary" onclick="router.requireAuth(\'publish\')">立即发布</button></div>'}
          </div>
        `;
      } else if (this.tab === 'purchased') {
        const d = await API.get('/api/orders/my-works');
        el.innerHTML = `
          <h3 style="font-size:20px;font-family:'Noto Serif SC',serif;margin-bottom:24px;">已购买 ${d.works.length} 个作品</h3>
          <div class="works-grid">
            ${d.works.length ? renderWorks(d.works) : '<div style="grid-column:1/-1" class="empty-state"><div class="empty-state-icon">🛒</div><h3>还没有购买</h3><p>去市场逛逛看有没有喜欢的作品</p><button class="btn btn-primary" onclick="router.navigate(\'market\')">逛市场</button></div>'}
          </div>
        `;
      } else if (this.tab === 'orders') {
        const [bought, sold] = await Promise.all([
          API.get('/api/orders'),
          API.get('/api/orders?role=seller')
        ]);
        const all = [...bought.orders.map(o => ({ ...o, _role: 'buyer' })), ...sold.orders.map(o => ({ ...o, _role: 'seller' }))];
        all.sort((a, b) => b.createdAt - a.createdAt);
        el.innerHTML = `
          <div class="dash-panel">
            <div class="dash-panel-header"><h3 class="dash-panel-title">共 ${all.length} 条交易记录</h3></div>
            <div class="dash-panel-body">
              ${all.length ? all.map(o => `
                <div class="list-item">
                  <div class="list-icon">${o._role === 'seller' ? '💰' : '🛒'}</div>
                  <div class="list-content">
                    <div class="list-title">${o.workTitle}</div>
                    <div class="list-meta">
                      ${o._role === 'seller' ? `买家: ${o.buyerName}` : `卖家: ${o.sellerName}`}
                      · ${new Date(o.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:12px;">
                    <span class="list-status ${o.status}">${o.status === 'completed' ? '已完成' : o.status}</span>
                    <div class="list-amount ${o._role === 'seller' ? 'income' : 'expense'}">${o._role === 'seller' ? '+' : '-'}¥${o.price.toLocaleString()}</div>
                  </div>
                </div>
              `).join('') : '<div class="empty-state"><div class="empty-state-icon">📋</div><h3>暂无交易</h3></div>'}
            </div>
          </div>
        `;
      } else if (this.tab === 'profile') {
        el.innerHTML = `
          <div class="form-container">
            <div style="text-align:center;margin-bottom:36px;">
              <div style="font-size:64px;margin-bottom:16px;">${user.avatar || '👤'}</div>
              <h3 style="font-size:22px;font-family:'Noto Serif SC',serif;">${user.nickname}</h3>
              <p style="color:var(--text-muted);margin-top:4px;">@${user.username} · ${user.role === 'seller' ? '创作者' : '音乐爱好者'}</p>
            </div>
            <div class="form-group">
              <label>昵称</label>
              <input type="text" id="pfNickname" value="${user.nickname || ''}">
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input type="email" id="pfEmail" value="${user.email || ''}">
            </div>
            <div class="form-group">
              <label>个人简介</label>
              <textarea id="pfBio" style="min-height:120px;">${user.bio || ''}</textarea>
            </div>
            <div class="form-group">
              <label>选择头像</label>
              <div style="display:flex;gap:12px;flex-wrap:wrap;">
                ${['🎭','🎹','🎧','🎸','🎺','🎻','🥁','🎤','🌟','🎨','🎯','🎪'].map(a => `
                  <div onclick="Dashboard.pickAvatar('${a}')" style="width:52px;height:52px;border-radius:14px;background:${user.avatar===a?'var(--accent-glow)':'var(--bg-tertiary)'};border:2px solid ${user.avatar===a?'var(--accent)':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${a}</div>
                `).join('')}
              </div>
            </div>
            <div style="display:flex;gap:16px;margin-top:30px;">
              <button class="btn btn-primary flex:1" onclick="Dashboard.saveProfile()" style="flex:1;">💾 保存修改</button>
              <button class="btn btn-outline" onclick="Store.logout()">退出登录</button>
            </div>
          </div>
        `;
      }
    } catch (e) { toast(e.message, 'error'); }
  },
  async delWork(id) {
    if (!confirm('确定下架此作品？')) return;
    try {
      await API.del('/api/works/' + id);
      toast('已下架', 'success');
      this.renderTab();
    } catch (e) { toast(e.message, 'error'); }
  },
  pickAvatar(a) {
    Store.user.avatar = a;
    this.renderTab();
  },
  async saveProfile() {
    const nickname = document.getElementById('pfNickname').value.trim();
    const email = document.getElementById('pfEmail').value.trim();
    const bio = document.getElementById('pfBio').value.trim();
    if (!nickname) return toast('昵称不能为空', 'error');
    try {
      const d = await API.put('/api/user/me', { nickname, email, bio, avatar: Store.user.avatar });
      Store.user = d.user;
      Store.renderNav();
      toast('保存成功', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }
};

// ============ 启动 ============
(async function boot() {
  await Store.init();
  router.navigate('home');
})();
