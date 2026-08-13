import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login?redirect=' + encodeURIComponent('/cart')); return; }
    api.get('/works/my/cart').then(d => {
      setItems(d);
      const sel = {}; d.forEach(x => sel[x.cart_id] = true); setSelected(sel);
    }).finally(() => setLoading(false));
  }, [user, navigate]);

  const toggleSel = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const selAll = () => {
    if (Object.values(selected).every(Boolean) && items.length) {
      const s = {}; items.forEach(x => s[x.cart_id] = false); setSelected(s);
    } else {
      const s = {}; items.forEach(x => s[x.cart_id] = true); setSelected(s);
    }
  };

  const selectedItems = items.filter(i => selected[i.cart_id]);
  const total = selectedItems.reduce((s, i) => s + Number(i.price), 0);

  const removeItem = (cartId) => {
    api.delete(`/works/cart/${cartId}`).then(() => {
      setItems(items.filter(i => i.cart_id !== cartId));
      showToast('已移除', 'success');
    });
  };

  const checkout = async () => {
    if (selectedItems.length === 0) { showToast('请选择要结算的作品', 'warning'); return; }
    setCheckingOut(true);
    try {
      // 为了简化，这里逐单创建并支付
      const results = [];
      for (const it of selectedItems) {
        try {
          const order = await api.post('/orders/create', { work_id: it.id, payment_method: 'balance' });
          await api.post(`/orders/pay/${order.order.order_no}`);
          results.push(order.order.order_no);
        } catch (e) {
          showToast(`${it.title}: ${e.message}`, 'error');
        }
      }
      if (results.length) {
        showToast(`已成功购买 ${results.length} 件作品！`, 'success');
        setTimeout(() => navigate('/orders'), 800);
      }
    } finally { setCheckingOut(false); }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🛒 购物车</h1>

      {loading ? (
        <div className="card p-8 space-y-4">
          {[1,2,3].map(i => <div key={i} className="flex items-center gap-4"><div className="skeleton w-24 h-24 rounded-xl" /><div className="flex-1 space-y-2"><div className="skeleton h-5 w-1/2" /><div className="skeleton h-4 w-1/3" /><div className="skeleton h-6 w-20" /></div></div>)}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h3 className="font-semibold text-xl text-gray-900 mb-2">购物车是空的</h3>
          <p className="text-gray-500 mb-6">快去挑几件心仪的作品吧！</p>
          <Link to="/search" className="btn-primary inline-block">去逛逛 →</Link>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden mb-6">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-sm font-medium text-gray-500 border-b">
              <div className="col-span-1"><label className="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4" checked={items.length > 0 && Object.values(selected).every(Boolean)} onChange={selAll} /> 全选</label></div>
              <div className="col-span-6">作品信息</div>
              <div className="col-span-2 text-center">单价</div>
              <div className="col-span-2 text-center">操作</div>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map(it => (
                <div key={it.cart_id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-1">
                    <input type="checkbox" className="w-4 h-4" checked={!!selected[it.cart_id]} onChange={() => toggleSel(it.cart_id)} />
                  </div>
                  <div className="col-span-6 flex items-center gap-4 min-w-0">
                    <Link to={`/works/${it.id}`} className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      {it.cover_image ? <img src={it.cover_image} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🎵</div>}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/works/${it.id}`} className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">{it.title}</Link>
                      <div className="text-xs text-gray-500 mt-1.5 flex items-center gap-3">
                        <span className="flex items-center gap-1"><img src={it.seller_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=seller`} className="w-4 h-4 rounded-full" alt="" />{it.seller_name}</span>
                        {it.category_name && <span className="badge bg-gray-100 text-gray-600">{it.category_icon} {it.category_name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xl font-bold text-music-600">¥{Number(it.price).toFixed(2)}</span>
                  </div>
                  <div className="col-span-2 text-center space-x-2">
                    <Link to={`/works/${it.id}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">查看</Link>
                    <button onClick={() => removeItem(it.cart_id)} className="text-sm text-red-500 hover:text-red-600 font-medium">移除</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-4 card p-5 flex flex-wrap items-center gap-4 justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" className="w-4 h-4" checked={items.length > 0 && Object.values(selected).every(Boolean)} onChange={selAll} /> 全选
              </label>
              <span className="text-sm text-gray-500">已选 <span className="text-primary-600 font-semibold">{selectedItems.length}</span> 件</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-gray-500 text-sm">合计：</span>
                <span className="text-3xl font-bold gradient-text ml-2">¥{total.toFixed(2)}</span>
              </div>
              <button onClick={checkout} disabled={checkingOut || selectedItems.length === 0} className="btn-primary !px-10 !py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {checkingOut ? '结算中...' : '立即结算'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
