import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import WorkCard from '../components/WorkCard';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [works, setWorks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState(params.get('keyword') || '');
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState(params.get('sort') || 'new');
  const [priceRange, setPriceRange] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const fetchWorks = () => {
    setLoading(true);
    const minMax = { all: [null, null], '0-500': [0, 500], '500-1000': [500, 1000], '1000-3000': [1000, 3000], '3000+': [3000, null] }[priceRange];
    api.get('/works', {
      params: {
        keyword: keyword || undefined,
        category: category === 'all' ? undefined : category,
        type: type === 'all' ? undefined : type,
        sort, page, pageSize,
        minPrice: minMax[0], maxPrice: minMax[1],
      }
    }).then(data => {
      setWorks(data.list);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/categories').then(setCategories);
  }, []);

  useEffect(() => {
    fetchWorks();
    // eslint-disable-next-line
  }, [page, sort, category, type, priceRange]);

  const totalPages = Math.ceil(total / pageSize);

  const doSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchWorks();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <form onSubmit={doSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder="搜索作品名称、描述、标签..."
              className="input-field !pl-12 !py-4 !text-base" />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button type="submit" className="btn-primary !px-10">搜索</button>
        </div>
      </form>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0 space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">🎭 作品分类</h3>
            <div className="space-y-1">
              <button onClick={() => { setCategory('all'); setPage(1); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === 'all' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                全部分类
              </button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setCategory(cat.id); setPage(1); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category == cat.id ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <span className="mr-2">{cat.icon}</span>{cat.name}
                  <span className="text-xs text-gray-400 float-right">{cat.works_count || 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">🎵 作品类型</h3>
            <div className="grid grid-cols-3 gap-2">
              {[['all', '全部'], ['song', '完整歌曲'], ['lyrics', '歌词'], ['music', '纯音乐']].map(([v, l]) => (
                <button key={v} onClick={() => { setType(v); setPage(1); }} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${type === v ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">💰 价格区间</h3>
            <div className="space-y-2">
              {[['all', '不限'], ['0-500', '¥500 以下'], ['500-1000', '¥500 - 1,000'], ['1000-3000', '¥1,000 - 3,000'], ['3000+', '¥3,000 以上']].map(([v, l]) => (
                <button key={v} onClick={() => { setPriceRange(v); setPage(1); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${priceRange === v ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="card p-4 mb-6 flex flex-wrap items-center gap-3 justify-between">
            <div className="text-sm text-gray-500">
              共找到 <span className="font-semibold text-primary-600">{total}</span> 件作品
            </div>
            <div className="flex flex-wrap gap-2">
              {[['new', '最新发布'], ['sales', '销量优先'], ['rating', '评分优先'], ['views', '浏览量'], ['price-asc', '价格↑'], ['price-desc', '价格↓']].map(([v, l]) => (
                <button key={v} onClick={() => { setSort(v); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${sort === v ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(9).fill(0).map((_, i) => <div key={i} className="card h-80"><div className="w-full h-48 skeleton" /><div className="p-4 space-y-3"><div className="h-4 skeleton w-3/4" /><div className="h-3 skeleton w-full" /><div className="h-6 skeleton w-1/3" /></div></div>)}
            </div>
          ) : works.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">未找到相关作品</h3>
              <p className="text-gray-500 text-sm">试试其他关键词或筛选条件</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {works.map(w => <WorkCard key={w.id} work={w} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary !px-4 !py-2 disabled:opacity-50 disabled:cursor-not-allowed">上一页</button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p;
                    if (totalPages <= 5) p = i + 1;
                    else if (page <= 3) p = i + 1;
                    else if (page >= totalPages - 2) p = totalPages - 4 + i;
                    else p = page - 2 + i;
                    return (
                      <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-xl font-medium transition-all ${page === p ? 'bg-gradient-to-br from-primary-500 to-music-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                        {p}
                      </button>
                    );
                  })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary !px-4 !py-2 disabled:opacity-50 disabled:cursor-not-allowed">下一页</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
