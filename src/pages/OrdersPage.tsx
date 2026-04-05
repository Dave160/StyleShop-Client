import { useQuery } from '@tanstack/react-query';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { orderService } from '../services/services';
import type { Order } from '../types';

const STATUS_STYLES: Record<string, string> = {
  Pending:   'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped:   'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  Pending:   '⏳ Ожидает',
  Confirmed: '✅ Подтверждён',
  Shipped:   '🚚 Отправлен',
  Delivered: '📦 Доставлен',
  Cancelled: '❌ Отменён',
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const statusKey = order.statusName;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Package size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Заказ #{order.id}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[statusKey] ?? 'bg-gray-100 text-gray-600'}`}>
            {STATUS_LABELS[statusKey] ?? statusKey}
          </span>
          <span className="font-bold text-emerald-700">{order.totalPrice.toFixed(2)} ₽</span>
          {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t px-5 pb-5 pt-4 space-y-3">
          {order.shippingAddress && (
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Доставка:</span> {order.shippingAddress}
            </p>
          )}
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={item.productImage || 'https://placehold.co/60x60?text=...'}
                  alt={item.productName}
                  className="w-12 h-12 object-cover rounded-lg"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/60x60?text=...'; }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                  <p className="text-xs text-gray-400">
                    {item.quantity} × {item.unitPrice.toFixed(2)} ₽
                    {item.selectedSize && ` · ${item.selectedSize}`}
                    {item.selectedColor && ` · ${item.selectedColor}`}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-700">{item.totalPrice.toFixed(2)} ₽</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderService.getMy,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Мои заказы</h1>

        {!orders?.length ? (
          <div className="text-center py-20">
            <Package size={56} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Заказов пока нет.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
