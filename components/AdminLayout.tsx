
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Tag, LogOut, LayoutDashboard, BookOpen, Users } from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Tag, label: 'Discounts', path: '/admin/discounts' },
    { icon: BookOpen, label: 'Journal', path: '/admin/blog' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50 text-obsidian font-sans">
      
      {/* MOBILE TOP HEADER: Brand & Exit */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 bg-[#141414] text-stone-300 shadow-sm h-14 flex items-center justify-between px-4 border-b border-stone-800">
         <div className="flex items-center gap-3">
            <Link to="/" className="block">
                 <img 
                    src="https://res.cloudinary.com/dacyy7rkn/image/upload/f_auto,q_auto,w_800/v1766520199/aftermath_logo_1_-02_phtpip.webp" 
                    alt="Aftermath" 
                    className="h-6 w-auto object-contain invert"
                 />
            </Link>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 border-l border-stone-700 pl-3">Admin</span>
         </div>
         <Link to="/" className="p-2 -mr-2 text-stone-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
         </Link>
      </header>

      {/* MOBILE BOTTOM NAVBAR: Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#141414] text-stone-300 border-t border-stone-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <div className="flex items-center justify-between">
            {navItems.map(item => (
                <Link 
                    key={item.path}
                    to={item.path}
                    className={`flex-1 flex flex-col items-center justify-center py-3 active:bg-white/10 transition-colors ${
                        location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                        ? 'text-white bg-white/5' 
                        : 'text-stone-500 hover:text-stone-300'
                    }`}
                >
                    <item.icon className={`w-5 h-5 mb-1 ${location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'stroke-2' : 'stroke-1'}`} />
                    <span className="text-[8px] uppercase tracking-wider font-medium truncate max-w-full px-0.5">{item.label}</span>
                </Link>
            ))}
         </div>
      </nav>

      {/* DESKTOP SIDEBAR (Vertical) - Explicitly Black */}
      <aside className="hidden md:flex w-64 bg-[#141414] text-stone-300 flex-col fixed inset-y-0 z-50">
        <div className="p-8">
           <Link to="/" className="block mb-4">
                <img 
                    src="https://res.cloudinary.com/dacyy7rkn/image/upload/f_auto,q_auto,w_800/v1766520199/aftermath_logo_1_-02_phtpip.webp" 
                    alt="Aftermath" 
                    className="h-12 w-auto object-contain invert"
                />
           </Link>
           <span className="text-xs uppercase tracking-widest opacity-50">Admin Panel</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
            {navItems.map(item => (
                <Link 
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors ${
                        location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                        ? 'bg-stone-800 text-white' 
                        : 'hover:bg-stone-900 hover:text-white'
                    }`}
                >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                </Link>
            ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
             <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-stone-400 hover:text-white">
                <LogOut className="w-4 h-4" />
                Back to Store
             </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 pb-24 md:py-12 p-4 md:p-12 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
