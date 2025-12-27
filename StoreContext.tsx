import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order, PromoCode, StoreContextType, ToastData, ToastAction, BlogPost, Customer, Review } from './types';
import { MOCK_PRODUCTS, MOCK_ORDERS, INITIAL_PROMOS, INITIAL_ANNOUNCEMENT, MOCK_BLOG_POSTS, MOCK_CUSTOMERS, MOCK_REVIEWS } from './constants';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  // Extract initial categories from mock products
  const [categories, setCategories] = useState<string[]>(Array.from(new Set(MOCK_PRODUCTS.map(p => p.category))));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [promos, setPromos] = useState<PromoCode[]>(INITIAL_PROMOS);
  const [announcementText, setAnnouncementText] = useState(INITIAL_ANNOUNCEMENT);
  
  // Blog State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);

  // Customer State
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  // Review State
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  // Toast State
  const [toast, setToast] = useState<ToastData | null>(null);

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: string, size: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId && item.selectedSize === size) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    
    // Add new order
    setOrders(prev => [newOrder, ...prev]);
    
    // Clear Cart
    setCart([]);
    
    // Update Product Stock (Size Specific)
    setProducts(prevProducts => {
      return prevProducts.map(product => {
        // Find items in the order that match this product
        const orderedItems = orderData.items.filter(item => item.id === product.id);

        if (orderedItems.length > 0) {
          // Clone inventory to avoid mutation
          const newInventory = product.inventory.map(variant => {
             // Check if this variant (size) was ordered
             const orderedVariant = orderedItems.find(item => item.selectedSize === variant.size);
             if (orderedVariant) {
                 return { ...variant, stock: Math.max(0, variant.stock - orderedVariant.quantity) };
             }
             return variant;
          });

          const totalStock = newInventory.reduce((acc, v) => acc + v.stock, 0);

          return {
            ...product,
            inventory: newInventory,
            inStock: totalStock > 0
          };
        }
        return product;
      });
    });
    
    // Update or Create Customer
    const normalizedPhone = orderData.customerPhone.replace(/\D/g, '');
    setCustomers(prev => {
        const existingIndex = prev.findIndex(c => c.phone.replace(/\D/g, '') === normalizedPhone);
        if (existingIndex >= 0) {
            const updated = [...prev];
            const cust = updated[existingIndex];
            updated[existingIndex] = {
                ...cust,
                ordersCount: cust.ordersCount + 1,
                totalSpend: cust.totalSpend + orderData.total,
                lastOrderDate: newOrder.date,
                // Update address if it's the newest one
                address: orderData.address,
                city: orderData.city
            };
            return updated;
        } else {
             const newCustomer: Customer = {
                 id: `CUST-${Date.now()}`,
                 name: orderData.customerName,
                 email: orderData.customerEmail,
                 phone: orderData.customerPhone,
                 address: orderData.address,
                 city: orderData.city,
                 ordersCount: 1,
                 totalSpend: orderData.total,
                 lastOrderDate: newOrder.date,
                 joinedDate: newOrder.date,
                 isDHA: orderData.address.toLowerCase().includes('dha') || orderData.address.toLowerCase().includes('defence')
             };
             return [newCustomer, ...prev];
        }
    });
  };

  const validatePromo = (code: string): number => {
    const promo = promos.find(p => p.code === code && p.isActive);
    if (!promo) return 0;
    if (promo.usageLimit !== -1 && promo.usedCount >= promo.usageLimit) return 0;
    return promo.discountPercentage / 100;
  };

  // Toast Logic
  const showToast = (message: string, actions?: ToastAction[]) => {
    const id = Date.now();
    setToast({ message, actions, id });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const hideToast = () => setToast(null);

  // Admin Actions
  const addProduct = (product: Product) => setProducts(prev => [product, ...prev]);
  const updateProduct = (product: Product) => setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  const updateProducts = (updatedProducts: Product[]) => {
      setProducts(prev => {
          const updatesMap = new Map(updatedProducts.map(p => [p.id, p]));
          return prev.map(p => updatesMap.has(p.id) ? updatesMap.get(p.id)! : p);
      });
  };
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  
  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const togglePromo = (code: string) => {
    setPromos(prev => prev.map(p => p.code === code ? { ...p, isActive: !p.isActive } : p));
  };
  
  const addPromo = (promo: PromoCode) => {
      setPromos(prev => [...prev, promo]);
  };

  const deletePromo = (code: string) => {
      setPromos(prev => prev.filter(p => p.code !== code));
  };

  const addCategory = (category: string) => {
      if (!categories.includes(category)) {
          setCategories(prev => [...prev, category]);
      }
  };

  const deleteCategory = (category: string) => {
      setCategories(prev => prev.filter(c => c !== category));
  };
  
  const updateAnnouncementText = (text: string) => setAnnouncementText(text);

  // Blog Actions
  const addPost = (post: BlogPost) => setBlogPosts(prev => [post, ...prev]);
  const updatePost = (post: BlogPost) => setBlogPosts(prev => prev.map(p => p.id === post.id ? post : p));
  const deletePost = (id: string) => setBlogPosts(prev => prev.filter(p => p.id !== id));

  // Customer Actions
  const addCustomer = (customer: Customer) => setCustomers(prev => [customer, ...prev]);
  const updateCustomer = (customer: Customer) => setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
  const deleteCustomer = (id: string) => setCustomers(prev => prev.filter(c => c.id !== id));

  // Review Actions
  const addReview = (review: Review) => setReviews(prev => [review, ...prev]);
  const deleteReview = (id: string) => setReviews(prev => prev.filter(r => r.id !== id));

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      cart,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleCart,
      orders,
      placeOrder,
      promos,
      validatePromo,
      addProduct,
      updateProduct,
      updateProducts,
      deleteProduct,
      updateOrderStatus,
      togglePromo,
      addPromo,
      deletePromo,
      addCategory,
      deleteCategory,
      announcementText,
      updateAnnouncementText,
      toast,
      showToast,
      hideToast,
      blogPosts,
      addPost,
      updatePost,
      deletePost,
      customers,
      addCustomer,
      deleteCustomer,
      updateCustomer,
      reviews,
      addReview,
      deleteReview
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};