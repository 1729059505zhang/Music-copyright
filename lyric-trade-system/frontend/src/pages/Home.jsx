import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import WorkCard from '../components/WorkCard';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [hotWorks, setHotWorks] = useState([]);
  const [newWorks, setNewWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/works/hot?limit=6'),
      api.get('/works/new?limit=8'),
    ]).then(([cats, hot, newW]) => {
      setCategories(cats);
      setHotWorks(hot);
      setNewWorks(newW);
    }).finally(() => setLoading(false));
  }, []);

  const features = [
    { icon: '🎨', title: '海量原创作品', desc: '10万+优质原创作词作曲，风格多样任您挑选' },
    { icon: '🛡️', title: '版权有保障', desc: '区块链存证+版权交易证书，交易全程可追溯' },
    { icon: '⚡', title: '秒速交付', desc: '支付成功即可下载完整作品，无需等待' },
    { icon: '💰', title: '收益有保障', desc: '平台担保交易，买家满意卖家收款' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-music-50" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(217,70,239,0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(249,115,22,0.1), transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-medium text-primary-600 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              平台已累计成交作品 100,000+ 件
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              让每一个音符<br />
              <span className="gradient-text">都能找到知音</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              词曲集市 - 国内领先的原创词曲交易平台<br className="hidden sm:block" />
              作词作曲、编曲配乐、定制创作，一站式音乐版权服务
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/search" className="btn-primary text-lg !px-8 !py-3.5 flex items-center gap-2">
                🔍 开始探索作品
              </Link>
              <Link to="/register?role=seller" className="btn-secondary text-lg !px-8 !py-3.5 flex items-center gap-2">
                ✨ 成为创作者
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 max-w-xl">
              {[
                { num: '100,000+', label: '作品数量' },
                { num: '8,000+', label: '认证创作者' },
                { num: '99.8%', label: '好评率' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{s.num}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating decoration */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute top-0 right-20 text-[180px] animate-pulse-slow">🎹</div>
          <div className="absolute bottom-10 right-0 text-[100px] animate-pulse-slow" style={{ animationDelay: '0.5s' }}>🎸</div>
          <div className="absolute top-1/2 right-40 text-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }}>🎤</div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🎭 作品分类</h2>
              <p className="text-gray-500 text-sm mt-1">按风格选择您喜欢的作品</p>
            </div>
            <Link to="/search" className="text-primary-600 font-medium hover:text-primary-700 text-sm">查看全部 →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {categories.map(cat => (
              <Link key={cat.id} to={`/search?category=${cat.id}`}
                className="group flex flex-col items-center p-5 rounded-2xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-music-50 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  {cat.icon || '🎵'}
                </div>
                <div className="mt-3 text-sm font-medium text-gray-700 group-hover:text-primary-600">{cat.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{cat.works_count || 0} 件作品</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-medium text-music-600 bg-music-50 rounded-full mb-3">🔥 热销榜单</span>
            <h2 className="text-3xl font-bold text-gray-900">最受欢迎的作品</h2>
            <p className="text-gray-500 mt-2">经过万千音乐人验证的优质作品</p>
          </div>
          <Link to="/ranking" className="hidden md:inline-flex btn-secondary text-sm">完整排行榜 →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => <div key={i} className="card h-80"><div className="w-full h-48 skeleton" /><div className="p-4 space-y-3"><div className="h-4 skeleton w-3/4" /><div className="h-3 skeleton w-full" /><div className="h-3 skeleton w-2/3" /><div className="h-6 skeleton w-1/3 mt-4" /></div></div>)
          ) : hotWorks.map((work, i) => (
            <div key={work.id} className="relative">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-music-500 to-red-500 text-white flex items-center justify-center font-bold shadow-lg z-10">
                {i + 1}
              </div>
              <WorkCard work={work} />
            </div>
          ))}
        </div>
      </section>

      {/* New Works */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full mb-3">✨ 最新上架</span>
              <h2 className="text-3xl font-bold text-gray-900">新鲜出炉的好作品</h2>
              <p className="text-gray-500 mt-2">发现更多潜力佳作</p>
            </div>
            <Link to="/search?sort=new" className="hidden md:inline-flex btn-secondary text-sm">查看更多 →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(8).fill(0).map((_, i) => <div key={i} className="card h-72"><div className="w-full h-40 skeleton" /><div className="p-3 space-y-2"><div className="h-3 skeleton w-3/4" /><div className="h-3 skeleton w-1/2" /><div className="h-5 skeleton w-1/3 mt-2" /></div></div>)
            ) : newWorks.map(work => <WorkCard key={work.id} work={work} compact />)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">为什么选择 <span className="gradient-text">词曲集市</span></h2>
          <p className="text-gray-500 text-lg">我们致力于打造最专业的词曲交易生态</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card p-8 text-center group hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-100 to-music-100 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-music-500 p-8 md:p-16 text-white">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好开启您的音乐之旅了吗？</h2>
            <p className="text-white/80 text-lg mb-8">无论您是寻找优质词曲的买家，还是才华横溢的创作人，词曲集市都是您的最佳选择。</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/search" className="px-8 py-3.5 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl">
                立即浏览作品
              </Link>
              <Link to="/register?role=seller" className="px-8 py-3.5 bg-white/10 backdrop-blur border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                入驻成为创作者
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
