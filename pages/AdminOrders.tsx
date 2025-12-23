import React from 'react';
import { useStore } from '../StoreContext';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-3xl font-serif">Orders</h1>

      <div className="bg-white border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                    <tr className="bg-stone-100 text-xs uppercase tracking-widest text-stone-500">
                        <th className="p-4 font-normal">Order ID</th>
                        <th className="p-4 font-normal">Customer</th>
                        <th className="p-4 font-normal">Status</th>
                        <th className="p-4 font-normal">Payment</th>
                        <th className="p-4 font-normal">Total</th>
                        <th className="p-4 font-normal">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} className="border-t border-stone-100 hover:bg-stone-50 text-sm">
                            <td className="p-4 font-mono text-xs">{order.id}</td>
                            <td className="p-4">
                                <div className="font-medium text-sm">{order.customerName}</div>
                                <div className="text-[10px] md:text-xs text-stone-500">{order.city}</div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 text-[10px] md:text-xs uppercase tracking-wider inline-block whitespace-nowrap ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-stone-200 text-stone-800'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="p-4 whitespace-nowrap">{order.paymentMethod === 'COD' ? 'Cash' : 'Bank Transfer'}</td>
                            <td className="p-4 whitespace-nowrap">PKR {order.total.toLocaleString()}</td>
                            <td className="p-4">
                                <select 
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                    className="bg-transparent border border-stone-300 text-xs p-1 focus:border-obsidian outline-none cursor-pointer"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;