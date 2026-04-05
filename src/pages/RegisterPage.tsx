import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shirt, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/services';
import { useAuthStore } from '../store/stores';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', firstName: '', lastName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Пароль должен содержать не менее 6 символов.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register(form);
      setAuth(res.user, res.token);
      toast.success('Аккаунт успешно создан!');
      navigate('/');
    } catch {
      toast.error('Этот email уже используется.');
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
          <h1 className="text-2xl font-bold text-gray-800">Создать аккаунт</h1>
          <p className="text-gray-500 text-sm mt-1">Присоединяйтесь к StyleShop сегодня</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-firstName" className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
              <input
                id="reg-firstName"
                name="firstName" value={form.firstName} onChange={handleChange}
                placeholder="Иван"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <div>
              <label htmlFor="reg-lastName" className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
              <input
                id="reg-lastName"
                name="lastName" value={form.lastName} onChange={handleChange}
                placeholder="Иванов"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя *</label>
            <input
              id="reg-username"
              name="username" value={form.username} onChange={handleChange} required
              placeholder="ivan_ivanov"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              id="reg-email"
              type="email" name="email" value={form.email} onChange={handleChange} required
              placeholder="ivan@пример.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Пароль *</label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                name="password" value={form.password} onChange={handleChange} required
                placeholder="Минимум 6 символов"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
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
            type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? 'Создание...' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-emerald-600 hover:underline font-medium">Войти</Link>
        </p>
      </div>
    </div>
  );
}
