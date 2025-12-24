import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order, PromoCode, StoreContextType, ToastData } from './types';
import { MOCK_PRODUCTS, MOCK_ORDERS, INITIAL_PROMOS, INITIAL_ANNOUNCEMENT } from './constants';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [promos, setPromos] = useState<PromoCode[]>(INITIAL_PROMOS);
  const [announcementText, setAnnouncementText] = useState(INITIAL_ANNOUNCEMENT);
  
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
    // Removed automatic setIsCartOpen(true) here to allow custom handling via Toast
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
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const validatePromo = (code: string): number => {
    const promo = promos.find(p => p.code === code && p.isActive);
    if (!promo) return 0;
    if (promo.usageLimit !== -1 && promo.usedCount >= promo.usageLimit) return 0;
    return promo.discountPercentage / 100;
  };

  // Toast Logic
  const showToast = (message: string, action?: { label: string; onClick: () => void }) => {
    const id = Date.now();
    setToast({ message, action, id });
    
    // Auto hide after 4 seconds
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const hideToast = () => setToast(null);

  // Admin Actions
  const addProduct = (product: Product) => setProducts(prev => [product, ...prev]);
  const updateProduct = (product: Product) => setProducts(prev => prev.map(p => p.id === product.id ? product : p));
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
  
  const updateAnnouncementText = (text: string) => setAnnouncementText(text);

  return (
    <StoreContext.Provider value={{
      products,
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
      deleteProduct,
      updateOrderStatus,
      togglePromo,
      addPromo,
      announcementText,
      updateAnnouncementText,
      toast,
      showToast,
      hideToast
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