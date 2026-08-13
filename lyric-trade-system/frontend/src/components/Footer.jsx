import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-music-500 flex items-center justify-center text-white text-xl">🎵</div>
              <div>
                <div className="font-bold text-lg text-white">词曲集市</div>
                <div className="text-xs text-gray-500">LyricTrade Market</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">专业的原创词曲交易平台，汇聚全国优秀创作人，让好音乐不再被埋没。</p>
            <div className="flex gap-3 mt-4">
              {['📱', '💬', '📧', '🌐'].map((icon, i) => (
                <div key={i} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">{icon}</div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">买家服务</h4>
            <ul className="space-y-2 text-sm">
              {['如何购买', '支付方式', '获取作品', '售后保障', '定制服务'].map(t => (
                <li key={t}><a className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">{t}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">卖家服务</h4>
            <ul className="space-y-2 text-sm">
              {['入驻流程', '发布作品', '交易规则', '提现说明', '创作激励'].map(t => (
                <li key={t}><a className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">{t}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">关于我们</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">平台介绍</Link></li>
              <li><a className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">联系客服</a></li>
              <li><a className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">合作洽谈</a></li>
              <li><a className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">意见反馈</a></li>
              <li><a className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">用户协议</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2024 词曲集市 LyricTrade. All rights reserved. 保留所有权利。</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <span>🏆 行业领先的词曲交易平台</span>
            <span>🔒 交易安全保障</span>
            <span>⚡ 快速交付</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
