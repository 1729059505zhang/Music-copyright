import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const statusInfo = {
  pending: { label: '待支付', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  paid: { label: '待确认', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
  rejected: { label: '已退款', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { showToast, ToastContainer } = useToast();
  const [role, setRole] = useState('buyer');
  const [status, setStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: '' });
  const [showReview, setShowReview] = useState(null);

  const isDetailPage = !!params.orderNo;

  useEffect(() => {
    if (!user) { navigate('/login?redirect=' + encodeURIComponent(location.pathname)); return; }
    if (isDetailPage) {
      api.get(`/orders/${params.orderNo}`).then(d => {
        setDetail(d.order);
        if (d.review) { setReviewForm({ rating: d.review.rating, content: d.review.content || '' }); }
      }).catch(e => { showToast(e.message || '订单不存在', 'error'); navigate('/orders'); }).finally(() => setLoading(false));
    } else {
      api.get('/orders', { params: { status, role } }).then(setOrders).finally(() => setLoading(false));
    }
  }, [user, navigate, params.orderNo, status, role, isDetailPage]);

  const doPay = async (orderNo, price) => {
    if (!confirm(`确定支付 ¥${Number(price).toFixed(2)} 吗？`)) return;
    try {
      await api.post(`/orders/pay/${orderNo}`);
      showToast('支付成功！', 'success');
      setTimeout(() => { if (isDetailPage) location.reload(); else setStatus(x => x); api.get('/orders', { params: { status, role } }).then(setOrders); }, 500);
    } catch (e) { showToast(e.message || '支付失败', 'error'); }
  };

  const doConfirm = async (orderNo) => {
    try {
      await api.post(`/orders/confirm/${orderNo}`);
      showToast('已确认收货！', 'success');
      setTimeout(() => location.reload(), 500);
    } catch (e) { showToast(e.message, 'error'); }
  };

  const submitReview = async (orderNo) => {
    try {
      await api.post(`/orders/review/${orderNo}`, reviewForm);
      showToast('评价成功！', 'success');
      setShowReview(null);
      setTimeout(() => location.reload(), 500);
    } catch (e) { showToast(e.message, 'error'); }
  };

  if (!user) return null;

  if (isDetailPage) {
    if (loading || !detail) return <div className="max-w-4xl mx-auto p-8"><div className="skeleton h-96 rounded-2xl" /></div>;
    const s = statusInfo[detail.status] || statusInfo.pending;
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <ToastContainer />
        <Link to="/orders" className="text-sm text-gray-500 hover:text-primary-600 inline-flex items-center gap-1 mb-6">← 返回订单列表</Link>

        <div className="card p-8 mb-6 bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center text-2xl`}>
              {detail.status === 'completed' ? '✅' : detail.status === 'paid' ? '📦' : detail.status === 'pending' ? '💳' : '❌'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
                <span className={`badge ${s.color} !text-sm !px-3 !py-1`}>{s.label}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">订单号：{detail.order_no}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-6 pb-6 border-b border-gray-100">
            {[
              ['提交订单', detail.created_at, true],
              ['支付成功', detail.payment_time, !!detail.payment_time],
              ['确认收货', detail.delivery_time, !!detail.delivery_time],
              ['交易完成', detail.delivery_time, detail.status === 'completed'],
            ].map(([l, t, ok], i) => (
              <div key={i} className="text-center">
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 text-sm font-bold ${ok ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{ok ? '✓' : i + 1}</div>
                <div className={`text-xs font-medium ${ok ? 'text-gray-900' : 'text-gray-400'}`}>{l}</div>
                <div className="text-[11px] text-gray-400 mt-1">{t ? new Date(t).toLocaleString() : '---'}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <Link to={`/works/${detail.work_real_id}`} className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
                {detail.work_cover ? <img src={detail.work_cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/works/${detail.work_real_id}`} className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">{detail.work_title}</Link>
                <div className="text-sm text-gray-500 mt-1.5">{detail.category_name || ''} · {detail.work_type}</div>
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-2">{detail.status === 'completed' || detail.status === 'paid' ? '📜 完整作品内容' : '🎵 内容预览'}</div>
                  <div className="lyric-line text-sm text-gray-700 whitespace-pre-line max-h-48 overflow-auto">{detail.status === 'completed' || detail.status === 'paid' ? detail.content : (detail.work_preview || detail.content?.split('\n').slice(0, 10).join('\n'))}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold gradient-text">¥{Number(detail.price).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="p-5 bg-blue-50 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">🛒 买家信息</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">用户</span><span className="font-medium text-gray-900">{detail.buyer_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">邮箱</span><span className="font-medium text-gray-900">{detail.buyer_email}</span></div>
              </div>
            </div>
            <div className="p-5 bg-primary-50 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">🎨 卖家信息</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">创作者</span><span className="font-medium text-gray-900">{detail.seller_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">邮箱</span><span className="font-medium text-gray-900">{detail.seller_email}</span></div>
                <Link to={`/messages?other=${detail.seller_id}`} className="flex justify-between w-full mt-2 pt-2 border-t border-primary-100 text-primary-600 hover:text-primary-700">
                  <span>💬 联系卖家</span><span>→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3 justify-end">
            {detail.status === 'pending' && <button onClick={() => doPay(detail.order_no, detail.price)} className="btn-primary !px-8">立即支付</button>}
            {detail.status === 'paid' && role === 'buyer' && <button onClick={() => doConfirm(detail.order_no)} className="btn-primary !px-8">确认收货</button>}
            {detail.status === 'completed' && !detail.review_id && role === 'buyer' && <button onClick={() => setShowReview(detail.order_no)} className="btn-secondary !px-8">去评价</button>}
            {detail.review && (
              <div className="w-full bg-yellow-50 rounded-xl p-4 border border-yellow-100 mt-3">
                <div className="font-medium text-sm text-gray-900 mb-2">我的评价：</div>
                <div className="flex items-center gap-2 mb-1">
                  {[1,2,3,4,5].map(i => <span key={i} className={i <= reviewForm.rating ? 'star-filled' : 'star-empty'}>★</span>)}
                </div>
                <p className="text-sm text-gray-600">{reviewForm.content || '（无文字评价）'}</p>
              </div>
            )}
          </div>
        </div>

        {showReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-xl">发表评价</h3>
                <button onClick={() => setShowReview(null)} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center">✕</button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-3">评分</div>
                  <div className="flex gap-2 justify-center">
                    {[1,2,3,4,5].map(i => (
                      <button key={i} onClick={() => setReviewForm(f => ({ ...f, rating: i }))} className={`text-5xl transition-all ${i <= reviewForm.rating ? 'scale-110' : ''}`}>
                        <span className={i <= reviewForm.rating ? 'star-filled' : 'star-empty'}>★</span>
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-2">
                    {['差评', '一般', '还行', '满意', '超赞'][reviewForm.rating - 1]}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">评价内容</div>
                  <textarea value={reviewForm.content} onChange={e => setReviewForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="分享您的购买体验，给其他买家参考（选填）" className="input-field h-32 resize-none" />
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex gap-3">
                <button onClick={() => setShowReview(null)} className="btn-secondary flex-1">取消</button>
                <button onClick={() => submitReview(showReview)} className="btn-primary flex-1">提交评价</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Order list
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📦 我的订单</h1>

      <div className="card overflow-hidden mb-6">
        <div className="flex border-b border-gray-100">
          {['buyer', 'seller'].map(r => (
            <button key={r} onClick={() => { setRole(r); setStatus('all'); }} className={`px-6 py-4 font-medium transition-all border-b-2 ${role === r ? 'text-primary-600 border-primary-500 bg-primary-50/50' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
              {r === 'buyer' ? '🛒 我买到的' : '🎨 我卖出的'}
            </button>
          ))}
          <div className="flex-1" />
          <div className="flex">
            {[['all', '全部'], ['pending', '待支付'], ['paid', '待确认'], ['completed', '已完成']].map(([v, l]) => (
              <button key={v} onClick={() => setStatus(v)} className={`px-4 py-4 text-sm font-medium transition-all border-b-2 ${status === v ? 'text-gray-900 border-gray-900' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-xl" />)}</div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">暂无订单</h3>
            <Link to="/search" className="text-primary-600 font-medium hover:underline">去看看作品 →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map(o => {
              const s = statusInfo[o.status] || statusInfo.pending;
              return (
                <div key={o.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50 text-sm">
                    <div className="flex items-center gap-5 text-gray-500">
                      <span>下单时间：{new Date(o.created_at).toLocaleString()}</span>
                      <span>订单号：{o.order_no}</span>
                    </div>
                    <span className={`badge ${s.color} !text-sm !px-3 !py-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-2 inline-block animate-pulse`} />{s.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link to={`/works/${o.work_id}`} className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      {o.work_cover ? <img src={o.work_cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🎵</div>}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/works/${o.work_id}`} className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">{o.work_title}</Link>
                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-3">
                        {role === 'buyer' ? (
                          <span className="flex items-center gap-1">卖家：{o.seller_name}</span>
                        ) : (
                          <span className="flex items-center gap-1">买家：{o.buyer_name}</span>
                        )}
                        <span>·</span>
                        <span>{o.work_type}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-xl font-bold text-music-600">¥{Number(o.price).toFixed(2)}</div>
                      <div className="flex flex-wrap gap-2 justify-end mt-3">
                        <Link to={`/orders/${o.order_no}`} className="btn-secondary !py-1.5 !px-3 text-xs">详情</Link>
                        {o.status === 'pending' && role === 'buyer' && <button onClick={() => doPay(o.order_no, o.price)} className="btn-primary !py-1.5 !px-3 text-xs">立即支付</button>}
                        {o.status === 'paid' && role === 'buyer' && <button onClick={() => doConfirm(o.order_no)} className="btn-primary !py-1.5 !px-3 text-xs">确认收货</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
