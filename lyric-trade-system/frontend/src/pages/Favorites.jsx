import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import WorkCard from '../components/WorkCard';

export default function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login?redirect=' + encodeURIComponent('/favorites')); return; }
    api.get('/works/my/favorites').then(setItems).finally(() => setLoading(false));
  }, [user, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">❤️ 我的收藏 <span className="text-sm font-normal text-gray-400 ml-2">({items.length} 件作品)</span></h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => <div key={i} className="card h-72"><div className="w-full h-40 skeleton" /><div className="p-4 space-y-2" /></div>)}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-7xl mb-4">💔</div>
          <h3 className="font-semibold text-xl text-gray-900 mb-2">还没有收藏的作品</h3>
          <p className="text-gray-500 mb-6">看到喜欢的作品别忘了点收藏哦～</p>
          <Link to="/search" className="btn-primary inline-block">去发现作品 →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(w => <WorkCard key={w.id} work={w} compact />)}
        </div>
      )}
    </div>
  );
}
