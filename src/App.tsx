import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/stores';

import Navbar from './shared/components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryPage from './pages/DeliveryPage';
import FavoritesPage from './pages/FavoritesPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <footer className="bg-white border-t mt-16 py-8 text-center text-sm text-gray-400">
        © 2025 StyleShop · Интернет-магазин одежды
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '12px', fontSize: '14px' },
          }}
        />
        <Routes>
          {/* Public routes (with Navbar) */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/cart" element={<Layout><CartPage /></Layout>} />
          <Route path="/delivery" element={<Layout><DeliveryPage /></Layout>} />
          <Route path="/favorites" element={<Layout><FavoritesPage /></Layout>} />

          {/* Auth routes (no Navbar) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected user routes */}
          <Route path="/orders" element={
            <ProtectedRoute>
              <Layout><OrdersPage /></Layout>
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
