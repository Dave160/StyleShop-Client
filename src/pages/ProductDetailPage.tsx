import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, ArrowLeft, Tag, Package } from 'lucide-react';
import { productService } from '../services/services';
import { useCartStore } from '../store/stores';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-gray-200 rounded-2xl h-96" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Товар не найден.</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-emerald-600 hover:underline">
          ← Вернуться в каталог
        </button>
      </div>
    );
  }

  const sizes = product.availableSizes?.split(',').map(s => s.trim()) ?? [];
  const colors = product.availableColors?.split(',').map(c => c.trim()) ?? [];

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Пожалуйста, выберите размер.');
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} добавлен в корзину!`);
  };

  const genderLabel: Record<string, string> = {
    men: 'Мужчины', women: 'Женщины', kids: 'Дети',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Назад
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-sm p-6 md:p-10">
          {/* Image */}
          <div className="rounded-xl overflow-hidden bg-gray-50 h-96">
            <img
              src={product.imageUrl || 'https://placehold.co/600x600?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=No+Image'; }}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-1 rounded-full">
                {product.categoryName}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {genderLabel[product.gender] || product.gender}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-3xl font-extrabold text-emerald-700 mb-4">{product.price.toFixed(2)} ₽</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5 text-sm">
              <Package size={16} className={product.stock > 0 ? 'text-green-500' : 'text-red-400'} />
              {product.stock > 0
                ? <span className="text-green-600 font-medium">{product.stock} в наличии</span>
                : <span className="text-red-500 font-medium">Нет в наличии</span>
              }
            </div>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Tag size={14} /> Размер
                  {selectedSize && <span className="text-emerald-600">— {selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-emerald-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Цвет {selectedColor && <span className="text-emerald-600 font-normal">— {selectedColor}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`border rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        selectedColor === color
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-medium'
                          : 'border-gray-200 text-gray-600 hover:border-emerald-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Количество</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:border-emerald-400 transition-colors text-lg font-bold"
                >−</button>
                <span className="w-10 text-center font-semibold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:border-emerald-400 transition-colors text-lg font-bold"
                >+</button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="mt-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              <ShoppingCart size={20} />
              {product.stock === 0 ? 'Нет в наличии' : 'Добавить в корзину'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
