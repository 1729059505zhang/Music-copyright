import React from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-gray-800',
    warning: 'bg-yellow-500',
  };
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className={`${styles[type]} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-medium`}>
        <span className="text-lg">{icons[type]}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = React.useState([]);
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
  };
  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));
  const ToastContainer = () => (
    <div className="space-y-2">
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />)}
    </div>
  );
  return { showToast, ToastContainer };
}
