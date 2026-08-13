import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load works first, then extract unique sellers
    api.get('/works', { params: { pageSize: 50, sort: 'sales' } }).then(async (data) => {
      setWorks(data.list);
      const sellerMap = {};
      for (const w of data.list) {
        if (!sellerMap[w.seller_id]) {
          try {
            const s = await api.get(`/users/${w.seller_id}`);
            sellerMap[w.seller_id] = s;
          } catch (e) {}
        }
      }
      setSellers(Object.values(sellerMap).sort((a, b) => b.total_earn - a.total_earn));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 text-sm font-medium mb-4">✨ 才华横溢</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">优秀<span className="gradient-text">创作人</span></h1>
        <p className="text-gray-500">发现平台最出色的词曲创作者，关注并洽谈合作</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {loading ? Array(6).fill(0).map((_, i) => <div key={i} className="card p-6 h-48 skeleton" />) :
          sellers.map(s => (
            <Link key={s.id} to={`/users/${s.id}`} className="card p-6 group hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img src={s.avatar} alt="" className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300" />
                  {s.is_verified && <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs border-2 border-white">✓</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 line-clamp-1">{s.username}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8">{s.bio || '才华横溢的创作人'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-50">
                <div className="text-center">
                  <div className="font-bold text-xl text-gray-900">{s.worksCount || 0}</div>
                  <div className="text-xs text-gray-500 mt-0.5">作品数</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-gray-900">{s.salesCount || 0}</div>
                  <div className="text-xs text-gray-500 mt-0.5">累计销量</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-music-600">{(s.avgRating || 0).toFixed(1)}</div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1"><span className="star-filled text-xs">★</span>评分</div>
                </div>
              </div>
            </Link>
          ))}
      </div>

      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🎨 精选作品</h2>
          <p className="text-gray-500 mt-1">来自优秀创作者的热门作品</p>
        </div>
        <Link to="/search" className="text-primary-600 font-medium hover:text-primary-700">查看全部 →</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {works.slice(0, 12).map(w => {
          const s = sellers.find(x => x.id === w.seller_id);
          return (
            <Link key={w.id} to={`/works/${w.id}`} className="card group overflow-hidden block">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                {w.cover_image ? <img src={w.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🎵</div>}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{w.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img src={s?.avatar || w.seller_avatar} alt="" className="w-5 h-5 rounded-full flex-shrink-0" />
                    <span className="text-xs text-gray-500 truncate">{w.seller_name}</span>
                  </div>
                  <div className="font-bold text-music-600 flex-shrink-0 ml-2">¥{Number(w.price).toFixed(0)}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
