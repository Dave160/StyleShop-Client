import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Minus, Plus, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/services';
import { useCartStore, useFavoritesStore } from '../store/stores';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore(s => s.addItem);
  const { toggle, isFavorite: isFav } = useFavoritesStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-slate-50 pt-24 flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-slate-700">Товар не найден</h2>
      <Link to="/products" className="text-indigo-500 hover:underline">← Вернуться к каталогу</Link>
    </div>
  );

  const sizes = product.availableSizes ? product.availableSizes.split(',').map(s => s.trim()) : [];
  const colors = product.availableColors ? product.availableColors.split(',').map(c => c.trim()) : [];
  const fav = isFav(product.id);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const genderLabel = ({ men: 'Мужское', women: 'Женское', unisex: 'Унисекс' } as Record<string, string>)[product.gender] ?? '';

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) { toast.error('Выберите размер'); return; }
    if (colors.length > 0 && !selectedColor) { toast.error('Выберите цвет'); return; }
    addItem(product, quantity, selectedSize || undefined, selectedColor || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-10">
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-10">
          <Link to="/" className="hover:text-slate-700">Главная</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-slate-700">Каталог</Link>
          <span>/</span>
          <span className="text-slate-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }} className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-white shadow-lg">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x750?text=No+Image'; }} />
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-indigo-500/20 text-indigo-700 border border-indigo-300/40 text-xs font-bold rounded-full backdrop-blur-sm">{genderLabel}</span>
                {isLowStock && (
                  <span className="absolute top-4 right-4 px-3 py-1.5 bg-red-500/20 text-red-700 border border-red-300/40 text-xs font-bold rounded-full backdrop-blur-sm">
                    Осталось {product.stock} шт.
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }} className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">{product.name}</h1>
                <button onClick={() => toggle(product)}
                  title={fav ? 'Убрать из избранного' : 'В избранное'}
                  className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${fav ? 'bg-violet-500 border-violet-400 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-violet-300 hover:text-violet-500'}`}>
                  <Heart size={20} fill={fav ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                <span className="text-slate-400 text-sm ml-1">(24 отзыва)</span>
              </div>
              <div className="mt-6">
                <span className="text-5xl font-black text-slate-900 tracking-tight">{product.price.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100" />
            <p className="text-slate-600 leading-relaxed">{product.description}</p>

            {sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Размер</label>
                  {!selectedSize && <span className="text-xs text-red-400 font-medium">Выберите размер</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`min-w-[48px] h-12 px-4 rounded-xl border text-sm font-bold transition-all ${selectedSize === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-500'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Цвет</label>
                  {selectedColor && <span className="text-xs text-slate-500 font-medium">{selectedColor}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-4 h-10 rounded-xl border text-sm font-semibold transition-all ${selectedColor === c ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Количество</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} title="Уменьшить количество" className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"><Minus size={16} /></button>
                  <span className="w-12 h-12 flex items-center justify-center font-bold text-slate-900">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} title="Увеличить количество" className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"><Plus size={16} /></button>
                </div>
                <span className="text-slate-400 text-sm">В наличии: {product.stock} шт.</span>
              </div>
            </div>

            <div className="sticky bottom-6 z-10">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className={`w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
                  added ? 'bg-emerald-500 shadow-emerald-500/30 text-white' :
                  product.stock === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' :
                  'bg-indigo-500 hover:bg-violet-500 text-white shadow-indigo-500/30'
                }`}>
                {added ? <><Check size={22} /> Добавлено в корзину</> : <><ShoppingBag size={22} /> В корзину</>}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="bg-slate-950 border-t border-slate-800/50 py-10 mt-24">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">
          © 2026 StyleShop · Интернет-магазин одежды
        </div>
      </footer>
    </div>
  );
}
