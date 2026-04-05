import { Truck, Clock, MapPin, CreditCard, RotateCcw, Phone } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Доставка и оплата</h1>
        <p className="text-gray-500 mb-10">Вся информация о способах доставки и оплаты заказов</p>

        {/* Delivery methods */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Truck size={22} className="text-emerald-600" />
            Способы доставки
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Курьерская доставка',
                desc: 'Доставка курьером по адресу. Курьер свяжется с вами за 1 час до прибытия.',
                price: 'от 299 ₽',
                time: '1–3 рабочих дня',
              },
              {
                title: 'Пункт выдачи',
                desc: 'Получите заказ в ближайшем пункте выдачи СДЭК или Boxberry.',
                price: 'от 149 ₽',
                time: '2–5 рабочих дней',
              },
              {
                title: 'Почта России',
                desc: 'Доставка Почтой России по всей стране, включая отдалённые регионы.',
                price: 'от 199 ₽',
                time: '5–14 рабочих дней',
              },
              {
                title: 'Бесплатная доставка',
                desc: 'При заказе на сумму от 5 000 ₽ доставка курьером бесплатно.',
                price: 'Бесплатно',
                time: '1–3 рабочих дня',
                highlight: true,
              },
            ].map(item => (
              <div
                key={item.title}
                className={`p-4 rounded-xl border ${item.highlight ? 'border-emerald-300 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className={`font-semibold ${item.highlight ? 'text-emerald-700' : 'text-gray-800'}`}>
                    {item.title}
                  </p>
                  <span className={`text-sm font-bold ${item.highlight ? 'text-emerald-600' : 'text-gray-700'}`}>
                    {item.price}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{item.desc}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={12} />
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery zones */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <MapPin size={22} className="text-emerald-600" />
            Зоны доставки
          </h2>
          <div className="space-y-3">
            {[
              { zone: 'Москва и МО', time: '1–2 рабочих дня', price: 'от 299 ₽' },
              { zone: 'Санкт-Петербург и ЛО', time: '2–3 рабочих дня', price: 'от 299 ₽' },
              { zone: 'Города-миллионники', time: '2–4 рабочих дня', price: 'от 349 ₽' },
              { zone: 'Остальные регионы России', time: '3–7 рабочих дней', price: 'от 399 ₽' },
            ].map((row, i) => (
              <div key={row.zone} className={`flex items-center justify-between px-4 py-3 rounded-xl ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}>
                <p className="font-medium text-gray-700">{row.zone}</p>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-400">{row.time}</span>
                  <span className="font-semibold text-gray-800">{row.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <CreditCard size={22} className="text-emerald-600" />
            Способы оплаты
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Банковская карта', desc: 'Visa, Mastercard, МИР — оплата при оформлении заказа онлайн' },
              { title: 'Наличными курьеру', desc: 'Оплата наличными при получении заказа от курьера' },
              { title: 'При получении картой', desc: 'Оплата банковской картой при получении в пункте выдачи' },
            ].map(item => (
              <div key={item.title} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-semibold text-gray-800 mb-2">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Returns */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <RotateCcw size={22} className="text-emerald-600" />
            Возврат товара
          </h2>
          <div className="space-y-3">
            {[
              'Возврат товара надлежащего качества возможен в течение 14 дней с момента получения.',
              'Товар должен сохранять товарный вид, потребительские свойства, фабричные ярлыки и бирки.',
              'Для оформления возврата свяжитесь с нашей службой поддержки по телефону или email.',
              'Деньги возвращаются на карту в течение 3–10 рабочих дней после получения возврата.',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-emerald-600 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Phone size={22} />
            Служба поддержки
          </h2>
          <p className="text-indigo-100 mb-4">Остались вопросы? Мы готовы помочь!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-emerald-300 mb-1">Телефон</p>
              <p className="font-semibold">+7 (800) 555-35-35</p>
            </div>
            <div>
              <p className="text-emerald-300 mb-1">Email</p>
              <p className="font-semibold">support@styleshop.ru</p>
            </div>
            <div>
              <p className="text-emerald-300 mb-1">Режим работы</p>
              <p className="font-semibold">Пн–Пт: 9:00–20:00</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
