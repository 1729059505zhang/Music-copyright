import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import WorkCard from '../components/WorkCard';

export default function Ranking() {
  const [tab, setTab] = useState('sales');
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/works', {
      params: {
        pageSize: 20,
        sort: tab === 'rating' ? 'rating' : tab === 'views' ? 'views' : 'sales'
      }
    }).then(d => setWorks(d.list)).finally(() => setLoading(false));
  }, [tab]);

  const medals = ['🥇', '🥈', '🥉'];
  const tabs = [['sales', '热销榜', '销量最高'], ['rating', '好评榜', '口碑最佳'], ['views', '人气榜', '最多浏览']];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-music-50 rounded-full text-music-600 text-sm font-medium mb-4">🏆 权威榜单</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">作品 <span className="gradient-text">排行榜</span></h1>
        <p className="text-gray-500">发现经过市场验证的优质词曲作品</p>
      </div>

      <div className="flex justify-center gap-2 mb-10">
        {tabs.map(([v, t, d]) => (
          <button key={v} onClick={() => setTab(v)} className={`group px-8 py-4 rounded-2xl transition-all ${tab === v ? 'bg-gradient-to-br from-primary-500 to-music-500 text-white shadow-xl shadow-primary-500/30 scale-105' : 'bg-white card hover:shadow-md'}`}>
            <div className={`font-bold text-lg ${tab === v ? '' : 'text-gray-900 group-hover:text-primary-600'}`}>{t}</div>
            <div className={`text-xs mt-1 ${tab === v ? 'text-white/80' : 'text-gray-500'}`}>{d}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            Array(10).fill(0).map((_, i) => <div key={i} className="card h-28 skeleton rounded-2xl" />)
          ) : (
            works.map((w, i) => (
              <div key={w.id} className={`card p-4 flex items-center gap-5 group hover:-translate-y-0.5 ${i < 3 ? '!shadow-lg' : ''}`}>
                <div className={`w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-lg shadow-yellow-500/40' :
                  i === 1 ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-white shadow-lg shadow-gray-400/40' :
                  i === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-600 text-white shadow-lg shadow-orange-500/40' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {medals[i] || i + 1}
                </div>
                <Link to={`/works/${w.id}`} className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  {w.cover_image ? <img src={w.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🎵</div>}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/works/${w.id}`} className="font-semibold text-gray-900 text-lg hover:text-primary-600 line-clamp-1 block">{w.title}</Link>
                  <div className="text-sm text-gray-500 mt-1.5 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <img src={w.seller_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=seller`} className="w-4 h-4 rounded-full" />
                      {w.seller_name}
                    </span>
                    {w.category_name && <><span>·</span><span className="badge bg-gray-100 text-gray-600 !py-0.5">{w.category_icon} {w.category_name}</span></>}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-music-600 font-semibold">
                      <span className="star-filled text-xs">★</span>
                      {(w.rating || 0).toFixed(1)}
                    </span>
                    <span className="text-gray-500">💸 销量 {w.sales || 0}</span>
                    <span className="text-gray-500">👁 {w.views || 0}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold gradient-text">¥{Number(w.price).toFixed(0)}</div>
                  <Link to={`/works/${w.id}`} className="mt-3 inline-block text-sm text-primary-600 hover:underline font-medium">查看详情 →</Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 text-8xl opacity-5">👑</div>
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">🔥 TOP 3 热门作品</h3>
            <div className="space-y-4">
              {works.slice(0, 3).map((w, i) => (
                <Link key={w.id} to={`/works/${w.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="text-3xl">{medals[i]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 line-clamp-1 group-hover:text-primary-600">{w.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{w.seller_name}</div>
                  </div>
                  <div className="font-semibold text-music-600">¥{Number(w.price).toFixed(0)}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-primary-500 to-music-500 text-white border-0">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl mb-4">🎁</div>
            <h3 className="font-bold text-xl mb-2">上榜有福利！</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-4">登上平台排行榜，可获得：</p>
            <ul className="space-y-2 text-sm">
              {['✨ 平台首页推荐曝光', '💎 专属创作者徽章', '📈 作品搜索加权', '🎯 优先参与平台活动'].map((t, i) => (
                <li key={i} className="flex items-center gap-2"><span>{t.split(' ')[0]}</span><span className="text-white/90">{t.split(' ').slice(1).join(' ')}</span></li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {works.slice(3, 9).map(w => <WorkCard key={w.id} work={w} compact />)}
          </div>
        </div>
      </div>
    </div>
  );
}
