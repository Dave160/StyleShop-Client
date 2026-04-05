// Auth 

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'User' | 'Admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

//  Category 

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
}

//  Product 

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  availableSizes?: string;   // "XS,S,M,L,XL"
  availableColors?: string;  // "Noir,Blanc,Rouge"
  gender: 'men' | 'women' | 'kids';
  categoryId: number;
  categoryName: string;
  createdAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  availableSizes?: string;
  availableColors?: string;
  gender: string;
  categoryId: number;
}

export interface ProductFilter {
  categoryId?: number;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

//  Cart 

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

//  Order 

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  selectedSize?: string;
  selectedColor?: string;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  totalPrice: number;
  status: number;
  statusName: OrderStatus;
  shippingAddress?: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface CreateOrderDto {
  shippingAddress?: string;
  notes?: string;
  items: {
    productId: number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
  }[];
}

//  API 

export interface ApiError {
  message: string;
}
