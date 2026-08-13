import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Profile() {
  const { user, updateUser, fetchMe } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [tab, setTab] = useState('info');
  const [form, setForm] = useState({ bio: '', avatar: '' });
  const [pwd, setPwd] = useState({ old: '', n: '', confirm: '' });
  const [recharge, setRecharge] = useState('');
  const [stats, setStats] = useState(null);
  const [activeMenu, setActiveMenu] = useState('info');

  useEffect(() => {
    if (!user) { navigate('/login?redirect=' + encodeURIComponent('/profile')); return; }
    setForm({ bio: user.bio || '', avatar: user.avatar || '' });
    api.get(`/users/${user.id}`).then(d => setStats(d));
  }, [user, navigate]);

  if (!user) return null;

  const saveProfile = async () => {
    try {
      const u = await api.put('/users/profile', form);
      updateUser(u);
      showToast('资料更新成功', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const changePwd = async () => {
    if (pwd.n.length < 6) { showToast('新密码至少6位', 'warning'); return; }
    if (pwd.n !== pwd.confirm) { showToast('两次密码不一致', 'warning'); return; }
    try {
      await api.put('/users/password', { oldPassword: pwd.old, newPassword: pwd.n });
      showToast('密码修改成功', 'success');
      setPwd({ old: '', n: '', confirm: '' });
    } catch (e) { showToast(e.message, 'error'); }
  };

  const doRecharge = async () => {
    const amt = parseFloat(recharge);
    if (!amt || amt <= 0) { showToast('请输入有效金额', 'warning'); return; }
    if (!confirm(`确定充值 ¥${amt.toFixed(2)} 吗？`)) return;
    try {
      const r = await api.post('/users/recharge', { amount: amt });
      updateUser(r.user);
      fetchMe();
      showToast(r.message, 'success');
      setRecharge('');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const menuItems = [
    { id: 'info', icon: '👤', label: '基本资料' },
    { id: 'security', icon: '🔐', label: '安全设置' },
    { id: 'wallet', icon: '💰', label: '我的钱包' },
    { id: 'orders', icon: '📦', label: '我的订单' },
    { id: 'favorites', icon: '❤️', label: '我的收藏' },
    { id: 'seller', icon: '🎨', label: '创作中心' },
    { id: 'admin', icon: '⚙️', label: '管理后台', show: user.role === 'admin' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="card p-6 text-center mb-6 bg-gradient-to-br from-primary-500/5 to-music-500/5 border-primary-100">
            <img src={user.avatar} alt="" className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-xl" />
            <h3 className="font-bold text-lg text-gray-900 mt-4 flex items-center justify-center gap-1.5">
              {user.username}
              {user.is_verified && <span className="w-5 h-5 bg-green-500 text-white rounded-full text-xs flex items-center justify-center">✓</span>}
            </h3>
            <span className={`badge mt-2 ${user.role === 'admin' ? 'bg-music-100 text-music-700' : user.role === 'seller' ? 'bg-primary-100 text-primary-700' : 'bg-blue-100 text-blue-700'}`}>
              {user.role === 'admin' ? '平台管理员' : user.role === 'seller' ? '认证创作者' : '普通会员'}
            </span>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="text-xs text-gray-500">账户余额</div>
              <div className="text-3xl font-bold gradient-text mt-1">¥{Number(user.balance || 0).toFixed(2)}</div>
            </div>
          </div>

          <nav className="card p-3 space-y-1">
            {menuItems.filter(m => m.show !== false).map(m => (
              <button key={m.id} onClick={() => {
                if (m.id === 'orders') navigate('/orders');
                else if (m.id === 'favorites') navigate('/favorites');
                else if (m.id === 'seller') navigate(user.role === 'seller' || user.role === 'admin' ? '/seller/works' : '/register?role=seller');
                else if (m.id === 'admin') navigate('/admin');
                else setActiveMenu(m.id);
              }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                (activeMenu === m.id || (m.id === 'orders' && location.pathname.includes('/orders')))
                  ? 'bg-gradient-to-r from-primary-500 to-music-500 text-white shadow-lg shadow-primary-500/30'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>
                <span className="text-lg">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="md:col-span-3">
          <div className="card p-8">
            {activeMenu === 'info' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">👤 基本资料</h2>
                <div className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">头像</label>
                    <div className="flex items-center gap-4">
                      <img src={form.avatar || user.avatar} alt="" className="w-20 h-20 rounded-2xl border-4 border-gray-100" />
                      <div>
                        <input value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
                          placeholder="头像URL（DiceBear 自动生成）" className="input-field !py-2 text-sm" />
                        <p className="text-xs text-gray-400 mt-1">留空则使用默认头像</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                      <input defaultValue={user.username} className="input-field !py-3 bg-gray-50" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                      <input defaultValue={user.email} className="input-field !py-3 bg-gray-50" readOnly />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows="4"
                      placeholder="介绍一下您自己，让别人更了解你..." className="input-field resize-none" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={saveProfile} className="btn-primary !px-8">保存修改</button>
                    <button onClick={() => setForm({ bio: user.bio || '', avatar: user.avatar || '' })} className="btn-secondary !px-8">重置</button>
                  </div>
                </div>
              </>
            )}

            {activeMenu === 'security' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">🔐 安全设置</h2>
                <div className="max-w-xl space-y-6">
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">登录密码</div>
                      <span className="badge bg-green-100 text-green-700 text-xs">已设置</span>
                    </div>
                    <p className="text-sm text-gray-500">定期更换密码可以有效保护账户安全</p>
                  </div>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">原密码</label>
                      <input type="password" value={pwd.old} onChange={e => setPwd(p => ({ ...p, old: e.target.value }))} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                      <input type="password" value={pwd.n} onChange={e => setPwd(p => ({ ...p, n: e.target.value }))} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                      <input type="password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} className="input-field" /></div>
                    <button onClick={changePwd} className="btn-primary !px-8">修改密码</button>
                  </div>
                </div>
              </>
            )}

            {activeMenu === 'wallet' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">💰 我的钱包</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500 to-music-500 text-white">
                    <div className="text-white/80 text-sm">账户余额</div>
                    <div className="text-4xl font-bold mt-2">¥{Number(user.balance || 0).toFixed(2)}</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    <div className="text-white/80 text-sm">发布作品</div>
                    <div className="text-4xl font-bold mt-2">{stats?.worksCount || 0}</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                    <div className="text-white/80 text-sm">累计销量</div>
                    <div className="text-4xl font-bold mt-2">{stats?.salesCount || 0}</div>
                  </div>
                </div>

                <div className="card !bg-white border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-5">💳 账户充值</h3>
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {[50, 100, 500, 1000].map(a => (
                      <button key={a} onClick={() => setRecharge(String(a))} className={`p-4 rounded-xl border-2 text-center transition-all ${recharge == a ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className={`text-2xl font-bold ${recharge == a ? 'text-primary-600' : 'text-gray-900'}`}>¥{a}</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input type="number" value={recharge} onChange={e => setRecharge(e.target.value)} placeholder="自定义金额" className="input-field flex-1" />
                    <button onClick={doRecharge} className="btn-primary !px-10">立即充值</button>
                  </div>
                  <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700 flex items-start gap-2">
                    <span>💡</span>
                    <div>充值金额可用于购买平台作品。使用余额支付无需跳转第三方，支付更便捷！平台承诺充值金额随时可用于消费，余额交易买家可享更多优惠。</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
