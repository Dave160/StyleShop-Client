import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Shirt, Heart } from 'lucide-react';
import { useAuthStore, useFavoritesStore } from '../../store/stores';
import { useCartStore } from '../../store/stores';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const totalItems = useCartStore(s => s.totalItems());
  const totalFavorites = useFavoritesStore(s => s.items.length);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Вы вышли из системы');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-700">
            <Shirt size={28} />
            <span>StyleShop</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/products" className="hover:text-emerald-600 transition-colors">Каталог</Link>
            <Link to="/products?gender=men" className="hover:text-emerald-600 transition-colors">Мужчины</Link>
            <Link to="/products?gender=women" className="hover:text-emerald-600 transition-colors">Женщины</Link>
            <Link to="/products?gender=kids" className="hover:text-emerald-600 transition-colors">Дети</Link>
            <Link to="/delivery" className="hover:text-emerald-600 transition-colors">Доставка</Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Favorites */}
            <Link to="/favorites" title="Избранное" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors">
              <Heart size={22} />
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                  >
                    <Settings size={18} />
                    Админ
                  </Link>
                )}
                <Link
                  to="/orders"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">{user?.firstName || user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Выйти"
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-emerald-600 font-medium"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
