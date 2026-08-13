import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkDetail from './pages/WorkDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import SellerWorks from './pages/SellerWorks';
import Ranking from './pages/Ranking';
import Sellers from './pages/Sellers';
import Messages from './pages/Messages';
import Admin from './pages/Admin';
import UserProfile from './pages/UserProfile';

export default function App() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin');

  if (hideLayout) {
    return (
      <Routes>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/works/:id" element={<WorkDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderNo" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/seller/works" element={<SellerWorks />} />
          <Route path="*" element={
            <div className="max-w-4xl mx-auto px-4 py-32 text-center animate-fade-in">
              <div className="text-[120px] mb-6">🎵</div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-500 mb-8">页面不存在或已被移走</p>
              <a href="/" className="btn-primary inline-block !px-8 !py-3.5">返回首页 →</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
