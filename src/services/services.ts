import api from './api';
import type {
  AuthResponse, LoginDto, RegisterDto,
  Product, CreateProductDto, ProductFilter,
  Category, CreateCategoryDto,
  Order, CreateOrderDto,
  User
} from '../types';

//  Auth 

export const authService = {
  login: (dto: LoginDto) =>
    api.post<AuthResponse>('/auth/login', dto).then(r => r.data),

  register: (dto: RegisterDto) =>
    api.post<AuthResponse>('/auth/register', dto).then(r => r.data),

  me: () =>
    api.get('/auth/me').then(r => r.data),
};

//  Products 

export const productService = {
  getAll: (filter?: ProductFilter) => {
    const params = new URLSearchParams();
    if (filter?.categoryId) params.append('categoryId', String(filter.categoryId));
    if (filter?.gender) params.append('gender', filter.gender);
    if (filter?.minPrice) params.append('minPrice', String(filter.minPrice));
    if (filter?.maxPrice) params.append('maxPrice', String(filter.maxPrice));
    if (filter?.search) params.append('search', filter.search);
    return api.get<Product[]>(`/products?${params}`).then(r => r.data);
  },

  getById: (id: number) =>
    api.get<Product>(`/products/${id}`).then(r => r.data),

  create: (dto: CreateProductDto) =>
    api.post<Product>('/products', dto).then(r => r.data),

  update: (id: number, dto: Partial<CreateProductDto>) =>
    api.put<Product>(`/products/${id}`, dto).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/products/${id}`),
};

//  Categories 

export const categoryService = {
  getAll: () =>
    api.get<Category[]>('/categories').then(r => r.data),

  getById: (id: number) =>
    api.get<Category>(`/categories/${id}`).then(r => r.data),

  create: (dto: CreateCategoryDto) =>
    api.post<Category>('/categories', dto).then(r => r.data),

  update: (id: number, dto: Partial<CreateCategoryDto>) =>
    api.put<Category>(`/categories/${id}`, dto).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/categories/${id}`),
};

//  Orders 

export const orderService = {
  getAll: () =>
    api.get<Order[]>('/orders').then(r => r.data),

  getMy: () =>
    api.get<Order[]>('/orders/my').then(r => r.data),

  getById: (id: number) =>
    api.get<Order>(`/orders/${id}`).then(r => r.data),

  create: (dto: CreateOrderDto) =>
    api.post<Order>('/orders', dto).then(r => r.data),

  updateStatus: (id: number, status: number) =>
    api.patch<Order>(`/orders/${id}/status`, { status }),

  delete: (id: number) =>
    api.delete(`/orders/${id}`),
};

//  Users 

export const userService = {
  getAll: () =>
    api.get<User[]>('/users').then(r => r.data),
};
