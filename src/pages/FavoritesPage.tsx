import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useFavoritesStore } from '../store/stores';
import ProductCard from '../shared/components/ProductCard';

export default function FavoritesPage() {
  const items = useFavoritesStore(s => s.items);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={24} className="text-red-500" fill="currentColor" />
          <h1 className="text-2xl font-bold text-gray-800">Избранное</h1>
          {items.length > 0 && (
            <span className="text-sm text-gray-400">{items.length} товар{items.length > 1 ? 'а' : ''}</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Список избранного пуст</h2>
            <p className="text-gray-400 mb-6">Нажмите на сердечко на карточке товара, чтобы добавить его сюда.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Смотреть каталог <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
