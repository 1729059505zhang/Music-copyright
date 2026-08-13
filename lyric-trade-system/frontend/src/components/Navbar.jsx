import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [unread, setUnread] = useState(0);

  React.useEffect(() => {
    if (user) {
      api.get('/messages/unread-count').then(d => setUnread(d.count)).catch(() => {});
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  const navItem = (path, label) => (
    <Link to={path} className={`px-4 py-2 rounded-xl font-medium transition-all ${
      location.pathname === path ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
    }`}>{label}</Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-music-500 flex items-center justify-center text-white text-xl shadow-lg shadow-primary-500/30">🎵</div>
            <div>
              <div className="font-bold text-lg gradient-text leading-none">词曲集市</div>
              <div className="text-[10px] text-gray-400 leading-none mt-1">LyricTrade Market</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItem('/', '首页')}
            {navItem('/search', '作品市场')}
            {navItem('/ranking', '排行榜')}
            {navItem('/sellers', '创作者')}
          </nav>

          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder="搜索词曲作品、作者、标签..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-primary-500/30 outline-none transition-all" />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </form>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </Link>
                <Link to="/messages" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  {unread > 0 && <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{unread > 99 ? '99+' : unread}</span>}
                </Link>

                <div className="relative">
                  <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-colors">
                    <img src={user.avatar} alt="" className="w-9 h-9 rounded-full border-2 border-primary-100" />
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium leading-tight truncate max-w-[100px]">{user.username}</div>
                      <div className="text-xs text-gray-400 leading-tight">¥{Number(user.balance || 0).toFixed(2)}</div>
                    </div>
                  </button>

                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40 animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-xs text-gray-500">{user.role === 'admin' ? '管理员' : user.role === 'seller' ? '创作者' : '买家'}</div>
                            </div>
                          </div>
                        </div>
                        <Link to="/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <span>👤</span> 个人中心
                        </Link>
                        <Link to="/orders" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <span>📦</span> 我的订单
                        </Link>
                        <Link to="/favorites" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <span>❤️</span> 我的收藏
                        </Link>
                        {(user.role === 'seller' || user.role === 'admin') && (
                          <Link to="/seller/works" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50">
                            <span>🎨</span> 创作中心
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-music-600 hover:bg-music-50">
                            <span>⚙️</span> 管理后台
                          </Link>
                        )}
                        <div className="border-t border-gray-100 my-2" />
                        <button onClick={() => { logout(); setShowMenu(false); navigate('/'); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full">
                          <span>🚪</span> 退出登录
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors">登录</Link>
                <Link to="/register" className="btn-primary !px-5 !py-2 text-sm">注册</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
