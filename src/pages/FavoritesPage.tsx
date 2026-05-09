import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '../store/stores';
import ProductCard from '../shared/components/ProductCard';

export default function FavoritesPage() {
  const { items } = useFavoritesStore();

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-10">
        <div className="mb-10">
          <p className="text-indigo-500 font-semibold text-sm tracking-[0.3em] uppercase mb-1">StyleShop</p>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Избранное</h1>
          <p className="text-slate-500 mt-1 text-sm">{items.length} товаров</p>
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center">
              <Heart size={40} className="text-violet-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-700">Список избранного пуст</h2>
            <p className="text-slate-400">Нажмите ♥ на товаре, чтобы добавить его сюда</p>
            <Link to="/products" className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-violet-500 transition-colors">
              Перейти в каталог
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} stagger />)}
          </div>
        )}
      </div>

      <footer className="bg-slate-950 border-t border-slate-800/50 py-10 mt-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">
          © 2026 StyleShop · Интернет-магазин одежды
        </div>
      </footer>
    </div>
  );
}
