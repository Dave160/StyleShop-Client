import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, CartItem, Product } from '../types';


// FAVORITES STORE

interface FavoritesState {
  items: Product[];
  toggle: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some(p => p.id === product.id);
        set(state => ({
          items: exists
            ? state.items.filter(p => p.id !== product.id)
            : [...state.items, product],
        }));
      },
      isFavorite: (productId: number) => get().items.some(p => p.id === productId),
    }),
    { name: 'favorites-storage' }
  )
);


// AUTH STORE

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, isAdmin: user.role === 'Admin' });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
      },
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);


// CART STORE

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, selectedSize, selectedColor) => {
        const existing = get().items.find(
          i => i.product.id === product.id &&
               i.selectedSize === selectedSize &&
               i.selectedColor === selectedColor
        );
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.product.id === product.id &&
              i.selectedSize === selectedSize &&
              i.selectedColor === selectedColor
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          }));
        } else {
          set(state => ({
            items: [...state.items, { product, quantity, selectedSize, selectedColor }]
          }));
        }
      },

      removeItem: (productId) =>
        set(state => ({ items: state.items.filter(i => i.product.id !== productId) })),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
          )
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
