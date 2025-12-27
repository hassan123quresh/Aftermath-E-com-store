export interface ProductVariant {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number; // For sales
  description: string; // Markdown supported
  category: string;
  images: string[];
  inventory: ProductVariant[]; // Replaces global stock and sizes array
  inStock: boolean; // Computed helper (true if any variant > 0)
  isVisible: boolean; // Admin toggle to hide/show product on frontend
  video?: string; // URL for Unboxing Experience (Bottom)
  galleryVideo?: string; // URL for Gallery Video (Beside Images)
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'COD' | 'BankTransfer';
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  ordersCount: number;
  totalSpend: number;
  lastOrderDate: string;
  joinedDate: string;
  isDHA?: boolean;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  usageLimit: number; // -1 for infinite
  usedCount: number;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  isPublished: boolean;
}

export interface AnalyticsData {
  name: string;
  sales: number;
  orders: number;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface ToastData {
  message: string;
  actions?: ToastAction[];
  id: number;
}

export interface StoreContextType {
  products: Product[];
  categories: string[];
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, delta: number) => void;
  toggleCart: () => void;
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  promos: PromoCode[];
  validatePromo: (code: string) => number; // returns discount multiplier (e.g., 0.10 for 10%)
  
  // Reviews
  reviews: Review[];
  addReview: (review: Review) => void;
  deleteReview: (id: string) => void;

  // Blog
  blogPosts: BlogPost[];
  addPost: (post: BlogPost) => void;
  updatePost: (post: BlogPost) => void;
  deletePost: (id: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  updateCustomer: (customer: Customer) => void;

  // Admin functions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  updateProducts: (products: Product[]) => void; // Bulk update
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  togglePromo: (code: string) => void;
  addPromo: (promo: PromoCode) => void;
  deletePromo: (code: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  
  // Config
  announcementText: string;
  updateAnnouncementText: (text: string) => void;

  // Toast
  toast: ToastData | null;
  showToast: (message: string, actions?: ToastAction[]) => void;
  hideToast: () => void;
}