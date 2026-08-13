import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const statusLabels = {
  pending: { label: '待审核', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: '已上架', color: 'bg-green-100 text-green-700' },
  rejected: { label: '未通过', color: 'bg-red-100 text-red-700' },
};

export default function SellerWorks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { showToast, ToastContainer } = useToast();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', type: 'song', category_id: '', description: '',
    content: '', preview: '', price: '', tags: '', cover_image: ''
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get('/works', { params: { seller_id: user.id, pageSize: 100, status: 'all' } }),
      api.get('/categories'),
    ]).then(([worksData, cats]) => {
      setWorks(worksData.list);
      setCategories(cats);
      const editId = params.get('edit');
      if (editId) {
        const w = worksData.list.find(x => x.id == editId);
        if (w) {
          setEditing(w.id);
          setForm({
            title: w.title, type: w.type, category_id: w.category_id || '',
            description: w.description, content: w.content, preview: w.preview || '',
            price: w.price, tags: w.tags || '', cover_image: w.cover_image || ''
          });
          setShowForm(true);
        }
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) { navigate('/login?redirect=' + encodeURIComponent('/seller/works')); return; }
    if (user.role !== 'seller' && user.role !== 'admin') { showToast('您还不是创作者，请先申请', 'warning'); navigate('/register?role=seller'); return; }
    loadData();
    // eslint-disable-next-line
  }, [user, navigate]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', type: 'song', category_id: categories[0]?.id || '', description: '', content: '', preview: '', price: '', tags: '', cover_image: '' });
    setShowForm(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!form.title || !form.type || !form.description || !form.content || !form.price) {
      showToast('请填写必填项：标题、类型、描述、完整内容、价格', 'warning'); return;
    }
    try {
      if (editing) {
        await api.put(`/works/${editing}`, form);
        showToast('作品更新成功，等待重新审核', 'success');
      } else {
        await api.post('/works', form);
        showToast('作品提交成功，等待审核', 'success');
      }
      setShowForm(false);
      setTimeout(loadData, 500);
    } catch (e) { showToast(e.message, 'error'); }
  };

  const delWork = (id) => {
    if (!confirm('确定删除此作品吗？')) return;
    api.delete(`/works/${id}`).then(() => { showToast('删除成功', 'success'); loadData(); });
  };

  if (!user) return null;

  // Stats
  const approved = works.filter(w => w.status === 'approved');
  const totalSales = approved.reduce((s, w) => s + Number(w.price) * (w.sales || 0), 0);
  const totalViews = works.reduce((s, w) => s + (w.views || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <ToastContainer />

      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">🎨 创作中心</h1>
          <p className="text-gray-500 mt-1">管理您的作品，查看销售数据</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 !px-6">
          <span className="text-lg">+</span> 发布新作品
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: '作品总数', val: works.length, icon: '📚', bg: 'from-blue-500 to-cyan-500' },
          { label: '已上架', val: approved.length, icon: '✅', bg: 'from-green-500 to-emerald-500' },
          { label: '销售额', val: `¥${totalSales.toFixed(0)}`, icon: '💰', bg: 'from-primary-500 to-music-500' },
          { label: '浏览量', val: totalViews.toLocaleString(), icon: '👁', bg: 'from-purple-500 to-pink-500' },
        ].map((s, i) => (
          <div key={i} className={`card p-5 bg-gradient-to-br ${s.bg} text-white border-0`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-white/80 text-sm">{s.label}</div>
                <div className="text-3xl font-bold mt-2">{s.val}</div>
              </div>
              <div className="text-3xl opacity-80">{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">我的作品</h2>
          <span className="text-sm text-gray-500">共 {works.length} 件作品</span>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
        ) : works.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">还没有发布任何作品</h3>
            <p className="text-gray-500 mb-6">点击上方"发布新作品"开始创作吧！</p>
            <button onClick={openNew} className="btn-primary inline-flex items-center gap-2">+ 发布第一件作品</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">作品</th>
                  <th className="px-6 py-4 text-left font-medium">分类</th>
                  <th className="px-6 py-4 text-left font-medium">价格</th>
                  <th className="px-6 py-4 text-center font-medium">浏览</th>
                  <th className="px-6 py-4 text-center font-medium">销量</th>
                  <th className="px-6 py-4 text-center font-medium">评分</th>
                  <th className="px-6 py-4 text-center font-medium">状态</th>
                  <th className="px-6 py-4 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {works.map(w => {
                  const s = statusLabels[w.status] || statusLabels.pending;
                  return (
                    <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {w.cover_image ? <img src={w.cover_image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🎵</div>}
                          </div>
                          <div className="min-w-0">
                            <Link to={`/works/${w.id}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-1 max-w-xs">{w.title}</Link>
                            <div className="text-xs text-gray-400 mt-1">{w.type === 'song' ? '完整歌曲' : w.type === 'lyrics' ? '歌词' : '纯音乐'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{w.category_icon} {w.category_name || '-'}</td>
                      <td className="px-6 py-4"><span className="font-semibold text-music-600">¥{Number(w.price).toFixed(2)}</span></td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{(w.views || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600 font-medium">{w.sales || 0}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <span className="text-sm star-filled">★</span>
                          <span className="text-sm font-medium text-gray-900">{(w.rating || 0).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`badge ${s.color}`}>{s.label}</span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link to={`/works/${w.id}`} className="text-sm text-gray-600 hover:text-primary-600">查看</Link>
                        <button onClick={() => {
                          setEditing(w.id);
                          setForm({
                            title: w.title, type: w.type, category_id: w.category_id || '',
                            description: w.description, content: w.content, preview: w.preview || '',
                            price: w.price, tags: w.tags || '', cover_image: w.cover_image || ''
                          });
                          setShowForm(true);
                        }} className="text-sm text-primary-600 hover:text-primary-700 font-medium">编辑</button>
                        <button onClick={() => delWork(w.id)} className="text-sm text-red-500 hover:text-red-600">删除</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto py-8">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-auto overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-xl text-gray-900">{editing ? '✏️ 编辑作品' : '➕ 发布新作品'}</h3>
              <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center">✕</button>
            </div>
            <form onSubmit={submitForm} className="p-6 space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">作品标题 *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="如：夏日恋歌" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">作品类型 *</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
                    <option value="song">完整歌曲（含词曲）</option>
                    <option value="lyrics">仅歌词</option>
                    <option value="music">纯音乐/配乐</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">所属分类</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="input-field">
                    <option value="">请选择分类</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">售价 ¥ *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="如：999" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">封面图片 URL</label>
                <input value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} placeholder="留空将使用默认封面，可填 Unsplash 等图片链接" className="input-field" />
                {form.cover_image && (
                  <div className="mt-2 w-32 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={form.cover_image} alt="预览" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">作品描述 *</label>
                <textarea rows="3" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="介绍一下这个作品的风格、背景、适合的场景..." className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标签（用逗号分隔）</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="如：流行,情歌,夏日,年轻" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">内容预览 <span className="text-xs text-gray-400 ml-2">（买家购买前可见的部分内容，如副歌片段）</span></label>
                <textarea rows="4" value={form.preview} onChange={e => setForm(f => ({ ...f, preview: e.target.value }))}
                  placeholder="粘贴作品的精彩片段..." className="input-field font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">完整作品内容 * <span className="text-xs text-gray-400 ml-2">（买家支付后可完整查看）</span></label>
                <textarea rows="10" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="粘贴完整的歌词、谱子、歌曲文档..." className="input-field font-mono text-sm resize-y" />
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between sticky bottom-0 bg-white py-4 -mx-6 px-6 -mb-6">
                <div className="text-xs text-gray-400">提交后平台将于 24 小时内审核完成</div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary !px-8">取消</button>
                  <button type="submit" className="btn-primary !px-8">{editing ? '保存修改' : '提交审核'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
