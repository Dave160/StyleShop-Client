import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/stores';
import { useAuthStore } from '../store/stores';
import { orderService } from '../services/services';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Пожалуйста, войдите чтобы оформить заказ.');
      navigate('/login');
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error('Пожалуйста, укажите адрес доставки.');
      return;
    }
    setLoading(true);
    try {
      await orderService.create({
        shippingAddress,
        notes,
        items: items.map(i => ({
          productId: i.product.id,
          quantity: i.quantity,
          selectedSize: i.selectedSize,
          selectedColor: i.selectedColor,
        })),
      });
      clearCart();
      toast.success('Заказ успешно оформлен!');
      navigate('/orders');
    } catch {
      toast.error('Ошибка при оформлении заказа. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Ваша корзина пуста</h2>
          <p className="text-gray-400 mb-6">Откройте наши товары и добавьте их в корзину.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Смотреть каталог <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Моя корзина ({items.length} товар{items.length > 1 ? 'а' : ''})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center"
              >
                <img
                  src={item.product.imageUrl || 'https://placehold.co/100x100?text=...'}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=...'; }}
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{item.product.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {item.selectedSize && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {item.selectedSize}
                      </span>
                    )}
                    {item.selectedColor && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {item.selectedColor}
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-700 font-bold mt-1">{item.product.price.toFixed(2)} ₽</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    title="Уменьшить количество"
                    className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:border-emerald-400 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    title="Увеличить количество"
                    className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:border-emerald-400 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="text-right min-w-[60px]">
                  <p className="font-bold text-gray-800 text-sm">
                    {(item.product.price * item.quantity).toFixed(2)} ₽
                  </p>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    title="Удалить товар"
                    className="text-red-400 hover:text-red-600 mt-1 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-24">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Итог заказа</h2>

            <div className="space-y-2 mb-5">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm text-gray-500">
                  <span className="truncate max-w-[140px]">{item.product.name} × {item.quantity}</span>
                  <span>{(item.product.price * item.quantity).toFixed(2)} ₽</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-5">
              <div className="flex justify-between font-bold text-gray-800 text-lg">
                <span>Итого</span>
                <span className="text-emerald-700">{totalPrice().toFixed(2)} ₽</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Бесплатная доставка от 5000 ₽</p>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label htmlFor="shipping-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес доставки *
                </label>
                <textarea
                  id="shipping-address"
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  placeholder="ул. Пушкина, д. 1, Москва, 101000"
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                />
              </div>
              <div>
                <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700 mb-1">Примечания (необязательно)</label>
                <textarea
                  id="order-notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Особые инструкции..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Оформление заказа...' : (
                <><ArrowRight size={18} /> Оформить заказ</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
