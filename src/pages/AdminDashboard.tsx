import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Package, Tag, ShoppingBag, Users, BarChart2, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { productService, categoryService, orderService } from '../services/services';
import type { Product, Category, Order, CreateProductDto } from '../types';
import toast from 'react-hot-toast';

type Tab = 'stats' | 'products' | 'categories' | 'orders';

const STATUS_LABELS: Record<number, string> = {
  0: 'Ожидает', 1: 'Подтверждён', 2: 'Отправлен', 3: 'Доставлен', 4: 'Отменён',
};

const STATUS_COLORS: Record<number, string> = {
  0: 'bg-yellow-100 text-yellow-700',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-purple-100 text-purple-700',
  3: 'bg-green-100 text-green-700',
  4: 'bg-red-100 text-red-700',
};

//  Stats Tab 
function StatsTab({ products, orders, categories }: {
  products: Product[];
  orders: Order[];
  categories: Category[];
}) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const deliveredOrders = orders.filter(o => o.status === 3).length;
  const pendingOrders = orders.filter(o => o.status === 0).length;
  const cancelledOrders = orders.filter(o => o.status === 4).length;
  const lowStockProducts = products.filter(p => p.stock < 5).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  // Orders by status for bar chart
  const statusCounts = [0, 1, 2, 3, 4].map(s => ({
    label: STATUS_LABELS[s],
    count: orders.filter(o => o.status === s).length,
    color: ['bg-yellow-400', 'bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-red-400'][s],
  }));
  const maxCount = Math.max(...statusCounts.map(s => s.count), 1);

  // Top products by orders
  const productOrderCounts: Record<number, { name: string; count: number; revenue: number }> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      if (!productOrderCounts[item.productId]) {
        productOrderCounts[item.productId] = { name: item.productName, count: 0, revenue: 0 };
      }
      productOrderCounts[item.productId].count += item.quantity;
      productOrderCounts[item.productId].revenue += item.totalPrice;
    });
  });
  const topProducts = Object.values(productOrderCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Общая выручка', value: `${totalRevenue.toLocaleString('ru-RU')} ₽`, icon: <TrendingUp size={22} />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Заказов доставлено', value: deliveredOrders, icon: <CheckCircle size={22} />, color: 'bg-green-50 text-green-600' },
          { label: 'Ожидают обработки', value: pendingOrders, icon: <Clock size={22} />, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Отменённых заказов', value: cancelledOrders, icon: <XCircle size={22} />, color: 'bg-red-50 text-red-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Orders by status — Bar chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-emerald-600" />
            Заказы по статусам
          </h3>
          <div className="space-y-3">
            {statusCounts.map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{s.label}</span>
                  <span className="font-semibold text-gray-800">{s.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${s.color} transition-all duration-500`}
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package size={18} className="text-emerald-600" />
            Состояние склада
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Всего товаров</span>
              <span className="font-bold text-gray-800">{products.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
              <span className="text-sm text-orange-700">Мало в наличии (менее 5)</span>
              <span className="font-bold text-orange-700">{lowStockProducts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <span className="text-sm text-red-700">Нет в наличии</span>
              <span className="font-bold text-red-700">{outOfStockProducts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
              <span className="text-sm text-emerald-700">Категорий</span>
              <span className="font-bold text-emerald-700">{categories.length}</span>
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600" />
            Топ продаваемых товаров
          </h3>
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Нет данных о продажах</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.count} шт. · {p.revenue.toLocaleString('ru-RU')} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-emerald-600" />
            Последние заказы
          </h3>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Нет заказов</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">#{o.id} · {o.userEmail}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-700">{o.totalPrice.toLocaleString('ru-RU')} ₽</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

//  Product Form 
function ProductForm({
  initial, categories, onSave, onCancel,
}: {
  initial?: Product;
  categories: Category[];
  onSave: (dto: CreateProductDto, id?: number) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CreateProductDto>({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    price: initial?.price ?? 0,
    imageUrl: initial?.imageUrl ?? '',
    stock: initial?.stock ?? 0,
    availableSizes: initial?.availableSizes ?? undefined,
    availableColors: initial?.availableColors ?? undefined,
    gender: initial?.gender ?? 'men',
    categoryId: initial?.categoryId ?? (categories[0]?.id ?? 1),
  });

  const set = (k: keyof CreateProductDto, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          {initial ? 'Редактировать товар' : 'Новый товар'}
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Название *', key: 'name', type: 'text', placeholder: 'Футболка базовая' },
            { label: 'URL изображения', key: 'imageUrl', type: 'text', placeholder: 'https://...' },
            { label: 'Цена (₽) *', key: 'price', type: 'number', placeholder: '0' },
            { label: 'Склад *', key: 'stock', type: 'number', placeholder: '0' },
            { label: 'Размеры (напр.: S,M,L,XL)', key: 'availableSizes', type: 'text', placeholder: 'S,M,L,XL' },
            { label: 'Цвета (напр.: Чёрный,Белый)', key: 'availableColors', type: 'text', placeholder: 'Чёрный,Белый' },
          ].map(field => (
            <div key={field.key}>
              <label htmlFor={`pf-${field.key}`} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                id={`pf-${field.key}`}
                type={field.type}
                placeholder={field.placeholder}
                value={String(form[field.key as keyof CreateProductDto] ?? '')}
                onChange={e => set(
                  field.key as keyof CreateProductDto,
                  field.type === 'number' ? Number(e.target.value) : e.target.value
                )}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          ))}

          <div>
            <label htmlFor="pf-description" className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              id="pf-description"
              placeholder="Описание товара..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pf-gender" className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
              <select
                id="pf-gender"
                value={form.gender}
                onChange={e => set('gender', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {[['men','Мужчины'], ['women','Женщины']].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pf-category" className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select
                id="pf-category"
                value={form.categoryId}
                onChange={e => set('categoryId', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(form, initial?.id)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {initial ? 'Сохранить' : 'Создать'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [editingProduct, setEditingProduct] = useState<Product | null | 'new'>(null);
  const qc = useQueryClient();

  const { data: products = [] } = useQuery({ queryKey: ['admin-products'], queryFn: () => productService.getAll() });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryService.getAll });
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: orderService.getAll });

  const createProduct = useMutation({
    mutationFn: (dto: CreateProductDto) => productService.create(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Товар создан!'); setEditingProduct(null); },
    onError: () => toast.error('Ошибка при создании.'),
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CreateProductDto> }) => productService.update(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Товар обновлён!'); setEditingProduct(null); },
  });

  const deleteProduct = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Товар удалён.'); },
  });

  const updateOrderStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) => orderService.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-orders'] }); toast.success('Статус обновлён!'); },
  });

  const handleSaveProduct = (dto: CreateProductDto, id?: number) => {
    if (id) updateProduct.mutate({ id, dto });
    else createProduct.mutate(dto);
  };

  const tabs = [
    { key: 'stats' as Tab, label: 'Статистика', icon: <BarChart2 size={18} /> },
    { key: 'products' as Tab, label: 'Товары', icon: <Package size={18} />, count: products.length },
    { key: 'categories' as Tab, label: 'Категории', icon: <Tag size={18} />, count: categories.length },
    { key: 'orders' as Tab, label: 'Заказы', icon: <ShoppingBag size={18} />, count: orders.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <Users size={24} className="text-emerald-600" /> Администрирование
        </h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Товаров', value: products.length, icon: <Package size={20} />, color: 'bg-emerald-100 text-emerald-600' },
            { label: 'Категорий', value: categories.length, icon: <Tag size={20} />, color: 'bg-purple-100 text-purple-600' },
            { label: 'Заказов', value: orders.length, icon: <ShoppingBag size={20} />, color: 'bg-green-100 text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6 gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === t.key
                  ? 'bg-white text-emerald-600 border border-b-white border-gray-200 -mb-px'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.icon} {t.label}
              {'count' in t && t.count !== undefined && (
                <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <StatsTab products={products} orders={orders} categories={categories} />
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="font-semibold text-gray-800">Управление товарами</h2>
              <button
                onClick={() => setEditingProduct('new')}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              >
                <Plus size={16} /> Новый товар
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Фото', 'Название', 'Категория', 'Пол', 'Цена', 'Склад', 'Действия'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <img src={p.imageUrl || 'https://placehold.co/50x50?text=...'} alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/50x50?text=...'; }} />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{p.name}</td>
                      <td className="px-4 py-3 text-gray-500">{p.categoryName}</td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full capitalize">{p.gender}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{p.price.toLocaleString('ru-RU')} ₽</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock < 5 ? 'text-orange-500' : 'text-green-600'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setEditingProduct(p)} title="Редактировать товар" className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => { if (confirm(`Удалить "${p.name}"?`)) deleteProduct.mutate(p.id); }}
                            title="Удалить товар"
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-5 border-b">
              <h2 className="font-semibold text-gray-800">Категории</h2>
            </div>
            <div className="divide-y">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">/{c.slug} · {c.productCount} товаров</p>
                  </div>
                  <span className="text-sm text-gray-400">{c.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-5 border-b">
              <h2 className="font-semibold text-gray-800">Все заказы</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['#', 'Клиент', 'Итого', 'Товары', 'Статус', 'Дата', 'Действие'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((o: Order) => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-600">#{o.id}</td>
                      <td className="px-4 py-3 text-gray-700">{o.userEmail}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">{o.totalPrice.toLocaleString('ru-RU')} ₽</td>
                      <td className="px-4 py-3 text-gray-500">{o.items.length} шт.</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={e => updateOrderStatus.mutate({ id: o.id, status: Number(e.target.value) })}
                          title="Статус заказа"
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                          {Object.entries(STATUS_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(o.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            if (confirm(`Удалить заказ #${o.id}?`))
                              orderService.delete(o.id).then(() => {
                                qc.invalidateQueries({ queryKey: ['admin-orders'] });
                                toast.success('Заказ удалён.');
                              });
                          }}
                          title="Удалить заказ"
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {editingProduct !== null && (
        <ProductForm
          initial={editingProduct === 'new' ? undefined : editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
