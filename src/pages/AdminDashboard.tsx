import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Package, Clock, XCircle, CheckCircle, Edit, Trash2, Plus, X, Shield, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, categoryService, orderService, userService } from '../services/services';
import { useAuthStore } from '../store/stores';
import type { Product, CreateProductDto, Order } from '../types';
import toast from 'react-hot-toast';

const TABS = ['Статистика', 'Товары', 'Категории', 'Заказы', 'Пользователи'];

const STATUS_LABELS: Record<number, string> = {
  0: 'Ожидает', 1: 'Подтверждён', 2: 'Отправлен', 3: 'Доставлен', 4: 'Отменён',
};

const STATUS_COLORS: Record<number, string> = {
  0: 'bg-yellow-500/20 text-yellow-300',
  1: 'bg-indigo-500/20 text-indigo-300',
  2: 'bg-violet-500/20 text-violet-300',
  3: 'bg-emerald-500/20 text-emerald-300',
  4: 'bg-red-500/20 text-red-300',
};

const CHART_COLORS = ['#EAB308', '#6366F1', '#8B5CF6', '#10B981', '#EF4444'];

type FormState = {
  name: string; description: string; price: string; imageUrl: string;
  stock: string; availableSizes: string; availableColors: string;
  gender: string; categoryId: number; isActive: boolean;
};

const emptyForm: FormState = {
  name: '', description: '', price: '', imageUrl: '', stock: '',
  availableSizes: '', availableColors: '', gender: 'men', categoryId: 1, isActive: true,
};

export default function AdminDashboard() {
  const { isAdmin } = useAuthStore();
  const [tab, setTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const qc = useQueryClient();

  const { data: products = [] } = useQuery({ queryKey: ['admin-products'], queryFn: () => productService.getAll() });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryService.getAll });
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: orderService.getAll });
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: userService.getAll });

  const createProduct = useMutation({
    mutationFn: (dto: CreateProductDto) => productService.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Товар создан!'); setShowModal(false); },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CreateProductDto> }) => productService.update(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Товар обновлён!'); setShowModal(false); },
  });

  const deleteProduct = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Товар удалён.'); },
  });

  const updateOrderStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) => orderService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const deleteOrder = useMutation({
    mutationFn: orderService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-orders'] }); toast.success('Заказ удалён.'); },
  });

  const updateUserRole = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => userService.updateRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Роль обновлена!'); },
    onError: () => toast.error('Ошибка при обновлении роли'),
  });

  const deleteUser = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Пользователь удалён.'); },
    onError: () => toast.error('Ошибка при удалении'),
  });

  if (!isAdmin) return (
    <div className="min-h-screen bg-slate-950 pt-24 flex flex-col items-center justify-center gap-6">
      <Shield size={48} className="text-slate-600" />
      <h2 className="text-white text-2xl font-black">Доступ запрещён</h2>
      <p className="text-slate-500">Эта страница доступна только администраторам</p>
      <Link to="/" className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-xl">На главную</Link>
    </div>
  );

  const revenue = orders.filter(o => o.status === 3).reduce((s, o) => s + o.totalPrice, 0);
  const countByStatus = (s: number) => orders.filter(o => o.status === s).length;
  const lowStockProducts = products.filter(p => p.stock <= 5);

  const statusChart = [0, 1, 2, 3, 4].map((s, i) => ({
    name: STATUS_LABELS[s], value: countByStatus(s), color: CHART_COLORS[i],
  }));

  const openCreate = () => { setEditProduct(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ ...p, price: String(p.price), stock: String(p.stock), isActive: p.isActive, availableSizes: p.availableSizes ?? '', availableColors: p.availableColors ?? '' });
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = () => {
    const dto: CreateProductDto = {
      name: form.name, description: form.description,
      price: Number(form.price), stock: Number(form.stock),
      imageUrl: form.imageUrl, availableSizes: form.availableSizes,
      availableColors: form.availableColors, gender: form.gender,
      categoryId: Number(form.categoryId),
    };
    if (editProduct) updateProduct.mutate({ id: editProduct.id, dto });
    else createProduct.mutate(dto);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Shield size={20} className="text-indigo-400" />
              <span className="text-indigo-400 font-semibold text-sm tracking-widest uppercase">Панель управления</span>
            </div>
            <h1 className="text-white font-black text-4xl uppercase tracking-tight">StyleShop Admin</h1>
          </div>
          <Link to="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 text-sm font-semibold rounded-xl transition-colors border border-white/10">
            На сайт
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-10 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === i ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Stats */}
        {tab === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Выручка', value: `${revenue.toLocaleString('ru-RU')} ₽`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Доставлено', value: countByStatus(3), icon: CheckCircle, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                { label: 'Ожидает', value: countByStatus(0), icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                { label: 'Отменено', value: countByStatus(4), icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                { label: 'Пользователей', value: users.length, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`p-6 rounded-2xl border ${bg} bg-white/5 backdrop-blur-sm`}>
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-slate-400 text-sm font-medium">{label}</p>
                    <Icon size={20} className={color} />
                  </div>
                  <p className={`text-3xl font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-6">Статусы заказов</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={statusChart} margin={{ left: -20 }}>
                    <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {statusChart.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.8} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-6">Низкий остаток</h3>
                {lowStockProducts.length === 0 ? (
                  <p className="text-slate-500 text-sm">Все товары в достаточном количестве</p>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.map(p => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-12 object-cover rounded-lg" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x48?text=...'; }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{p.name}</p>
                          <p className="text-red-400 text-xs font-medium">Осталось: {p.stock} шт.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-6">Последние заказы</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['ID', 'Сумма', 'Статус', 'Дата'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-slate-400 font-bold uppercase tracking-wider text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-white font-bold">#{o.id}</td>
                        <td className="py-3 px-4 text-slate-300 font-semibold">{o.totalPrice.toLocaleString('ru-RU')} ₽</td>
                        <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span></td>
                        <td className="py-3 px-4 text-slate-400">{new Date(o.createdAt).toLocaleDateString('ru-RU')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products */}
        {tab === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-xl uppercase">Товары ({products.length})</h2>
              <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors text-sm">
                <Plus size={16} /> Добавить
              </button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Товар', 'Цена', 'Остаток', 'Пол', 'Статус', ''].map(h => (
                        <th key={h} className="text-left py-4 px-5 text-slate-400 font-bold uppercase tracking-wider text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-12 object-cover rounded-lg" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x48?text=...'; }} />
                            <span className="text-white font-semibold text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-indigo-300 font-bold">{p.price.toLocaleString('ru-RU')} ₽</td>
                        <td className="py-3 px-5"><span className={`font-bold ${p.stock <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>{p.stock}</span></td>
                        <td className="py-3 px-5 text-slate-400">{p.gender === 'men' ? 'Муж.' : p.gender === 'women' ? 'Жен.' : 'Унисекс'}</td>
                        <td className="py-3 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'}`}>
                            {p.isActive ? 'Активен' : 'Скрыт'}
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(p)} title="Редактировать товар" className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-indigo-500/30 text-slate-400 hover:text-indigo-300 rounded-lg transition-all"><Edit size={14} /></button>
                            <button onClick={() => { if (confirm(`Удалить "${p.name}"?`)) deleteProduct.mutate(p.id); }} title="Удалить товар" className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-red-500/30 text-slate-400 hover:text-red-400 rounded-lg transition-all"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Categories */}
        {tab === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-white font-black text-xl uppercase mb-6">Категории</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(c => (
                <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-lg">{c.name}</p>
                    <p className="text-slate-400 text-sm">/{c.slug}</p>
                    <p className="text-slate-500 text-sm mt-1">{c.description}</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                    <Package size={18} className="text-indigo-400" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Users */}
        {tab === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-white font-black text-xl uppercase mb-6">
              Пользователи ({users.length})
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['ID', 'Пользователь', 'Email', 'Роль', 'Дата регистрации', ''].map(h => (
                      <th key={h} className="text-left py-4 px-5 text-slate-400 font-bold uppercase tracking-wider text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-5 text-slate-400">#{u.id}</td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-300 font-bold text-sm">
                            {(u.firstName?.[0] || u.username[0]).toUpperCase()}
                          </div>
                          <span className="text-white font-semibold">
                            {u.firstName ? `${u.firstName} ${u.lastName ?? ''}` : u.username}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-slate-400">{u.email}</td>
                      <td className="py-3 px-5">
                        <select
                          defaultValue={u.role}
                          disabled={u.role === 'Admin' && users.filter(x => x.role === 'Admin').length === 1}
                          onChange={e => updateUserRole.mutate({ id: u.id, role: e.target.value })}
                          title="Роль пользователя"
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border-0 outline-none cursor-pointer ${u.role === 'Admin' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-500/20 text-slate-400'}`}
                        >
                          <option value="User" className="bg-slate-900 text-white">User</option>
                          <option value="Admin" className="bg-slate-900 text-white">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-5 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="py-3 px-5">
                        <button
                          type="button"
                          title="Удалить пользователя"
                          onClick={() => {
                            if (u.role === 'Admin') { toast.error('Нельзя удалить администратора.'); return; }
                            if (confirm(`Удалить пользователя "${u.username}"?`)) deleteUser.mutate(u.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-red-500/30 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Orders */}
        {tab === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-white font-black text-xl uppercase mb-6">Все заказы ({orders.length})</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['ID', 'Сумма', 'Адрес', 'Дата', 'Статус', ''].map(h => (
                        <th key={h} className="text-left py-4 px-5 text-slate-400 font-bold uppercase tracking-wider text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o: Order) => (
                      <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-5 text-white font-bold">#{o.id}</td>
                        <td className="py-3 px-5 text-slate-300 font-semibold">{o.totalPrice.toLocaleString('ru-RU')} ₽</td>
                        <td className="py-3 px-5 text-slate-400 max-w-[200px] truncate">{o.shippingAddress}</td>
                        <td className="py-3 px-5 text-slate-400">{new Date(o.createdAt).toLocaleDateString('ru-RU')}</td>
                        <td className="py-3 px-5">
                          <select value={o.status} onChange={e => updateOrderStatus.mutate({ id: o.id, status: Number(e.target.value) })}
                            title="Статус заказа"
                            className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                            {Object.entries(STATUS_LABELS).map(([val, label]) => (
                              <option key={val} value={val} className="bg-slate-900">{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-5">
                          <button onClick={() => { if (confirm(`Удалить заказ #${o.id}?`)) deleteOrder.mutate(o.id); }}
                            title="Удалить заказ"
                            className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-red-500/30 text-slate-400 hover:text-red-400 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-white font-black text-xl uppercase">{editProduct ? 'Редактировать' : 'Добавить товар'}</h3>
                <button onClick={() => setShowModal(false)} title="Закрыть" className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {([
                  { name: 'name', label: 'Название', placeholder: 'Название товара', type: 'text' },
                  { name: 'imageUrl', label: 'URL изображения', placeholder: 'https://...', type: 'text' },
                  { name: 'price', label: 'Цена (₽)', placeholder: '1999', type: 'number' },
                  { name: 'stock', label: 'Остаток', placeholder: '10', type: 'number' },
                  { name: 'availableSizes', label: 'Размеры', placeholder: 'S,M,L,XL', type: 'text' },
                  { name: 'availableColors', label: 'Цвета', placeholder: 'Чёрный,Белый', type: 'text' },
                ] as const).map(({ name, label, placeholder, type }) => (
                  <div key={name}>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
                    <input name={name} value={form[name]} onChange={handleFormChange} type={type} placeholder={placeholder}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Описание</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} placeholder="Описание товара..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Пол</label>
                    <select name="gender" value={form.gender} onChange={handleFormChange}
                      title="Пол" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm">
                      <option value="men" className="bg-slate-900">Мужское</option>
                      <option value="women" className="bg-slate-900">Женское</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Категория</label>
                    <select name="categoryId" value={form.categoryId} onChange={handleFormChange}
                      title="Категория" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm">
                      {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleSave} className="w-full h-12 bg-indigo-500 hover:bg-violet-500 text-white font-bold rounded-xl transition-all">
                  {editProduct ? 'Сохранить' : 'Создать товар'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-slate-950 border-t border-slate-800/50 py-10 mt-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">
          © 2026 StyleShop · Интернет-магазин одежды
        </div>
      </footer>
    </div>
  );
}
