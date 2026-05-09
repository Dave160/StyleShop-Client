import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCartStore, useFavoritesStore } from '../../store/stores';
import { motion } from 'framer-motion';
import type { Product } from '../../types';

interface Props {
  product: Product;
  index?: number;
  stagger?: boolean;
}

const genderBadge: Record<string, { label: string; cls: string }> = {
  men:    { label: 'Мужское',  cls: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  women:  { label: 'Женское',  cls: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  unisex: { label: 'Унисекс', cls: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
};

export default function ProductCard({ product, index = 0, stagger = false }: Props) {
  const [hovering, setHovering] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const addItem = useCartStore(s => s.addItem);
  const { toggle, isFavorite } = useFavoritesStore();
  const fav = isFavorite(product.id);

  const sizes = product.availableSizes ? product.availableSizes.split(',').map(s => s.trim()) : [];
  const firstColor = product.availableColors ? product.availableColors.split(',')[0].trim() : '';
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const badge = genderBadge[product.gender] ?? genderBadge.unisex;
  const offsetY = stagger && index % 2 === 1 ? 40 : 0;

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, size, firstColor);
    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      style={{ marginTop: offsetY }}
      className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <img
          src={product.imageUrl || 'https://placehold.co/400x533?text=No+Image'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${hovering ? 'scale-105' : 'scale-100'}`}
          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x533?text=No+Image'; }}
        />

        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`} />

        {/* Gender badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${badge.cls}`}>
          {badge.label}
        </span>

        {/* Low stock */}
        {isLowStock && (
          <span className="absolute top-3 right-12 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-sm">
            Мало
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-400 border border-slate-700 backdrop-blur-sm">
            Нет
          </span>
        )}

        {/* Fav button */}
        <button
          onClick={e => { e.preventDefault(); toggle(product); }}
          title={fav ? 'Убрать из избранного' : 'В избранное'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-200 ${fav ? 'bg-violet-500 border-violet-400 text-white' : 'bg-white/20 border-white/30 text-white hover:bg-violet-500/80'}`}
        >
          <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
        </button>

        {/* Quick add sizes — slide up on hover */}
        <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${hovering ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <div className="bg-slate-950/90 backdrop-blur-md px-4 py-3">
            <p className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-widest">Быстрый выбор</p>
            <div className="flex gap-2 flex-wrap">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={e => handleQuickAdd(size, e)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-150 ${addedSize === size ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-indigo-500 border border-white/20'}`}
                >
                  {addedSize === size ? '✓' : size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-black text-slate-900 tracking-tight">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          <div className="flex gap-2">
            <Link
              to={`/products/${product.id}`}
              title="Смотреть товар"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <Eye size={15} />
            </Link>
            <button
              onClick={() => sizes[0] && addItem(product, 1, sizes[0], firstColor)}
              disabled={product.stock === 0}
              title="Добавить в корзину"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-500 hover:bg-violet-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
