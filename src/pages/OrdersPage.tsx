import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Package, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/services';
import { useAuthStore } from '../store/stores';

const STATUS_LABELS: Record<number, string> = {
  0: 'Ожидает', 1: 'Подтверждён', 2: 'Отправлен', 3: 'Доставлен', 4: 'Отменён',
};

const STATUS_COLORS: Record<number, string> = {
  0: 'bg-yellow-500/20 text-yellow-700',
  1: 'bg-indigo-500/20 text-indigo-700',
  2: 'bg-violet-500/20 text-violet-700',
  3: 'bg-emerald-500/20 text-emerald-700',
  4: 'bg-red-500/20 text-red-700',
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderService.getMy,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 pt-24 flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
          <Package size={40} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-700">Вход не выполнен</h2>
        <p className="text-slate-400">Войдите для просмотра заказов</p>
        <Link to="/login" className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-violet-500 transition-colors">Войти</Link>
      </div>
      <footer className="bg-slate-950 border-t border-slate-800/50 py-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">© 2026 StyleShop · Интернет-магазин одежды</div>
      </footer>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
      <footer className="bg-slate-950 border-t border-slate-800/50 py-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">© 2026 StyleShop · Интернет-магазин одежды</div>
      </footer>
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 pt-24 flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
          <ShoppingBag size={40} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-700">У вас нет заказов</h2>
        <Link to="/products" className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-xl">Перейти в каталог</Link>
      </div>
      <footer className="bg-slate-950 border-t border-slate-800/50 py-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">© 2026 StyleShop · Интернет-магазин одежды</div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-indigo-500 font-semibold text-sm tracking-[0.3em] uppercase mb-1">StyleShop</p>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Мои заказы</h1>
          <p className="text-slate-500 mt-1 text-sm">{orders.length} заказа</p>
        </div>

        <div className="space-y-4">
          {orders.map(order => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-left">
                    <p className="font-black text-slate-900 text-lg">Заказ #{order.id}</p>
                    <p className="text-slate-400 text-sm">{new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_LABELS[order.status] ?? order.statusName}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-xl text-slate-900">{order.totalPrice.toLocaleString('ru-RU')} ₽</span>
                  {expanded === order.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </button>

              <AnimatePresence>
                {expanded === order.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-slate-100">
                    <div className="p-6 space-y-4">
                      {order.shippingAddress && (
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Адрес доставки</p>
                          <p className="text-slate-700 text-sm">{order.shippingAddress}</p>
                        </div>
                      )}
                      {order.notes && (
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Примечания</p>
                          <p className="text-slate-700 text-sm">{order.notes}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Товары</p>
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                              <img src={item.productImage || 'https://placehold.co/56x64?text=...'} alt={item.productName} className="w-14 h-16 object-cover rounded-lg"
                                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/56x64?text=...'; }} />
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900 text-sm">{item.productName}</p>
                                <div className="flex gap-2 mt-1">
                                  {item.selectedSize && <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">{item.selectedSize}</span>}
                                  {item.selectedColor && <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">{item.selectedColor}</span>}
                                  <span className="text-xs text-slate-400">× {item.quantity}</span>
                                </div>
                              </div>
                              <span className="font-bold text-slate-900">{item.totalPrice.toLocaleString('ru-RU')} ₽</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="bg-slate-950 border-t border-slate-800/50 py-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">
          © 2026 StyleShop · Интернет-магазин одежды
        </div>
      </footer>
    </div>
  );
}
