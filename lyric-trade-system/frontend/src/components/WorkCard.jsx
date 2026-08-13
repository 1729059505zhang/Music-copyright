import React from 'react';
import { Link } from 'react-router-dom';

const typeLabels = { song: '完整歌曲', lyrics: '歌词', music: '纯音乐' };
const typeColors = {
  song: 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700',
  lyrics: 'bg-gradient-to-r from-music-100 to-music-50 text-music-700',
  music: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700',
};

export default function WorkCard({ work, compact = false }) {
  if (!work) return null;
  const stars = Math.round(work.rating || 0);

  return (
    <Link to={`/works/${work.id}`} className="card group overflow-hidden block">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {work.cover_image ? (
          <img src={work.cover_image} alt={work.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">🎼</div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`badge ${typeColors[work.type] || 'bg-gray-100 text-gray-700'}`}>
            {typeLabels[work.type] || work.type}
          </span>
        </div>
        {work.category_name && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-black/50 text-white backdrop-blur-sm">{work.category_icon || '🎵'} {work.category_name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            查看详情
          </span>
        </div>
      </div>

      <div className={`p-4 ${compact ? '' : ''}`}>
        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors mb-2">{work.title}</h3>
        {!compact && (
          <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-3">{work.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img src={work.seller_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${work.seller_id}`} alt="" className="w-6 h-6 rounded-full flex-shrink-0" />
            <span className="text-sm text-gray-600 truncate">{work.seller_name}</span>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            {stars > 0 && (
              <div className="text-xs mb-0.5 flex items-center gap-0.5 justify-end">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={i <= stars ? 'star-filled' : 'star-empty'}>★</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">销量 {work.sales || 0} · 浏览 {work.views || 0}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400">¥</span>
            <span className="text-xl font-bold text-music-600 ml-0.5">{Number(work.price).toFixed(0)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
