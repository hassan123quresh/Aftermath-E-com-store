import React from 'react';
import { useStore } from '../StoreContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { orders } = useStore();

  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Mock data generation based on orders
  const data = [
    { name: 'Mon', sales: 40000 },
    { name: 'Tue', sales: 30000 },
    { name: 'Wed', sales: 20000 },
    { name: 'Thu', sales: 27800 },
    { name: 'Fri', sales: 18900 },
    { name: 'Sat', sales: 23900 },
    { name: 'Sun', sales: 34900 },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif mb-2">Overview</h1>
        <p className="text-stone-500 text-sm">Welcome back, Administrator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-none border border-stone-200 shadow-sm">
            <h3 className="text-xs uppercase tracking-widest opacity-50 mb-2">Total Revenue</h3>
            <p className="text-3xl font-medium">PKR {totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-none border border-stone-200 shadow-sm">
            <h3 className="text-xs uppercase tracking-widest opacity-50 mb-2">Total Orders</h3>
            <p className="text-3xl font-medium">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-none border border-stone-200 shadow-sm">
            <h3 className="text-xs uppercase tracking-widest opacity-50 mb-2">Avg. Order Value</h3>
            <p className="text-3xl font-medium">PKR {avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      <div className="bg-white p-8 border border-stone-200 shadow-sm">
          <h3 className="font-medium mb-8">Revenue Trends (This Week)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="name" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#141414', color: '#fff', border: 'none' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{fill: '#f5f5f4'}}
                    />
                    <Bar dataKey="sales" fill="#141414" barSize={40} radius={[0, 0, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;