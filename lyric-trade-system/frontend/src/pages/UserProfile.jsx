import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import WorkCard from '../components/WorkCard';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/users/${id}`),
      api.get('/works', { params: { seller_id: id, pageSize: 20, status: 'all' } })
    ]).then(([u, w]) => {
      setUserInfo(u);
      setWorks(w.list.filter(x => x.status === 'approved'));
    }).catch(e => {
      if (e.message && e.message.includes('不存在')) navigate('/');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading || !userInfo) return <div className="max-w-6xl mx-auto p-8"><div className="skeleton h-80 rounded-2xl" /></div>;

  const doContact = () => {
    if (!localStorage.getItem('token')) { navigate('/login?redirect=' + encodeURIComponent(location.pathname)); return; }
    setShowContact(true);
  };

  const sendMsg = async () => {
    if (!msg.trim()) return;
    try {
      await api.post('/messages', { receiver_id: userInfo.id, content: msg.trim() });
      setMsg(''); setShowContact(false);
      navigate('/messages?other=' + userInfo.id);
    } catch (e) {}
  };

  return (
    <div className="animate-fade-in">
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-music-500 text-white pb-20">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.15), transparent 40%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.1), transparent 40%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <Link to="/sellers" className="text-white/80 hover:text-white text-sm inline-flex items-center gap-1 mb-6">← 返回创作者列表</Link>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative flex-shrink-0">
              <img src={userInfo.avatar} alt="" className="w-32 h-32 rounded-3xl border-4 border-white/30 shadow-2xl backdrop-blur" />
              {userInfo.is_verified && <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 text-white rounded-2xl flex items-center justify-center text-lg border-4 border-white shadow-lg">✓</div>}
            </div>
            <div className="flex-1 pt-2">
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 flex-wrap">
                {userInfo.username}
                <span className={`badge text-sm !px-4 !py-1.5 ${
                  userInfo.role === 'admin' ? 'bg-music-500 text-white' :
                  userInfo.role === 'seller' ? 'bg-white/20 text-white backdrop-blur' :
                  'bg-blue-500/30 text-white'
                }`}>
                  {userInfo.role === 'admin' ? '平台管理员' : userInfo.role === 'seller' ? '✨ 认证创作者' : '音乐爱好者'}
                </span>
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mt-3">{userInfo.bio || '这个人很神秘，什么也没留下...'}</p>
              <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mt-8 max-w-xl">
                {[
                  { l: '作品数', v: userInfo.worksCount || 0 },
                  { l: '累计销量', v: userInfo.salesCount || 0 },
                  { l: '平均评分', v: (userInfo.avgRating || 0).toFixed(1) },
                  { l: '入驻时间', v: new Date(userInfo.created_at).toLocaleDateString().slice(5) },
                ].map((s, i) => (
                  <div key={i} className="text-center p-3 rounded-2xl bg-white/10 backdrop-blur">
                    <div className="text-2xl font-bold">{s.v}</div>
                    <div className="text-xs text-white/70 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 md:mt-6 flex md:flex-col gap-3">
              <button onClick={doContact} className="px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-xl flex items-center gap-2">
                💬 私信TA
              </button>
              <Link to="/search" className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl font-semibold hover:bg-white/30 transition-all text-center">
                浏览作品
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-16">
        <div className="card p-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">🎨 {userInfo.username} 的作品</h2>
              <p className="text-gray-500 mt-1">共 {works.length} 件已上架作品</p>
            </div>
          </div>

          {works.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4 opacity-40">📝</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">暂无已上架作品</h3>
              <p className="text-gray-500 text-sm">TA 的作品正在筹备中，敬请期待！</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map(w => <WorkCard key={w.id} work={{ ...w, seller_name: userInfo.username, seller_avatar: userInfo.avatar }} />)}
            </div>
          )}
        </div>
      </div>

      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl text-gray-900">发送私信</h3>
                <p className="text-sm text-gray-500 mt-1">给 {userInfo.username} 发送消息</p>
              </div>
              <button onClick={() => setShowContact(false)} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center">✕</button>
            </div>
            <div className="p-6">
              <textarea rows="6" value={msg} onChange={e => setMsg(e.target.value)}
                placeholder="您想对TA说些什么？可以咨询作品详情、定制服务等..." className="input-field resize-none" />
            </div>
            <div className="p-6 bg-gray-50 flex gap-3 justify-end">
              <button onClick={() => setShowContact(false)} className="btn-secondary">取消</button>
              <button onClick={sendMsg} className="btn-primary" disabled={!msg.trim()}>发送消息</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
