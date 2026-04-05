import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productService, categoryService } from '../services/services';
import ProductCard from '../shared/components/ProductCard';
import type { ProductFilter } from '../types';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<ProductFilter>({
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    gender: searchParams.get('gender') || undefined,
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', filter],
    queryFn: () => productService.getAll(filter),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const resetFilters = () => setFilter({ search: '' });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Каталог</h1>
            <p className="text-gray-500 mt-1">{products?.length ?? 0} товаров найдено</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Фильтры
          </button>
        </div>

        <div className="flex gap-8">

          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-64 shrink-0`}>
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 sticky top-24">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Фильтры</h3>
                <button onClick={resetFilters} className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                  <X size={12} /> Сбросить
                </button>
              </div>

              {/* Search */}
              <div>
                <label htmlFor="filter-search" className="text-sm font-medium text-gray-700 block mb-2">Поиск</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="filter-search"
                    type="text"
                    placeholder="Название товара..."
                    value={filter.search || ''}
                    onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>

              {/* Пол */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Пол</label>
                <div className="space-y-2">
                  {[
                    { value: '', label: 'Все' },
                    { value: 'men', label: 'Мужчины' },
                    { value: 'women', label: 'Женщины' },
                    { value: 'kids', label: 'Дети' },
                  ].map(g => (
                    <label key={g.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g.value}
                        checked={(filter.gender ?? '') === g.value}
                        onChange={() => setFilter(f => ({ ...f, gender: g.value || undefined }))}
                        className="text-emerald-600"
                      />
                      <span className="text-sm text-gray-600">{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Категория */}
              <div>
                <label htmlFor="filter-category" className="text-sm font-medium text-gray-700 block mb-2">Категория</label>
                <select
                  id="filter-category"
                  value={filter.categoryId ?? ''}
                  onChange={e => setFilter(f => ({ ...f, categoryId: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <option value="">Все</option>
                  {(categories ?? []).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Цена */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Цена (₽)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Мин"
                    title="Минимальная цена"
                    value={filter.minPrice ?? ''}
                    onChange={e => setFilter(f => ({ ...f, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                  <input
                    type="number"
                    placeholder="Макс"
                    title="Максимальная цена"
                    value={filter.maxPrice ?? ''}
                    onChange={e => setFilter(f => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-1/2 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-lg font-medium">Товары не найдены</p>
                <p className="text-sm mt-2">Попробуйте другие фильтры</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(products ?? []).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
