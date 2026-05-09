import { Truck, RefreshCw, MapPin, Phone, Clock, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }
});

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <section className="bg-slate-950 py-24 px-6 lg:px-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #6366F1 0%, transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto">
          <motion.div {...fadeUp()}>
            <span className="inline-block text-indigo-400 font-semibold text-sm tracking-[0.3em] uppercase mb-4 border border-indigo-500/30 px-4 py-2 rounded-full">Сервис</span>
          </motion.div>
          <motion.h1 {...fadeUp(1)} className="text-white font-black text-5xl lg:text-6xl uppercase tracking-tight mt-4 mb-6">
            Доставка и возврат
          </motion.h1>
          <motion.p {...fadeUp(2)} className="text-slate-400 text-lg leading-relaxed">
            Доставляем товары по всей России. Быстро, безопасно и с заботой о вас.
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-16 py-20 space-y-16">
        <section>
          <motion.h2 {...fadeUp()} className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-10">Способы доставки</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: "Курьерская доставка", desc: "Доставка прямо до двери. Курьер позвонит за 30 минут до прибытия.", price: "350 ₽", time: "1–3 дня" },
              { icon: Package, title: "Пункты выдачи", desc: "Более 3000 пунктов выдачи по всей России. Работают 7 дней в неделю.", price: "150 ₽", time: "2–5 дней" },
              { icon: MapPin, title: "Почта России", desc: "Доставка в любой уголок страны. Отслеживание через трек-номер.", price: "250 ₽", time: "5–14 дней" },
            ].map(({ icon: Icon, title, desc, price, time }, i) => (
              <motion.div key={title} {...fadeUp(i + 1)}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                <div className="w-12 h-12 bg-indigo-500/10 group-hover:bg-indigo-500/20 rounded-xl flex items-center justify-center mb-5 transition-colors">
                  <Icon size={24} className="text-indigo-500" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm"><Clock size={14} className="text-indigo-400" />{time}</div>
                  <span className="font-bold text-indigo-500">{price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <motion.h2 {...fadeUp()} className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Зоны доставки и тарифы</motion.h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  {['Зона', 'Регионы', 'Срок', 'Стоимость'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-slate-500 font-bold uppercase tracking-wider text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["1", "Москва и МО", "1–2 дня", "350 ₽ / бесплатно от 5 000 ₽"],
                  ["2", "СПб и ЛО", "1–3 дня", "350 ₽ / бесплатно от 5 000 ₽"],
                  ["3", "Города-миллионники", "2–4 дня", "450 ₽ / бесплатно от 7 000 ₽"],
                  ["4", "Остальные регионы", "3–7 дней", "550 ₽ / бесплатно от 10 000 ₽"],
                ].map(([zone, region, time, price]) => (
                  <tr key={zone} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4"><span className="w-8 h-8 bg-indigo-500/10 text-indigo-600 font-bold rounded-lg flex items-center justify-center text-sm">{zone}</span></td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{region}</td>
                    <td className="py-4 px-4 text-slate-500">{time}</td>
                    <td className="py-4 px-4 text-slate-700 font-medium">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <motion.h2 {...fadeUp()} className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-10">Возврат товара</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: RefreshCw, title: "30 дней на возврат", desc: "Вы можете вернуть любой товар в течение 30 дней с момента получения. Товар должен быть в оригинальной упаковке с бирками." },
              { icon: Package, title: "Условия возврата", desc: "Товар не был в использовании. Сохранены все этикетки и упаковка. Есть товарный чек или номер заказа." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} {...fadeUp(i + 1)} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4"><Icon size={24} className="text-emerald-600" /></div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-slate-950 rounded-2xl p-8 text-center">
          <h2 className="text-white font-black text-2xl uppercase tracking-tight mb-4">Остались вопросы?</h2>
          <p className="text-slate-400 mb-8">Наша служба поддержки работает с 9:00 до 21:00 (МСК)</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:+74957771234" className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors">
              <Phone size={16} /> +7 (495) 777-12-34
            </a>
            <a href="mailto:support@styleshop.ru" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">
              support@styleshop.ru
            </a>
          </div>
        </section>
      </div>

      <footer className="bg-slate-950 border-t border-slate-800/50 py-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 text-center text-slate-500 text-sm">
          © 2026 StyleShop · Интернет-магазин одежды
        </div>
      </footer>
    </div>
  );
}
