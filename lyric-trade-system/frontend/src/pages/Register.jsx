import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { showToast, ToastContainer } = useToast();
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirm: '',
    role: params.get('role') === 'seller' ? 'seller' : 'buyer',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      showToast('请填写完整信息', 'warning'); return;
    }
    if (form.password.length < 6) {
      showToast('密码至少6位', 'warning'); return;
    }
    if (form.password !== form.confirm) {
      showToast('两次密码不一致', 'warning'); return;
    }
    setLoading(true);
    try {
      await register(form);
      showToast('注册成功！欢迎加入', 'success');
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      showToast(err.message || '注册失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-music-50">
      <ToastContainer />
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-music-500 flex items-center justify-center text-white text-3xl shadow-xl shadow-primary-500/30">🎵</div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">加入词曲集市</h1>
          <p className="text-gray-500 mt-2">开启您的音乐创作与交易之旅</p>
        </div>

        <div className="card p-8">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[['buyer', '我是买家', '购买优质词曲作品', '🛒'], ['seller', '我是创作者', '出售我的原创作品', '🎨']].map(([v, t, d, i]) => (
              <button key={v} type="button" onClick={() => update('role', v)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${form.role === v ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="text-2xl mb-2">{i}</div>
                <div className={`font-semibold ${form.role === v ? 'text-primary-600' : 'text-gray-900'}`}>{t}</div>
                <div className="text-xs text-gray-500 mt-1">{d}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
              <input value={form.username} onChange={e => update('username', e.target.value)} placeholder="请输入用户名"
                className="input-field !py-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="请输入邮箱地址"
                className="input-field !py-3" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="至少6位"
                  className="input-field !py-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
                <input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} placeholder="再次输入密码"
                  className="input-field !py-3" />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer mt-5">
              <input type="checkbox" defaultChecked className="w-4 h-4 mt-0.5 text-primary-600 flex-shrink-0" />
              <span>我已阅读并同意《用户协议》《隐私政策》和《版权交易规则》</span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base disabled:opacity-60 mt-2">
              {loading ? '注册中...' : form.role === 'seller' ? '申请成为创作者' : '立即注册'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          已有账号？<Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 ml-1">立即登录 →</Link>
        </p>
      </div>
    </div>
  );
}
