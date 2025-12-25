import React, { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { Calendar, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
  const { orders, products } = useStore();
  const [dateRange, setDateRange] = useState<'7' | '30' | 'all'>('7');

  // Helper to filter orders by date
  const filteredOrders = useMemo(() => {
    const now = new Date();
    if (dateRange === 'all') return orders;

    const days = parseInt(dateRange);
    const cutoff = new Date(now.setDate(now.getDate() - days));

    return orders.filter(order => new Date(order.date) >= cutoff);
  }, [orders, dateRange]);

  // Metrics
  const totalSales = filteredOrders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Chart Data: Sales Trend (Line/Area)
  const salesTrendData = useMemo(() => {
    const grouped: Record<string, number> = {};
    // Sort orders by date
    const sorted = [...filteredOrders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach(order => {
      // Format date as MM-DD
      const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      grouped[date] = (grouped[date] || 0) + order.total;
    });

    return Object.keys(grouped).map(date => ({ name: date, sales: grouped[date] }));
  }, [filteredOrders]);

  // Chart Data: Sales by Category (Pie)
  const categoryData = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredOrders.forEach(order => {
        order.items.forEach(item => {
            grouped[item.category] = (grouped[item.category] || 0) + (item.price * item.quantity);
        });
    });
    return Object.keys(grouped).map(cat => ({ name: cat, value: grouped[cat] }));
  }, [filteredOrders]);

  // Chart Data: Top Products (Bar)
  const topProductsData = useMemo(() => {
     const grouped: Record<string, number> = {};
     filteredOrders.forEach(order => {
         order.items.forEach(item => {
             grouped[item.name] = (grouped[item.name] || 0) + item.quantity;
         });
     });
     return Object.keys(grouped)
        .map(name => ({ name: name.length > 20 ? name.substring(0, 20) + '...' : name, count: grouped[name] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
  }, [filteredOrders]);

  const COLORS = ['#141414', '#57534e', '#a8a29e', '#d6d3d1', '#e7e5e4'];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif mb-2">Dashboard</h1>
          <p className="text-stone-500 text-sm">Real-time insights and performance metrics.</p>
        </div>
        
        {/* Date Filter */}
        <div className="flex bg-white border border-stone-200 rounded-lg p-1">
            <button 
                onClick={() => setDateRange('7')}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${dateRange === '7' ? 'bg-obsidian text-white' : 'text-stone-500 hover:text-obsidian'}`}
            >
                Last 7 Days
            </button>
            <button 
                onClick={() => setDateRange('30')}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${dateRange === '30' ? 'bg-obsidian text-white' : 'text-stone-500 hover:text-obsidian'}`}
            >
                Last 30 Days
            </button>
            <button 
                onClick={() => setDateRange('all')}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${dateRange === 'all' ? 'bg-obsidian text-white' : 'text-stone-500 hover:text-obsidian'}`}
            >
                All Time
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-stone-200 shadow-sm rounded-xl flex items-center gap-4">
            <div className="p-3 bg-stone-100 rounded-full">
                <DollarSign className="w-6 h-6 text-obsidian" />
            </div>
            <div>
                <h3 className="text-xs uppercase tracking-widest opacity-50 mb-1">Total Revenue</h3>
                <p className="text-2xl font-serif">PKR {totalSales.toLocaleString()}</p>
            </div>
        </div>
        <div className="bg-white p-6 border border-stone-200 shadow-sm rounded-xl flex items-center gap-4">
            <div className="p-3 bg-stone-100 rounded-full">
                <ShoppingBag className="w-6 h-6 text-obsidian" />
            </div>
            <div>
                <h3 className="text-xs uppercase tracking-widest opacity-50 mb-1">Total Orders</h3>
                <p className="text-2xl font-serif">{totalOrders}</p>
            </div>
        </div>
        <div className="bg-white p-6 border border-stone-200 shadow-sm rounded-xl flex items-center gap-4">
            <div className="p-3 bg-stone-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-obsidian" />
            </div>
            <div>
                <h3 className="text-xs uppercase tracking-widest opacity-50 mb-1">Avg. Order Value</h3>
                <p className="text-2xl font-serif">PKR {avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Trend */}
          <div className="lg:col-span-2 bg-white p-8 border border-stone-200 shadow-sm rounded-xl">
              <h3 className="font-serif text-lg mb-8">Sales Trend</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesTrendData}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                        <XAxis dataKey="name" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#141414', color: '#fff', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ stroke: '#a8a29e' }}
                        />
                        <Area type="monotone" dataKey="sales" stroke="#141414" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-8 border border-stone-200 shadow-sm rounded-xl">
              <h3 className="font-serif text-lg mb-8">Sales by Category</h3>
              <div className="h-[300px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#141414', color: '#fff', border: 'none', borderRadius: '8px' }}
                             itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                 </ResponsiveContainer>
                 {/* Legend */}
                 <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {categoryData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1 text-[10px] uppercase">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span>{entry.name}</span>
                        </div>
                    ))}
                 </div>
              </div>
          </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-8 border border-stone-200 shadow-sm rounded-xl">
          <h3 className="font-serif text-lg mb-8">Top Selling Products</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e5e5" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#141414" fontSize={11} tickLine={false} axisLine={false} width={150} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#141414', color: '#fff', border: 'none', borderRadius: '8px' }}
                        cursor={{fill: '#f5f5f4'}}
                    />
                    <Bar dataKey="count" fill="#141414" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;