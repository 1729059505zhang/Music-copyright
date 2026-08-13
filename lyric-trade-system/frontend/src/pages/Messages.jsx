import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate('/login?redirect=' + encodeURIComponent('/messages')); return; }
    loadConversations();
  }, [user, navigate]);

  useEffect(() => {
    const other = params.get('other');
    if (other && conversations.length) {
      setActive(parseInt(other));
      loadMessages(parseInt(other));
    }
  }, [params, conversations]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const loadConversations = () => {
    setLoading(true);
    api.get('/messages').then(d => {
      setConversations(d);
      if (d.length > 0 && !active) {
        setActive(d[0].other_id);
        loadMessages(d[0].other_id);
      }
    }).finally(() => setLoading(false));
  };

  const loadMessages = (otherId) => {
    api.get('/messages', { params: { other_id: otherId } }).then(setMessages);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || !active) return;
    const text = input.trim();
    setInput('');
    try {
      const msg = await api.post('/messages', { receiver_id: active, content: text });
      setMessages(m => [...m, msg]);
    } catch (e) {}
  };

  if (!user) return null;

  const otherUser = conversations.find(c => c.other_id === active)?.user;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">💬 消息中心</h1>

      <div className="card overflow-hidden h-[70vh] grid grid-cols-1 md:grid-cols-3">
        <aside className="border-r border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <input placeholder="搜索联系人..." className="input-field !py-2 !text-sm" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="flex gap-3"><div className="skeleton w-12 h-12 rounded-full" /><div className="flex-1 space-y-2 py-1"><div className="skeleton h-4 w-2/3" /><div className="skeleton h-3 w-1/2" /></div></div>)}</div>
            ) : conversations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="text-5xl mb-3 opacity-40">💬</div>
                <p className="text-sm text-gray-500">暂无消息<br />去作品页面咨询卖家吧～</p>
                <Link to="/search" className="mt-4 text-primary-600 text-sm font-medium hover:underline">去逛逛 →</Link>
              </div>
            ) : (
              conversations.map(c => (
                <button key={c.other_id} onClick={() => { setActive(c.other_id); loadMessages(c.other_id); }}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${active === c.other_id ? 'bg-primary-50/70' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <img src={c.user?.avatar} alt="" className="w-12 h-12 rounded-full" />
                    {c.unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">{c.unread > 99 ? '99+' : c.unread}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 line-clamp-1">{c.user?.username}</span>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{c.last_message ? new Date(c.last_message.created_at).toLocaleDateString() : ''}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                      {c.last_message?.sender_id === user.id && <span className="text-gray-400">我: </span>}
                      {c.last_message?.content}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="col-span-2 flex flex-col bg-gray-50/50">
          {active && otherUser ? (
            <>
              <header className="p-4 bg-white border-b border-gray-100 flex items-center gap-3">
                <img src={otherUser.avatar} alt="" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{otherUser.username}</div>
                  <div className="text-xs text-green-500">在线</div>
                </div>
                <Link to={`/users/${active}`} className="btn-secondary !py-1.5 !px-3 text-xs">查看主页</Link>
              </header>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">👋 开始你们的对话吧</div>
                ) : (
                  messages.map(m => {
                    const isMe = m.sender_id === user.id;
                    return (
                      <div key={m.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {!isMe && <img src={m.sender_avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />}
                        <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                          isMe ? 'bg-gradient-to-br from-primary-500 to-music-500 text-white rounded-br-md' : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                        }`}>
                          <p className="whitespace-pre-wrap break-words">{m.content}</p>
                          <p className={`text-[10px] mt-1.5 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>{new Date(m.created_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <form onSubmit={send} className="p-4 bg-white border-t border-gray-100 flex gap-3">
                <input value={input} onChange={e => setInput(e.target.value)}
                  placeholder="输入消息，回车发送..." className="input-field flex-1 !py-3" />
                <button type="submit" className="btn-primary !px-6 flex items-center gap-2">
                  发送
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-5xl mb-5">💌</div>
              <p className="text-lg font-medium text-gray-600 mb-2">选择一个对话开始聊天</p>
              <p className="text-sm">或前往作品页面咨询创作者</p>
              <Link to="/search" className="mt-5 btn-primary text-sm">去浏览作品</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
