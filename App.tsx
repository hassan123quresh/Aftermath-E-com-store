import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './StoreContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Collection from './pages/Collection';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';

// Wrapper for Storefront routes to include standard Layout
const StorefrontRoute = ({ children }: { children?: React.ReactNode }) => (
  <Layout>{children}</Layout>
);

// Wrapper for Admin routes to include AdminLayout
const AdminRoute = ({ children }: { children?: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Lock body scroll while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoading]);

  return (
    <StoreProvider>
      {/* Loading Screen Overlay */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* 
        Main App Content 
        Rendered immediately behind the loader to ensure assets (WebGL, images) 
        start loading in the background for a "super fast" feel once revealed.
      */}
      <HashRouter>
        <Routes>
          {/* Public Storefront */}
          <Route path="/" element={<StorefrontRoute><Home /></StorefrontRoute>} />
          <Route path="/collection" element={<StorefrontRoute><Collection /></StorefrontRoute>} />
          <Route path="/product/:id" element={<StorefrontRoute><ProductDetail /></StorefrontRoute>} />
          <Route path="/checkout" element={<StorefrontRoute><Checkout /></StorefrontRoute>} />
          <Route path="/contact" element={<StorefrontRoute><Contact /></StorefrontRoute>} />
          <Route path="/privacy" element={<StorefrontRoute><PrivacyPolicy /></StorefrontRoute>} />
          <Route path="/returns" element={<StorefrontRoute><RefundPolicy /></StorefrontRoute>} />
          <Route path="/shipping" element={<StorefrontRoute><ShippingPolicy /></StorefrontRoute>} />
          
          {/* Admin Panel */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/discounts" element={<AdminRoute><div className="text-2xl font-serif p-12">Discount Management Coming Soon.</div></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;