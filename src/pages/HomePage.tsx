import { Link } from 'react-router-dom';
import { ArrowRight, Truck, RefreshCw, CreditCard, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { productService, categoryService } from '../services/services';
import ProductCard from '../shared/components/ProductCard';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  })
};

const categoryImages: Record<string, string> = {
  men: "https://images.unsplash.com/photo-1550246140-29f40b909e5a?w=900&q=80",
  women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80",
};

const categoryLabels: Record<string, string> = {
  men: "Мужская одежда",
  women: "Женская одежда",
};

export default function HomePage() {
  const { data: products } = useQuery({
    queryKey: ['products', 'home'],
    queryFn: () => productService.getAll(),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const featured = products?.slice(0, 8) ?? [];

  return (
    <div className="bg-slate-50">

      {/* HERO */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-16 w-full">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block text-indigo-400 font-semibold text-sm tracking-[0.3em] uppercase mb-6 border border-indigo-500/30 px-4 py-2 rounded-full backdrop-blur-sm bg-indigo-500/10">
              Новая коллекция 2026
            </span>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={fadeUp}
            className="text-white font-black text-5xl md:text-7xl lg:text-8xl leading-none uppercase tracking-tight max-w-3xl"
          >
            СТИЛЬ<br />
            <span className="text-indigo-400">БЕЗ</span><br />
            ГРАНИЦ
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" custom={2} variants={fadeUp}
            className="text-slate-300 text-lg mt-8 max-w-lg leading-relaxed"
          >
            Откройте для себя мир моды с StyleShop. Одежда для мужчин и женщин — от классики до современных трендов.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" custom={3} variants={fadeUp}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link
              to="/products"
              className="group flex items-center gap-3 px-8 py-4 bg-indigo-500 hover:bg-violet-500 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-violet-500/40"
            >
              Смотреть каталог
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/products?gender=women"
              className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold text-lg rounded-xl border border-white/20 transition-all duration-300"
            >
              Женская коллекция
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-slate-400 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 max-w-screen-2xl mx-auto px-6 lg:px-16">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="mb-14"
        >
          <p className="text-indigo-500 font-semibold text-sm tracking-[0.3em] uppercase mb-3">Коллекции</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight">Каталог</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(categories ?? []).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial="hidden" whileInView="visible" custom={i}
              viewport={{ once: true }} variants={fadeUp}
            >
              <Link
                to={`/products?gender=${cat.slug}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[16/9]"
              >
                <img
                  src={categoryImages[cat.slug] ?? `https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80`}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-white font-black text-3xl uppercase tracking-tight mb-2">
                    {categoryLabels[cat.slug] ?? cat.name}
                  </h3>
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm group-hover:gap-4 transition-all">
                    Смотреть коллекцию <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="py-24 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="flex items-end justify-between mb-14"
          >
            <div>
              <p className="text-indigo-500 font-semibold text-sm tracking-[0.3em] uppercase mb-3">Новинки</p>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight">
                Последние поступления
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-indigo-500 hover:text-violet-500 font-semibold transition-colors"
            >
              Все товары <ArrowRight size={18} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial="hidden" whileInView="visible" custom={i}
                viewport={{ once: true }} variants={fadeUp}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex justify-center md:hidden">
            <Link to="/products" className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-xl">
              Все товары
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
              Почему StyleShop?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Быстрая доставка", desc: "Доставка по всей России от 1 до 5 дней. Бесплатно при заказе от 5 000 ₽" },
              { icon: RefreshCw, title: "Лёгкий возврат", desc: "Возврат в течение 30 дней без вопросов. Полный возврат средств" },
              { icon: CreditCard, title: "Безопасная оплата", desc: "Оплата картой, наличными или онлайн. Все данные защищены" },
              { icon: Shield, title: "Гарантия качества", desc: "Только оригинальные товары от проверенных производителей" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial="hidden" whileInView="visible" custom={i}
                viewport={{ once: true }} variants={fadeUp}
                className="group p-8 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 rounded-2xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-indigo-500/20 group-hover:bg-indigo-500/30 rounded-xl flex items-center justify-center mb-6 transition-colors">
                  <Icon size={26} className="text-indigo-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/50 py-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">
          © 2026 StyleShop · Интернет-магазин одежды
        </div>
      </footer>
    </div>
  );
}
