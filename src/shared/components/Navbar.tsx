import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useAuthStore, useCartStore, useFavoritesStore } from '../../store/stores';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const cartItems = useCartStore(s => s.items);
  const favItems = useFavoritesStore(s => s.items);
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/products', label: 'Каталог' },
    { to: '/products?gender=men', label: 'Мужское' },
    { to: '/products?gender=women', label: 'Женское' },
    { to: '/delivery', label: 'Доставка' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-black/50' : 'bg-slate-950/80 backdrop-blur-md'}`}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-indigo-500 rounded-sm flex items-center justify-center group-hover:bg-violet-500 transition-colors">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-white font-black text-xl tracking-widest uppercase">StyleShop</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className="text-slate-400 hover:text-white text-sm font-medium tracking-wider uppercase transition-colors duration-200 relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1">
            {isAdmin && (
              <Link to="/admin" className="p-2.5 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-all duration-200">
                <Shield size={20} />
              </Link>
            )}
            <Link to="/favorites" className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <Heart size={20} />
              {favItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-violet-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {favItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="hidden lg:flex p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} title="Выйти" className="hidden lg:flex p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="hidden lg:flex items-center gap-2 ml-2 px-4 py-2 bg-indigo-500 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 tracking-wide">
                Войти
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 text-slate-400 hover:text-white transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-950/98 backdrop-blur-xl border-t border-slate-800">
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className="text-slate-300 hover:text-white text-lg font-medium py-2 border-b border-slate-800/50 tracking-wide">
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-slate-300 hover:text-white text-lg font-medium py-2">Мои заказы</Link>
                <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300 text-lg font-medium py-2">Выйти</button>
              </>
            ) : (
              <Link to="/login" className="mt-2 py-3 bg-indigo-500 text-white text-center font-semibold rounded-lg">Войти</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
