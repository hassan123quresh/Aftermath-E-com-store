import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider } from './StoreContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import LoadingScreen from './components/LoadingScreen';

// Lazy Load Pages to split bundles and reduce initial load time
const Home = React.lazy(() => import('./pages/Home'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Collection = React.lazy(() => import('./pages/Collection'));
const Contact = React.lazy(() => import('./pages/Contact'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = React.lazy(() => import('./pages/AdminProducts'));
const AdminOrders = React.lazy(() => import('./pages/AdminOrders'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const RefundPolicy = React.lazy(() => import('./pages/RefundPolicy'));
const ShippingPolicy = React.lazy(() => import('./pages/ShippingPolicy'));

// Wrapper for Storefront routes to include standard Layout
const StorefrontRoute = ({ children }: { children?: React.ReactNode }) => (
  <Layout>{children}</Layout>
);

// Wrapper for Admin routes to include AdminLayout
const AdminRoute = ({ children }: { children?: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);

// Minimal fallback loader for route transitions using the new logo
// Updated: Larger size, positioned at the top with padding
const PageLoader = () => (
  <div className="w-full min-h-[60vh] flex justify-center pt-32 md:pt-40">
     <img 
        src="https://res.cloudinary.com/dacyy7rkn/image/upload/v1766566500/589657275_17854363365582984_3626859287362746756_n_bf4ekc.jpg" 
        alt="Loading..." 
        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover animate-pulse shadow-xl"
     />
  </div>
);

// Component to handle scroll restoration on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Instant scroll to avoid visual lag during loading
    });
  }, [pathname]);

  return null;
};

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
        Rendered immediately behind the loader.
        Suspense ensures that code-split chunks load gracefully.
      */}
      <HashRouter>
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            {/* Public Storefront */}
            <Route path="/" element={
              <StorefrontRoute>
                <Home />
              </StorefrontRoute>
            } />
            <Route path="/collection" element={
              <StorefrontRoute>
                <Suspense fallback={<PageLoader />}>
                  <Collection />
                </Suspense>
              </StorefrontRoute>
            } />
            <Route path="/product/:id" element={
              <StorefrontRoute>
                <Suspense fallback={<PageLoader />}>
                  <ProductDetail />
                </Suspense>
              </StorefrontRoute>
            } />
            <Route path="/checkout" element={
              <StorefrontRoute>
                <Suspense fallback={<PageLoader />}>
                  <Checkout />
                </Suspense>
              </StorefrontRoute>
            } />
            <Route path="/contact" element={
              <StorefrontRoute>
                <Suspense fallback={<PageLoader />}>
                  <Contact />
                </Suspense>
              </StorefrontRoute>
            } />
            <Route path="/privacy" element={
              <StorefrontRoute>
                <Suspense fallback={<PageLoader />}>
                  <PrivacyPolicy />
                </Suspense>
              </StorefrontRoute>
            } />
            <Route path="/returns" element={
              <StorefrontRoute>
                <Suspense fallback={<PageLoader />}>
                  <RefundPolicy />
                </Suspense>
              </StorefrontRoute>
            } />
            <Route path="/shipping" element={
              <StorefrontRoute>
                <Suspense fallback={<PageLoader />}>
                  <ShippingPolicy />
                </Suspense>
              </StorefrontRoute>
            } />
            
            {/* Admin Panel */}
            <Route path="/admin" element={
              <AdminRoute>
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboard />
                </Suspense>
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <Suspense fallback={<PageLoader />}>
                  <AdminProducts />
                </Suspense>
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <Suspense fallback={<PageLoader />}>
                  <AdminOrders />
                </Suspense>
              </AdminRoute>
            } />
            <Route path="/admin/discounts" element={
              <AdminRoute>
                <div className="text-2xl font-serif p-12">Discount Management Coming Soon.</div>
              </AdminRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;