import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Order } from '../types';
import { Eye, Download, X, Printer, Archive, Activity, Ban } from 'lucide-react';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'cancelled'>('active');

  // Filter orders based on status
  const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status));
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled');

  const displayedOrders = activeTab === 'active' ? activeOrders : (activeTab === 'history' ? deliveredOrders : cancelledOrders);

  // Helper function to export orders to CSV
  const exportToCSV = () => {
    const headers = ["Order ID", "Date", "Customer", "Email", "Phone", "City", "Address", "Payment", "Total", "Status", "Items"];
    
    // Export ALL orders regardless of tab
    const rows = orders.map(order => [
        order.id,
        order.date,
        `"${order.customerName}"`,
        order.customerEmail,
        order.customerPhone,
        order.city,
        `"${order.address}"`,
        order.paymentMethod,
        order.total,
        order.status,
        `"${order.items.map(i => `${i.name} (${i.selectedSize}) x${i.quantity}`).join(', ')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aftermath_orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${order.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
          .logo { font-size: 32px; font-weight: bold; text-transform: uppercase; letter-spacing: 4px; color: #141414; }
          .company-info { font-size: 12px; color: #666; margin-top: 5px; }
          
          .invoice-details { text-align: right; }
          .invoice-details h1 { margin: 0; font-size: 24px; color: #141414; font-weight: 300; letter-spacing: 2px; }
          .invoice-details p { margin: 5px 0 0; font-size: 14px; color: #666; }
          
          .bill-to { margin-bottom: 40px; }
          .bill-to h3 { font-size: 12px; text-transform: uppercase; color: #888; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; letter-spacing: 1px; }
          .bill-to p { margin: 4px 0; font-size: 14px; line-height: 1.5; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          th { text-align: left; padding: 15px 10px; border-bottom: 2px solid #141414; font-size: 12px; text-transform: uppercase; color: #141414; letter-spacing: 1px; }
          td { padding: 15px 10px; border-bottom: 1px solid #eee; font-size: 14px; }
          .text-right { text-align: right; }
          
          .totals { display: flex; justify-content: flex-end; }
          .totals-box { width: 300px; background: #f9f9f9; padding: 20px; border-radius: 4px; }
          .row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; }
          .total-row { border-top: 2px solid #ccc; font-weight: bold; font-size: 16px; padding-top: 15px; margin-top: 10px; color: #141414; }
          
          .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 30px; }
          
          @media print {
            body { padding: 0; }
            .totals-box { background: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">Aftermath</div>
            <div class="company-info">
              Lahore, Pakistan<br>
              aftermathstore@hotmail.com<br>
              +92 307 9909749
            </div>
          </div>
          <div class="invoice-details">
            <h1>INVOICE</h1>
            <p><strong>#${order.id}</strong></p>
            <p>Date: ${order.date}</p>
          </div>
        </div>

        <div class="bill-to">
          <h3>Bill To</h3>
          <p><strong>${order.customerName}</strong></p>
          <p>${order.address}</p>
          <p>${order.city}</p>
          <p>${order.customerPhone}</p>
          <p>${order.customerEmail}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Size</th>
              <th class="text-right">Price</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.selectedSize}</td>
                <td class="text-right">PKR ${item.price.toLocaleString()}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">PKR ${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-box">
            <div class="row">
              <span>Subtotal</span>
              <span>PKR ${order.total.toLocaleString()}</span>
            </div>
            <div class="row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="row total-row">
              <span>Total</span>
              <span>PKR ${order.total.toLocaleString()}</span>
            </div>
            <div class="row" style="margin-top: 15px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
                <span>Payment Method</span>
                <span>${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing Aftermath. Live within.</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-2xl md:text-3xl font-serif">Order Management</h1>
            <p className="text-xs text-stone-500 mt-1">Manage active shipments and view delivery history.</p>
         </div>
         
         <div className="flex gap-4">
             {/* Tabs */}
             <div className="bg-white border border-stone-200 p-1 rounded-lg flex">
                  <button 
                      onClick={() => setActiveTab('active')}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'active' ? 'bg-obsidian text-white' : 'text-stone-500 hover:text-obsidian'}`}
                  >
                      <Activity className="w-3 h-3" /> Active ({activeOrders.length})
                  </button>
                  <button 
                      onClick={() => setActiveTab('history')}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'history' ? 'bg-obsidian text-white' : 'text-stone-500 hover:text-obsidian'}`}
                  >
                      <Archive className="w-3 h-3" /> Delivered ({deliveredOrders.length})
                  </button>
                  <button 
                      onClick={() => setActiveTab('cancelled')}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'cancelled' ? 'bg-red-900 text-white' : 'text-stone-500 hover:text-red-900'}`}
                  >
                      <Ban className="w-3 h-3" /> Cancelled ({cancelledOrders.length})
                  </button>
              </div>

             <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-emerald-700 text-white px-5 py-2.5 text-[10px] md:text-xs uppercase tracking-widest rounded-full shadow-md hover:bg-emerald-800 transition-colors"
             >
                <Download className="w-4 h-4" /> <span>Export All</span>
             </button>
         </div>
      </div>

      <div className="bg-white border border-stone-200 overflow-hidden rounded-lg shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-stone-100 text-xs uppercase tracking-widest text-stone-500">
                        <th className="p-4 font-normal">Order ID</th>
                        <th className="p-4 font-normal">Date</th>
                        <th className="p-4 font-normal">Customer</th>
                        <th className="p-4 font-normal">Status</th>
                        <th className="p-4 font-normal">Payment</th>
                        <th className="p-4 font-normal">Total</th>
                        <th className="p-4 font-normal text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedOrders.map(order => (
                        <tr key={order.id} className="border-t border-stone-100 hover:bg-stone-50 text-sm transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <td className="p-4 font-mono text-xs text-stone-600">{order.id}</td>
                            <td className="p-4 text-xs text-stone-500">{order.date}</td>
                            <td className="p-4">
                                <div className="font-medium text-sm">{order.customerName}</div>
                                <div className="text-[10px] md:text-xs text-stone-500">{order.city}</div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 text-[10px] md:text-xs uppercase tracking-wider inline-block whitespace-nowrap rounded-full ${
                                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                    order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-stone-200 text-stone-800'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="p-4 whitespace-nowrap">{order.paymentMethod === 'COD' ? 'Cash' : 'Bank Transfer'}</td>
                            <td className="p-4 whitespace-nowrap font-medium">PKR {order.total.toLocaleString()}</td>
                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <select 
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                    className="bg-white border border-stone-300 text-xs p-1 rounded focus:border-obsidian outline-none cursor-pointer"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    {displayedOrders.length === 0 && (
                        <tr>
                            <td colSpan={7} className="p-12 text-center text-stone-400 border-t border-stone-100">
                                No {activeTab} orders found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  {/* Modal Header */}
                  <div className="p-6 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
                      <div>
                          <h2 className="font-serif text-xl">Order Details</h2>
                          <p className="text-xs text-stone-500 font-mono mt-1">{selectedOrder.id}</p>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                          <X className="w-5 h-5 text-stone-600" />
                      </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 overflow-y-auto flex-1 space-y-8">
                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                              <h3 className="text-xs uppercase tracking-widest opacity-50 font-bold mb-2">Customer</h3>
                              <p className="font-medium">{selectedOrder.customerName}</p>
                              <p className="text-sm text-stone-600">{selectedOrder.customerEmail}</p>
                              <p className="text-sm text-stone-600">{selectedOrder.customerPhone}</p>
                          </div>
                          <div className="space-y-1">
                              <h3 className="text-xs uppercase tracking-widest opacity-50 font-bold mb-2">Shipping</h3>
                              <p className="text-sm text-stone-600">{selectedOrder.address}</p>
                              <p className="text-sm text-stone-600">{selectedOrder.city}</p>
                              <p className="text-sm font-medium mt-2">{selectedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                          </div>
                      </div>

                      {/* Line Items */}
                      <div>
                          <h3 className="text-xs uppercase tracking-widest opacity-50 font-bold mb-4">Items Ordered</h3>
                          <div className="border border-stone-200 rounded-lg overflow-hidden">
                              {selectedOrder.items.map((item, idx) => (
                                  <div key={idx} className="flex gap-4 p-4 border-b border-stone-100 last:border-0 items-center">
                                      <img src={item.images[0]} alt="" className="w-12 h-16 object-cover rounded bg-stone-100" />
                                      <div className="flex-1">
                                          <p className="font-medium text-sm">{item.name}</p>
                                          <p className="text-xs text-stone-500">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                                      </div>
                                      <p className="font-medium text-sm">PKR {(item.price * item.quantity).toLocaleString()}</p>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Totals */}
                      <div className="flex justify-end">
                          <div className="w-full md:w-1/2 space-y-2">
                               <div className="flex justify-between text-sm">
                                   <span className="text-stone-500">Subtotal</span>
                                   <span>PKR {selectedOrder.total.toLocaleString()}</span>
                               </div>
                               <div className="flex justify-between text-sm">
                                   <span className="text-stone-500">Shipping</span>
                                   <span>Free</span>
                               </div>
                               <div className="flex justify-between text-lg font-bold border-t border-stone-200 pt-2 mt-2">
                                   <span>Total</span>
                                   <span>PKR {selectedOrder.total.toLocaleString()}</span>
                               </div>
                          </div>
                      </div>
                  </div>
                  
                  {/* Footer Actions */}
                  <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3">
                      <button 
                         onClick={() => handlePrintInvoice(selectedOrder)}
                         className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border border-stone-300 rounded hover:bg-white transition-colors"
                      >
                          <Printer className="w-4 h-4" /> Print Invoice
                      </button>
                      <button 
                         onClick={() => setSelectedOrder(null)}
                         className="px-6 py-2 bg-obsidian text-white text-xs uppercase tracking-widest rounded hover:bg-stone-800 transition-colors"
                      >
                          Close
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminOrders;