import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useAuthStore } from '../store/stores';
import { orderService } from '../services/services';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const totalCount = items.reduce((s, i) => s + i.quantity, 0);
  const shipping = total >= 5000 ? 0 : 350;

  const handleOrder = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!address.trim()) { toast.error('Укажите адрес доставки'); return; }
    setLoading(true);
    try {
      await orderService.create({
        shippingAddress: address,
        notes,
        items: items.map(i => ({
          productId: i.product.id,
          quantity: i.quantity,
          selectedSize: i.selectedSize,
          selectedColor: i.selectedColor,
        })),
      });
      clearCart();
      toast.success('Заказ оформлен!');
      navigate('/orders');
    } catch {
      toast.error('Ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 pt-24 flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
          <ShoppingBag size={40} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-700">Корзина пуста</h2>
        <p className="text-slate-400">Добавьте товары из каталога</p>
        <Link to="/products" className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-violet-500 transition-colors">
          Перейти в каталог
        </Link>
      </div>
      <footer className="bg-slate-950 border-t border-slate-800/50 py-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">© 2026 StyleShop · Интернет-магазин одежды</div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-10">
        <div className="mb-10">
          <p className="text-indigo-500 font-semibold text-sm tracking-[0.3em] uppercase mb-1">StyleShop</p>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Корзина</h1>
          <p className="text-slate-500 mt-1 text-sm">{totalCount} товара</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 shadow-sm"
                >
                  <Link to={`/products/${item.product.id}`} className="shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-28 object-cover rounded-xl"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/96x112?text=...'; }} />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link to={`/products/${item.product.id}`} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                          {item.product.name}
                        </Link>
                        <div className="flex gap-2 mt-1">
                          {item.selectedSize && <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{item.selectedSize}</span>}
                          {item.selectedColor && <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{item.selectedColor}</span>}
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.product.id)}
                        title="Удалить товар"
                        className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          title="Уменьшить количество"
                          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-white transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-9 h-9 flex items-center justify-center font-bold text-sm text-slate-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          title="Увеличить количество"
                          className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-white transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-black text-slate-900 text-lg">{(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
              <h2 className="font-black text-slate-900 text-xl uppercase tracking-tight">Итого</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Товары ({totalCount} шт.)</span>
                  <span>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Доставка</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>{shipping === 0 ? 'Бесплатно' : `${shipping} ₽`}</span>
                </div>
                {total < 5000 && <p className="text-xs text-slate-400">Добавьте ещё {(5000 - total).toLocaleString('ru-RU')} ₽ для бесплатной доставки</p>}
                <div className="pt-3 border-t border-slate-100 flex justify-between font-black text-xl text-slate-900">
                  <span>К оплате</span>
                  <span>{(total + shipping).toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <MapPin size={12} /> Адрес доставки *
                  </label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3}
                    placeholder="г. Москва, ул. Арбат, д. 1, кв. 10"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Примечания</label>
                  <input value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Позвоните перед доставкой..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
                </div>
              </div>

              <button onClick={handleOrder} disabled={!address.trim() || loading}
                className="w-full h-14 bg-indigo-500 hover:bg-violet-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 text-lg">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ArrowRight size={20} /> Оформить заказ</>}
              </button>

              {!isAuthenticated && (
                <p className="text-center text-xs text-slate-400">
                  <Link to="/login" className="text-indigo-500 hover:underline">Войдите</Link>, чтобы оформить заказ
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-950 border-t border-slate-800/50 py-10 mt-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">
          © 2026 StyleShop · Интернет-магазин одежды
        </div>
      </footer>
    </div>
  );
}
