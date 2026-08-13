import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [works, setWorks] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [worksPage, setWorksPage] = useState(1);
  const [worksTotal, setWorksTotal] = useState(0);
  const [worksFilter, setWorksFilter] = useState('pending');

  useEffect(() => {
    if (!user) { navigate('/login?redirect=' + encodeURIComponent('/admin')); return; }
    if (user.role !== 'admin') { showToast('无权访问', 'error'); navigate('/'); return; }
    loadAll();
    // eslint-disable-next-line
  }, [user, navigate]);

  useEffect(() => {
    if (tab === 'works') loadWorks();
    if (tab === 'users') loadUsers();
    if (tab === 'orders') loadOrders();
    // eslint-disable-next-line
  }, [tab, worksPage, worksFilter]);

  const loadAll = () => {
    setLoading(true);
    api.get('/admin/stats').then(d => {
      setStats(d);
      setWorks(d.topWorks || []);
    }).finally(() => setLoading(false));
  };

  const loadWorks = () => {
    api.get('/admin/works', { params: { page: worksPage, pageSize: 15, status: worksFilter } }).then(d => {
      setWorks(d.list); setWorksTotal(d.total);
    });
  };

  const loadUsers = () => {
    api.get('/admin/users', { params: { pageSize: 20 } }).then(d => setUsers(d.list));
  };

  const loadOrders = () => {
    api.get('/admin/orders', { params: { pageSize: 20 } }).then(d => setOrders(d.list));
  };

  const auditWork = (id, status) => {
    if (status === 'rejected' && !confirm('确定拒绝此作品？')) return;
    api.put(`/admin/works/${id}/audit`, { status }).then(() => {
      showToast(status === 'approved' ? '已通过审核' : '已拒绝', 'success');
      loadWorks(); loadAll();
    }).catch(e => showToast(e.message, 'error'));
  };

  const updateUser = (id, field, val) => {
    api.put(`/admin/users/${id}`, { [field]: val }).then(() => {
      showToast('更新成功', 'success');
      loadUsers();
    }).catch(e => showToast(e.message, 'error'));
  };

  const tabs = [
    ['dashboard', '📊 数据概览'],
    ['works', '📝 作品审核'],
    ['users', '👥 用户管理'],
    ['orders', '📦 订单管理'],
  ];

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-100 animate-fade-in">
      <ToastContainer />
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-music-500 flex items-center justify-center text-xl">⚙️</div>
            <div>
              <div className="font-bold">平台管理后台</div>
              <div className="text-xs text-gray-400">Admin Dashboard</div>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">欢迎，{user.username}</span>
            <Link to="/" className="text-gray-300 hover:text-white">← 返回前台</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <aside className="md:col-span-1">
            <div className="card p-3 space-y-1 sticky top-24">
              {tabs.map(([v, l]) => (
                <button key={v} onClick={() => setTab(v)} className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  tab === v ? 'bg-gradient-to-r from-primary-500 to-music-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  {l}
                </button>
              ))}
            </div>
          </aside>

          <main className="md:col-span-4">
            {loading ? <div className="card p-8"><div className="skeleton h-80 rounded-xl" /></div> :
              tab === 'dashboard' && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { l: '用户总数', v: stats.totalUsers, i: '👥', bg: 'from-blue-500 to-cyan-500' },
                      { l: '作品总数', v: `${stats.approvedWorks}/${stats.totalWorks}`, i: '📚', bg: 'from-green-500 to-emerald-500' },
                      { l: '待审核', v: stats.pendingWorks, i: '⏳', bg: 'from-yellow-500 to-music-500' },
                      { l: '总交易额', v: `¥${Number(stats.totalSales).toFixed(0)}`, i: '💰', bg: 'from-primary-500 to-music-600' },
                    ].map((s, i) => (
                      <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br ${s.bg} text-white shadow-lg`}>
                        <div className="text-3xl mb-3">{s.i}</div>
                        <div className="text-white/80 text-sm">{s.l}</div>
                        <div className="text-2xl font-bold mt-1">{s.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="card p-6 col-span-2">
                      <h3 className="font-semibold text-gray-900 mb-5">📦 最近订单</h3>
                      <div className="space-y-3">
                        {stats.recentOrders.map(o => (
                          <div key={o.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="text-sm font-mono text-gray-400">{o.order_no?.slice(-10)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">{o.work_title}</div>
                              <div className="text-xs text-gray-500">{o.buyer_name} → {o.seller_name}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-music-600">¥{Number(o.price).toFixed(0)}</div>
                              <div className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card p-6">
                      <h3 className="font-semibold text-gray-900 mb-5">🏆 热销作品 TOP5</h3>
                      <div className="space-y-4">
                        {stats.topWorks.map((w, i) => (
                          <div key={w.id} className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-music-500 text-white' : i === 1 ? 'bg-gray-400 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">{w.title}</div>
                              <div className="text-xs text-gray-500">{w.seller_name}</div>
                            </div>
                            <div className="text-xs font-semibold text-primary-600">{w.sales}件</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-5">🌟 优秀创作者排行</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="text-sm text-gray-500 bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium">排名</th>
                            <th className="px-4 py-3 text-left font-medium">创作者</th>
                            <th className="px-4 py-3 text-center font-medium">作品数</th>
                            <th className="px-4 py-3 text-center font-medium">总销量</th>
                            <th className="px-4 py-3 text-right font-medium">总收益</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {stats.topSellers.map((s, i) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3"><span className={`inline-flex w-7 h-7 items-center justify-center rounded-lg text-xs font-bold ${i === 0 ? 'bg-music-100 text-music-600' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-500'}`}>{i + 1}</span></td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <img src={s.avatar} alt="" className="w-8 h-8 rounded-full" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">{s.username}{s.is_verified && <span className="w-4 h-4 bg-green-500 text-white rounded-full text-[10px] flex items-center justify-center">✓</span>}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-gray-600">{s.works_count}</td>
                              <td className="px-4 py-3 text-center text-sm text-gray-600">{s.total_sales}</td>
                              <td className="px-4 py-3 text-right text-sm font-semibold text-music-600">¥{Number(s.total_earn).toFixed(0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            {tab === 'works' && (
              <div className="card p-6">
                <div className="flex flex-wrap items-center gap-3 justify-between mb-6">
                  <h2 className="font-semibold text-lg text-gray-900">📝 作品审核 <span className="text-sm font-normal text-gray-400 ml-2">共 {worksTotal} 件</span></h2>
                  <div className="flex gap-2">
                    {[['pending', '⏳ 待审核'], ['approved', '✅ 已通过'], ['rejected', '❌ 已拒绝'], ['all', '📋 全部']].map(([v, l]) => (
                      <button key={v} onClick={() => { setWorksFilter(v); setWorksPage(1); setTimeout(loadWorks, 10); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${worksFilter === v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-sm text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">作品</th>
                        <th className="px-4 py-3 text-left font-medium">卖家</th>
                        <th className="px-4 py-3 text-left font-medium">分类</th>
                        <th className="px-4 py-3 text-left font-medium">价格</th>
                        <th className="px-4 py-3 text-left font-medium">数据</th>
                        <th className="px-4 py-3 text-center font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {works.map(w => (
                        <tr key={w.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {w.cover_image ? <img src={w.cover_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🎵</div>}
                              </div>
                              <div className="min-w-0">
                                <Link to={`/works/${w.id}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-1 max-w-xs">{w.title}</Link>
                                <div className="text-xs text-gray-400 mt-0.5">{new Date(w.created_at).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm"><Link to={`/users/${w.seller_id}`} className="text-gray-700 hover:text-primary-600">{w.seller_name}</Link></td>
                          <td className="px-4 py-4 text-sm text-gray-600">{w.category_name || '-'}</td>
                          <td className="px-4 py-4 text-sm font-semibold text-music-600">¥{Number(w.price).toFixed(2)}</td>
                          <td className="px-4 py-4 text-xs text-gray-500">👁{w.views} 💸{w.sales}</td>
                          <td className="px-4 py-4 text-center whitespace-nowrap space-x-2">
                            {w.status === 'pending' ? (
                              <>
                                <button onClick={() => auditWork(w.id, 'approved')} className="px-3 py-1.5 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 font-medium">通过</button>
                                <button onClick={() => auditWork(w.id, 'rejected')} className="px-3 py-1.5 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium">拒绝</button>
                              </>
                            ) : (
                              <span className={`badge ${w.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{w.status === 'approved' ? '已上架' : '已拒绝'}</span>
                            )}
                            <Link to={`/works/${w.id}`} className="text-xs text-primary-600 hover:underline">查看</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'users' && (
              <div className="card p-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-6">👥 用户管理</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-sm text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">用户</th>
                        <th className="px-4 py-3 text-left font-medium">角色</th>
                        <th className="px-4 py-3 text-left font-medium">认证</th>
                        <th className="px-4 py-3 text-left font-medium">余额</th>
                        <th className="px-4 py-3 text-left font-medium">注册时间</th>
                        <th className="px-4 py-3 text-right font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar} alt="" className="w-10 h-10 rounded-xl" />
                              <div>
                                <div className="font-medium text-gray-900">{u.username}</div>
                                <div className="text-xs text-gray-500">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <select defaultValue={u.role} onChange={e => updateUser(u.id, 'role', e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary-500 outline-none">
                              <option value="buyer">买家</option>
                              <option value="seller">卖家</option>
                              <option value="admin">管理员</option>
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <button onClick={() => updateUser(u.id, 'is_verified', u.is_verified ? 0 : 1)} className={`badge ${u.is_verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} cursor-pointer hover:opacity-80`}>
                              {u.is_verified ? '✓ 已认证' : '未认证'}
                            </button>
                          </td>
                          <td className="px-4 py-4 font-semibold text-music-600">¥{Number(u.balance || 0).toFixed(2)}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-4 text-right">
                            <button onClick={() => {
                              const amt = prompt('调整余额为（当前¥' + Number(u.balance || 0).toFixed(2) + '）：');
                              if (amt != null && !isNaN(parseFloat(amt))) updateUser(u.id, 'balance', amt);
                            }} className="text-xs text-primary-600 hover:underline">调余额</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div className="card p-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-6">📦 订单管理</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-sm text-gray-500">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">订单号</th>
                        <th className="px-4 py-3 text-left font-medium">作品</th>
                        <th className="px-4 py-3 text-left font-medium">买家</th>
                        <th className="px-4 py-3 text-left font-medium">卖家</th>
                        <th className="px-4 py-3 text-left font-medium">金额</th>
                        <th className="px-4 py-3 text-left font-medium">状态</th>
                        <th className="px-4 py-3 text-left font-medium">下单时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 font-mono text-xs text-gray-600">{o.order_no}</td>
                          <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">{o.work_title}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{o.buyer_name}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{o.seller_name}</td>
                          <td className="px-4 py-4 text-sm font-semibold text-music-600">¥{Number(o.price).toFixed(2)}</td>
                          <td className="px-4 py-4">
                            <span className={`badge ${
                              o.status === 'completed' ? 'bg-green-100 text-green-700' :
                              o.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                              o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {o.status === 'completed' ? '已完成' : o.status === 'paid' ? '待确认' : o.status === 'pending' ? '待支付' : '已取消'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
