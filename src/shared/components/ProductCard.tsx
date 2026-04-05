import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCartStore, useFavoritesStore } from '../../store/stores';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore(s => s.addItem);
  const toggle = useFavoritesStore(s => s.toggle);
  const isFavorite = useFavoritesStore(s => s.isFavorite);
  const favorite = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} добавлен в корзину!`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product);
    toast.success(favorite ? `${product.name} удалён из избранного` : `${product.name} добавлен в избранное`);
  };

  const genderBadge: Record<string, string> = {
    men: 'Мужчины',
    women: 'Женщины',
    kids: 'Дети',
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative overflow-hidden h-64 bg-gray-50">
        <img
          src={product.imageUrl || 'https://placehold.co/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image'; }}
        />
        {/* Badge пол */}
        <span className="absolute top-3 left-3 bg-white/90 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
          {genderBadge[product.gender] || product.gender}
        </span>
        {/* Мало на складе */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Осталось {product.stock}!
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Нет в наличии</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-emerald-500 font-medium mb-1">{product.categoryName}</p>
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">{product.name}</h3>

        {/* Sizes preview */}
        {product.availableSizes && (
          <div className="flex gap-1 mb-3 flex-wrap">
            {product.availableSizes.split(',').slice(0, 4).map(size => (
              <span key={size} className="text-xs border border-gray-200 rounded px-1.5 py-0.5 text-gray-500">
                {size.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">{product.price.toFixed(2)} ₽</span>

          <div className="flex gap-2">
            <button
              onClick={handleToggleFavorite}
              title={favorite ? 'Убрать из избранного' : 'В избранное'}
              className={`p-2 rounded-lg border transition-colors ${favorite ? 'border-red-300 text-red-500 hover:bg-red-50' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'}`}
            >
              <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
            </button>
            <Link
              to={`/products/${product.id}`}
              title="Смотреть товар"
              className="p-2 rounded-lg border border-gray-200 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
            >
              <Eye size={16} />
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              title="Добавить в корзину"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <ShoppingCart size={14} />
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
