import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/services';
import { useAuthStore } from '../store/stores';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Пароль должен содержать минимум 6 символов'); return; }
    setLoading(true);
    try {
      const res = await authService.register({
        username: form.username || form.email.split('@')[0],
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });
      setAuth(res.user, res.token);
      toast.success('Аккаунт создан!');
      navigate('/');
    } catch {
      toast.error('Этот email уже используется');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3.5 bg-white/5 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all";

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80" alt="fashion" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
        <div className="absolute bottom-16 left-12">
          <h2 className="text-white font-black text-5xl uppercase leading-tight mb-4">СОЗДАЙТЕ<br />АККАУНТ</h2>
          <p className="text-slate-400 text-lg">Присоединяйтесь к StyleShop</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">S</span>
            </div>
            <span className="text-white font-black text-xl tracking-widest">StyleShop</span>
          </div>

          <h1 className="text-white font-black text-4xl uppercase tracking-tight mb-2">Регистрация</h1>
          <p className="text-slate-400 mb-10">Создайте новый аккаунт</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Имя</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Иван" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Фамилия</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Иванов" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <input name="email" value={form.email} onChange={handleChange} type="email" required placeholder="your@email.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Пароль</label>
              <div className="relative">
                <input name="password" value={form.password} onChange={handleChange} type={showPass ? 'text' : 'password'} required minLength={6}
                  placeholder="Минимум 6 символов" className={`${inputCls} pr-12`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-14 bg-indigo-500 hover:bg-violet-500 disabled:opacity-60 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30 mt-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus size={20} /> Создать аккаунт</>}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-8 text-sm">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Войти</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
