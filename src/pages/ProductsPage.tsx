import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { productService, categoryService } from '../services/services';
import ProductCard from '../shared/components/ProductCard';
import type { ProductFilter } from '../types';

export default function ProductsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [search, setSearch] = useState('');
  const [gender, setGender] = useState(params.get('gender') || '');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const g = new URLSearchParams(location.search).get('gender');
    if (g) setGender(g);
  }, [location.search]);

  const filter: ProductFilter = {
    search: search || undefined,
    gender: gender || undefined,
    categoryId: categoryId ? Number(categoryId) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', filter],
    queryFn: () => productService.getAll(filter),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const clearFilters = () => { setSearch(''); setGender(''); setCategoryId(''); setMinPrice(''); setMaxPrice(''); };
  const hasFilters = !!(search || gender || categoryId || minPrice || maxPrice);

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Поиск</label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Название товара..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Пол</label>
        <div className="flex flex-col gap-2">
          {[{ v: '', l: 'Все' }, { v: 'men', l: 'Мужское' }, { v: 'women', l: 'Женское' }].map(({ v, l }) => (
            <button key={v} onClick={() => setGender(v)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${gender === v ? 'bg-indigo-500 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Категория</label>
        <div className="flex flex-col gap-2">
          <button onClick={() => setCategoryId('')}
            className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${!categoryId ? 'bg-indigo-500 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
            Все категории
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCategoryId(String(c.id))}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${categoryId === String(c.id) ? 'bg-indigo-500 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Цена (₽)</label>
        <div className="flex gap-3">
          <input value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="От" type="number"
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
          <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="До" type="number"
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
        </div>
      </div>
      {hasFilters && (
        <button onClick={clearFilters}
          className="w-full py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          <X size={14} /> Сбросить фильтры
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-indigo-500 font-semibold text-sm tracking-[0.3em] uppercase mb-1">StyleShop</p>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Каталог</h1>
            <p className="text-slate-500 mt-1 text-sm">{products.length} товаров найдено</p>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold text-sm">
            <SlidersHorizontal size={16} /> Фильтры
          </button>
        </div>

        <div className="flex gap-10">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-6">Фильтры</h2>
              <FilterSidebar />
            </div>
          </aside>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0, x: -300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -300 }}
                className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black text-slate-900 text-lg uppercase">Фильтры</h2>
                    <button onClick={() => setSidebarOpen(false)} title="Закрыть фильтры"><X size={20} className="text-slate-500" /></button>
                  </div>
                  <FilterSidebar />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-white rounded-2xl aspect-[3/4] animate-pulse" />)}
              </div>
            ) : products.length > 0 ? (
              <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} stagger />)}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Search size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Товары не найдены</h3>
                <p className="text-slate-400 mb-6">Попробуйте изменить параметры поиска</p>
                <button onClick={clearFilters} className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold">Сбросить фильтры</button>
              </motion.div>
            )}
          </main>
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
