import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { showToast, ToastContainer } = useToast();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account || !password) {
      showToast('请填写账号和密码', 'warning');
      return;
    }
    setLoading(true);
    try {
      await login(account, password);
      showToast('登录成功！欢迎回来', 'success');
      setTimeout(() => navigate(params.get('redirect') || '/'), 500);
    } catch (err) {
      showToast(err.message || '登录失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (acc, pwd) => { setAccount(acc); setPassword(pwd); };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-music-50">
      <ToastContainer />
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-music-500 flex items-center justify-center text-white text-3xl shadow-xl shadow-primary-500/30">🎵</div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">欢迎回来</h1>
          <p className="text-gray-500 mt-2">登录您的账号，开启音乐之旅</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">账号</label>
              <input value={account} onChange={e => setAccount(e.target.value)} placeholder="用户名 / 邮箱"
                className="input-field !py-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入密码"
                className="input-field !py-3" onKeyDown={e => e.key === 'Enter' && handleSubmit(e)} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" /> 记住我</label>
              <a className="text-primary-600 hover:text-primary-700 cursor-pointer">忘记密码？</a>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base disabled:opacity-60">
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">快速登录体验</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-2">
            {[
              ['admin@lyric.com', '管理员账号', 'admin'],
              ['音乐制作人老王', '卖家（音乐制作人）', 'seller'],
              ['音乐爱好者小明', '买家账号', 'buyer'],
            ].map(([acc, desc, role]) => (
              <button key={acc} onClick={() => quickLogin(acc, '123456')} className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                <div>
                  <div className="text-sm font-medium text-gray-900">{acc}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
                <span className={`badge ${role === 'admin' ? 'bg-music-100 text-music-700' : role === 'seller' ? 'bg-primary-100 text-primary-700' : 'bg-blue-100 text-blue-700'}`}>
                  密码: 123456
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          还没有账号？<Link to="/register" className="text-primary-600 font-medium hover:text-primary-700 ml-1">立即注册 →</Link>
        </p>
      </div>
    </div>
  );
}
