import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shirt, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/services';
import { useAuthStore } from '../store/stores';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      setAuth(res.user, res.token);
      toast.success(`Добро пожаловать, ${res.user.firstName || res.user.username}!`);
      navigate(res.user.role === 'Admin' ? '/admin' : '/');
    } catch {
      toast.error('Неверный email или пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-4">
            <Shirt size={28} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Вход</h1>
          <p className="text-gray-500 text-sm mt-1">Войдите в свой аккаунт StyleShop</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="вы@пример.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-700">
          <p className="font-semibold mb-1">Аккаунт администратора (демо):</p>
          <p>Email: admin@clothingstore.com</p>
          <p>Пароль: Admin@123</p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ещё нет аккаунта?{' '}
          <Link to="/register" className="text-emerald-600 hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
