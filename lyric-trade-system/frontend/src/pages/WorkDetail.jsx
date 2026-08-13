import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import WorkCard from '../components/WorkCard';

const typeLabels = { song: '完整歌曲', lyrics: '歌词', music: '纯音乐' };

export default function WorkDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [payMethod, setPayMethod] = useState('balance');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/works/${id}`).then(d => {
      setData(d);
      setIsFav(d.isFavorite);
      setInCart(d.isInCart);
    }).catch(err => {
      if (err.message && err.message.includes('不存在')) {
        showToast('作品不存在或已下架', 'error');
        navigate('/search');
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const toggleFav = () => {
    if (!user) { showToast('请先登录', 'warning'); navigate('/login?redirect=' + encodeURIComponent(location.pathname)); return; }
    api.post(`/works/favorite/${id}`).then(d => {
      setIsFav(d.isFavorite);
      showToast(d.message, 'success');
    }).catch(e => showToast(e.message, 'error'));
  };

  const toggleCart = () => {
    if (!user) { showToast('请先登录', 'warning'); navigate('/login?redirect=' + encodeURIComponent(location.pathname)); return; }
    if (data?.hasPurchased) { showToast('您已购买过该作品', 'info'); return; }
    api.post(`/works/cart/${id}`).then(d => {
      setInCart(d.isInCart);
      showToast(d.message, 'success');
    }).catch(e => showToast(e.message, 'error'));
  };

  const doBuy = async () => {
    if (!user) { navigate('/login?redirect=' + encodeURIComponent(location.pathname)); return; }
    if (data.hasPurchased) { showToast('您已购买过该作品', 'info'); return; }
    if (data.work.seller_id === user.id) { showToast('不能购买自己的作品', 'warning'); return; }
    setPurchasing(true);
    try {
      const order = await api.post('/orders/create', { work_id: id, payment_method: payMethod });
      await api.post(`/orders/pay/${order.order.order_no}`);
      showToast('购买成功！可在订单中查看', 'success');
      setShowBuy(false);
      setTimeout(() => navigate(`/orders/${order.order.order_no}`), 800);
    } catch (e) {
      showToast(e.message || '购买失败', 'error');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-80 w-full rounded-2xl" />
            <div className="space-y-3"><div className="skeleton h-8 w-2/3" /><div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-5/6" /></div>
          </div>
          <div><div className="card p-6 space-y-4"><div className="skeleton h-10 w-full" /><div className="skeleton h-12 w-full" /></div></div>
        </div>
      </div>
    );
  }

  const { work, reviews, related, sellerWorks, hasPurchased } = data;
  const stars = Math.round(work.rating || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <ToastContainer />

      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">首页</Link>
        <span>/</span>
        <Link to="/search" className="hover:text-primary-600">作品市场</Link>
        {work.category_name && (<><span>/</span><span>{work.category_icon} {work.category_name}</span></>)}
        <span>/</span><span className="text-gray-900 line-clamp-1">{work.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
              {work.cover_image ? (
                <img src={work.cover_image} alt={work.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[120px] opacity-30">🎼</div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="badge bg-primary-500 text-white">{typeLabels[work.type] || work.type}</span>
                {work.category_name && <span className="badge bg-black/50 text-white backdrop-blur">{work.category_icon} {work.category_name}</span>}
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{work.title}</h1>

            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">评分</span>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => <span key={i} className={`text-lg ${i <= stars ? 'star-filled' : 'star-empty'}`}>★</span>)}
                </div>
                <span className="font-semibold text-music-600">{(work.rating || 0).toFixed(1)}</span>
                <span className="text-xs text-gray-400">({reviews.length}条评价)</span>
              </div>
              <div className="h-5 w-px bg-gray-200" />
              <span className="text-sm text-gray-500">👁 浏览 <span className="font-medium text-gray-900">{work.views}</span></span>
              <div className="h-5 w-px bg-gray-200" />
              <span className="text-sm text-gray-500">💸 销量 <span className="font-medium text-gray-900">{work.sales}</span></span>
            </div>

            <div className="py-6 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">📝 作品介绍</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{work.description}</p>
            </div>

            {work.tags && (
              <div className="py-6 border-b border-gray-100">
                <h2 className="font-semibold text-sm text-gray-500 mb-3">🏷️ 标签</h2>
                <div className="flex flex-wrap gap-2">
                  {work.tags.split(',').map((t, i) => (
                    <Link key={i} to={`/search?keyword=${encodeURIComponent(t.trim())}`} className="px-3 py-1.5 bg-gray-100 hover:bg-primary-100 hover:text-primary-600 rounded-full text-sm text-gray-600 transition-colors">
                      #{t.trim()}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="py-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                {hasPurchased ? '📜 完整内容' : '🎵 内容预览'}
              </h2>
              <div className={`relative rounded-2xl p-6 ${hasPurchased ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
                {hasPurchased && (
                  <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 bg-green-500 text-white rounded-full text-xs font-medium">
                    ✅ 已解锁完整内容
                  </div>
                )}
                <div className="lyric-line font-medium text-gray-800 whitespace-pre-line">
                  {hasPurchased ? work.content : (work.preview || work.content.split('\n').slice(0, 12).join('\n'))}
                </div>
                {!hasPurchased && (
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 to-transparent flex items-end justify-center pb-4">
                    <div className="px-6 py-2 bg-gray-900/80 backdrop-blur text-white rounded-full text-sm font-medium">
                      🔒 购买后解锁完整内容
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hasPurchased && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div className="text-sm text-blue-900">
                  <div className="font-medium mb-1">温馨提示</div>
                  <div className="text-blue-700">您已成功购买此作品，可前往 <Link to="/orders" className="underline font-medium">我的订单</Link> 查看交易详情和下载凭证。本作品版权归您所有，使用时请遵守平台版权协议。</div>
                </div>
              </div>
            )}
          </div>

          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg text-gray-900">💬 用户评价 <span className="text-gray-400 text-sm font-normal ml-2">({reviews.length})</span></h2>
            </div>
            {reviews.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <div className="text-5xl mb-3">🌟</div>
                <p>暂无评价，成为第一个评价的人吧</p>
              </div>
            ) : (
              <div className="space-y-5">
                {reviews.map(r => (
                  <div key={r.id} className="pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <img src={r.buyer_avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-gray-900">{r.buyer_name}</span>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(i => <span key={i} className={i <= r.rating ? 'star-filled text-sm' : 'star-empty text-sm'}>★</span>)}
                          </div>
                          <span className="text-xs text-gray-400 ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{r.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {sellerWorks.length > 0 && (
            <div className="card p-8">
              <h2 className="font-semibold text-lg text-gray-900 mb-6">🎨 {work.seller_name} 的其他作品</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {sellerWorks.map(w => <WorkCard key={w.id} work={{ ...w, seller_name: work.seller_name, seller_avatar: work.seller_avatar }} compact />)}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6 sticky top-24">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-sm text-gray-400">¥</span>
              <span className="text-4xl font-bold gradient-text">{Number(work.price).toFixed(2)}</span>
            </div>
            <div className="flex gap-2 text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <span>💳 平台担保交易</span>
              <span>·</span>
              <span>⚡ 支付秒发货</span>
            </div>

            <Link to={`/users/${work.seller_id}`} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors mb-5">
              <img src={work.seller_avatar} alt="" className="w-12 h-12 rounded-full border-2 border-white shadow" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 flex items-center gap-1.5">
                  {work.seller_name}
                  {work.seller_verified && <span className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>}
                </div>
                <div className="text-xs text-gray-500 line-clamp-1">{work.seller_bio || '才华横溢的创作人'}</div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>

            <div className="space-y-3">
              {hasPurchased ? (
                <Link to="/orders" className="btn-primary w-full flex items-center justify-center gap-2">
                  ✅ 已购买，查看订单
                </Link>
              ) : user && user.id === work.seller_id ? (
                <Link to={`/seller/works?edit=${work.id}`} className="btn-secondary w-full flex items-center justify-center gap-2">
                  ✏️ 这是您的作品
                </Link>
              ) : (
                <>
                  <button onClick={() => setShowBuy(true)} className="btn-primary w-full flex items-center justify-center gap-2 text-lg">
                    🛒 立即购买
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={toggleCart} className={`btn-secondary !py-3 flex items-center justify-center gap-2 ${inCart ? '!bg-primary-50 !text-primary-600 !border-primary-200' : ''}`}>
                      {inCart ? '✅ 已加车' : '➕ 加购物车'}
                    </button>
                    <button onClick={toggleFav} className={`btn-secondary !py-3 flex items-center justify-center gap-2 ${isFav ? '!bg-red-50 !text-red-600 !border-red-200' : ''}`}>
                      {isFav ? '❤️ 已收藏' : '🤍 收藏'}
                    </button>
                  </div>
                </>
              )}

              <Link to={user ? `/messages?other=${work.seller_id}` : '/login'} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                💬 咨询卖家
              </Link>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5 text-xs text-gray-500">
              <div className="flex items-center gap-2"><span>🔐</span> 平台担保交易，满意再放款</div>
              <div className="flex items-center gap-2"><span>📜</span> 交易完成自动生成版权合同</div>
              <div className="flex items-center gap-2"><span>🎯</span> 不满意7天内可申请退款</div>
              <div className="flex items-center gap-2"><span>🤝</span> 专属客服全程协助</div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">🤝 相关推荐</h3>
              <div className="space-y-4">
                {related.map(w => (
                  <Link key={w.id} to={`/works/${w.id}`} className="flex gap-3 group">
                    <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      {w.cover_image ? <img src={w.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎵</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-primary-600">{w.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{w.seller_name}</div>
                      <div className="text-music-600 font-semibold mt-1">¥{Number(w.price).toFixed(0)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showBuy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-900">确认购买</h3>
              <button onClick={() => setShowBuy(false)} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                  {work.cover_image ? <img src={work.cover_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-200">🎵</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 line-clamp-1">{work.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{work.seller_name} · {typeLabels[work.type]}</div>
                  <div className="mt-2 text-2xl font-bold text-music-600">¥{Number(work.price).toFixed(2)}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-3">选择支付方式</div>
                <div className="space-y-2">
                  {[
                    ['balance', '💳 余额支付', `当前余额: ¥${Number(user?.balance || 0).toFixed(2)}`, user?.balance >= work.price],
                    ['alipay', '🔵 支付宝', '推荐使用', true],
                    ['wechat', '🟢 微信支付', '亿万用户的选择', true],
                  ].map(([v, t, d, ok]) => (
                    <label key={v} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === v ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input type="radio" name="pay" checked={payMethod === v} onChange={() => setPayMethod(v)} className="w-5 h-5 text-primary-600" />
                      <div className="flex-1">
                        <div className={`font-medium ${payMethod === v ? 'text-primary-600' : 'text-gray-900'}`}>{t}</div>
                        <div className="text-xs text-gray-500">{d}</div>
                      </div>
                      {v === 'balance' && !ok && <span className="text-xs text-red-500 font-medium">余额不足</span>}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={() => setShowBuy(false)} className="btn-secondary flex-1">取消</button>
              <button onClick={doBuy} disabled={purchasing} className="btn-primary flex-1 disabled:opacity-60">
                {purchasing ? '处理中...' : `支付 ¥${Number(work.price).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
