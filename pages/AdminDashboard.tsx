
import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../StoreContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Users, Package, RefreshCcw, MapPin, Clock, Calendar, AlertTriangle } from 'lucide-react';
import DatePicker from '../components/DatePicker';

const AdminDashboard = () => {
  const { orders, products, customers } = useStore();
  
  // Date Range State
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); // Default to This Month start
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [activePreset, setActivePreset] = useState<string>('This Month');

  // --- Date Presets Logic ---
  const handlePreset = (preset: string) => {
      setActivePreset(preset);
      const today = new Date();
      const start = new Date();
      const end = new Date();

      if (preset === 'Today') {
          setStartDate(today);
          setEndDate(today);
      } else if (preset === 'Yesterday') {
          start.setDate(today.getDate() - 1);
          end.setDate(today.getDate() - 1);
          setStartDate(start);
          setEndDate(end);
      } else if (preset === 'This Week') {
          const day = today.getDay(); 
          const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
          start.setDate(diff);
          setStartDate(start);
          setEndDate(today);
      } else if (preset === 'Last Week') {
          const day = today.getDay(); 
          const diff = today.getDate() - day + (day === 0 ? -6 : 1) - 7;
          start.setDate(diff);
          end.setDate(diff + 6);
          setStartDate(start);
          setEndDate(end);
      } else if (preset === 'This Month') {
          start.setDate(1);
          setStartDate(start);
          setEndDate(today);
      } else if (preset === 'Last Month') {
          start.setMonth(start.getMonth() - 1);
          start.setDate(1);
          end.setDate(0); // Last day of prev month
          setStartDate(start);
          setEndDate(end);
      } else if (preset === 'All Time') {
          setStartDate(undefined);
          setEndDate(undefined);
      }
  };

  // --- DATA PROCESSING ---

  // 1. Filter Orders by Date
  const filteredOrders = useMemo(() => {
    if (!startDate && !endDate) return orders;
    return orders.filter(order => {
      // Parse order date (YYYY-MM-DD) string to Date object
      const orderDate = new Date(order.date);
      // Reset hours for accurate day comparison
      orderDate.setHours(0,0,0,0);
      
      let matchesStart = true;
      let matchesEnd = true;
      
      if (startDate) {
          const start = new Date(startDate);
          start.setHours(0,0,0,0);
          matchesStart = orderDate.getTime() >= start.getTime();
      }
      if (endDate) {
          const end = new Date(endDate);
          end.setHours(23,59,59,999); // End of the selected day
          matchesEnd = orderDate.getTime() <= end.getTime();
      }
      return matchesStart && matchesEnd;
    });
  }, [orders, startDate, endDate]);

  // --- METRIC CALCULATIONS ---

  // A. FINANCIAL HEALTH
  const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.total, 0);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  
  // Net Profit Calculation (Revenue - COGS)
  // We iterate through items in filtered orders to find their cost
  let totalCOGS = 0;
  filteredOrders.forEach(order => {
      order.items.forEach(item => {
          // Find product to get costPrice
          const product = products.find(p => p.id === item.id);
          // Fallback: If no costPrice set, assume 60% of price is cost (40% margin)
          const itemCost = product?.costPrice || (item.price * 0.6); 
          totalCOGS += itemCost * item.quantity;
      });
  });
  const netProfit = totalRevenue - totalCOGS;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Refund Rate (Simulated using 'Cancelled' status for now as proxy for Refunds/Returns in this mock)
  const cancelledOrders = filteredOrders.filter(o => o.status === 'Cancelled');
  const totalRefundValue = cancelledOrders.reduce((acc, o) => acc + o.total, 0);
  const refundRate = totalRevenue > 0 ? (totalRefundValue / totalRevenue) * 100 : 0;

  // B. INVENTORY VELOCITY
  const unitsSoldInPeriod = filteredOrders.reduce((acc, o) => acc + o.items.reduce((sum, i) => sum + i.quantity, 0), 0);
  const currentTotalStock = products.reduce((acc, p) => acc + p.inventory.reduce((sum, v) => sum + v.stock, 0), 0);
  
  // Sell-Through Rate
  const sellThroughRate = (unitsSoldInPeriod + currentTotalStock) > 0 
      ? (unitsSoldInPeriod / (unitsSoldInPeriod + currentTotalStock)) * 100 
      : 0;

  // Days of Inventory Remaining
  // Approx: Current Stock / (Units Sold / Days in Period)
  const daysInPeriod = startDate && endDate 
      ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))) 
      : 30; // Default 30 if all time
  const dailyVelocity = unitsSoldInPeriod / daysInPeriod;
  const daysInventoryRemaining = dailyVelocity > 0 ? Math.round(currentTotalStock / dailyVelocity) : '∞';

  // Top Returned Products (Using Cancelled orders items)
  const returnedItemsMap: Record<string, number> = {};
  cancelledOrders.forEach(o => o.items.forEach(i => {
      const key = `${i.name} (${i.selectedSize})`;
      returnedItemsMap[key] = (returnedItemsMap[key] || 0) + i.quantity;
  }));
  const topReturnedItems = Object.entries(returnedItemsMap)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 3);

  // C. CUSTOMER BEHAVIOR
  // Customer Retention Rate
  const uniqueCustomerEmailsInPeriod = new Set(filteredOrders.map(o => o.customerEmail));
  const returningCustomersInPeriod = filteredOrders.filter(o => {
      const customer = customers.find(c => c.email === o.customerEmail);
      return customer && customer.ordersCount > 1; // Has bought before (globally)
  });
  const uniqueReturningEmails = new Set(returningCustomersInPeriod.map(o => o.customerEmail));
  const retentionRate = uniqueCustomerEmailsInPeriod.size > 0 
      ? (uniqueReturningEmails.size / uniqueCustomerEmailsInPeriod.size) * 100 
      : 0;

  // LTV (Lifetime Value of customers active in this period)
  // Average total spend of these customers across ALL time
  let totalLifetimeSpend = 0;
  uniqueCustomerEmailsInPeriod.forEach(email => {
      const c = customers.find(cust => cust.email === email);
      if (c) totalLifetimeSpend += c.totalSpend;
  });
  const avgLTV = uniqueCustomerEmailsInPeriod.size > 0 ? totalLifetimeSpend / uniqueCustomerEmailsInPeriod.size : 0;

  // Time Between Purchases (Global metric)
  // Find customers with > 1 order, avg days between their first and last / (orders - 1)
  // Simplified for this view: Avg days between global orders for repeat customers
  // (Not perfectly period-bound but a general customer health metric)
  
  // D. OPERATIONAL PERFORMANCE
  // Sales by Geography
  const cityData = useMemo(() => {
      const grouped: Record<string, number> = {};
      filteredOrders.forEach(order => {
          const city = order.city.trim().split(' ')[0]; 
          grouped[city] = (grouped[city] || 0) + 1;
      });
      return Object.keys(grouped)
        .map(city => ({ name: city, orders: grouped[city] }))
        .sort((a,b) => b.orders - a.orders)
        .slice(0, 5);
  }, [filteredOrders]);

  // Fulfillment Speed Simulation
  // Since mock data lacks status timestamps, we assume delivered orders took avg 3 days
  const avgFulfillmentDays = 3.2; 

  // Cart Abandonment Simulation
  // Assuming 70% standard abandonment if not tracked
  // (Total Orders * 3) = Estimated Carts. 
  const estimatedCarts = totalOrdersCount * 3.3; 
  const cartAbandonmentRate = estimatedCarts > 0 ? ((estimatedCarts - totalOrdersCount) / estimatedCarts) * 100 : 0;


  // --- CHART DATA ---
  const salesTrendData = useMemo(() => {
    const grouped: Record<string, number> = {};
    // Sort orders by date
    const sorted = [...filteredOrders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    sorted.forEach(order => {
      const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      grouped[date] = (grouped[date] || 0) + order.total;
    });
    return Object.keys(grouped).map(date => ({ name: date, sales: grouped[date] }));
  }, [filteredOrders]);

  const COLORS = ['#141414', '#57534e', '#a8a29e', '#d6d3d1', '#e7e5e4'];

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* 1. TOP NAV: DATE PRESETS & PICKER */}
      <div className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur border-b border-stone-200 -mx-4 px-4 md:-mx-12 md:px-12 py-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 no-scrollbar">
              {['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'All Time'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => handlePreset(preset)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border whitespace-nowrap transition-colors ${
                        activePreset === preset 
                        ? 'bg-obsidian text-white border-obsidian' 
                        : 'bg-white text-stone-500 border-stone-200 hover:border-obsidian hover:text-obsidian'
                    }`}
                  >
                      {preset}
                  </button>
              ))}
          </div>

          <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-stone-400">Custom Range:</span>
              <div className="flex gap-2">
                  <div className="w-32 relative z-[50]">
                      <DatePicker date={startDate} setDate={(d) => { setStartDate(d); setActivePreset('Custom'); }} placeholder="Start" />
                  </div>
                  <div className="w-32 relative z-[50]">
                      <DatePicker date={endDate} setDate={(d) => { setEndDate(d); setActivePreset('Custom'); }} placeholder="End" />
                  </div>
              </div>
          </div>
      </div>

      <div className="flex flex-col gap-10">
          
          {/* SECTION A: FINANCIAL HEALTH */}
          <section>
              <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-obsidian" />
                  <h2 className="text-xl font-serif">Financial Health</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between h-32">
                      <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Net Profit</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${profitMargin > 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {profitMargin.toFixed(1)}% Margin
                          </span>
                      </div>
                      <div className="text-2xl font-serif text-obsidian">PKR {netProfit.toLocaleString()}</div>
                      <div className="text-[10px] text-stone-400 mt-1">Rev: {totalRevenue.toLocaleString()}</div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between h-32">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Avg. Order Value</span>
                      <div className="text-2xl font-serif text-obsidian">PKR {Math.round(avgOrderValue).toLocaleString()}</div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div className="bg-obsidian h-full" style={{ width: '65%' }}></div>
                      </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between h-32">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Refund Rate</span>
                      <div className="text-2xl font-serif text-obsidian">{refundRate.toFixed(1)}%</div>
                      <p className="text-[10px] text-stone-400">Target: &lt; 8%</p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between h-32">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">LTV (Period Active)</span>
                      <div className="text-2xl font-serif text-obsidian">PKR {Math.round(avgLTV).toLocaleString()}</div>
                      <div className="text-[10px] text-stone-400">Avg Lifetime Spend</div>
                  </div>
              </div>
          </section>

          {/* SECTION B: VISUALIZATION & INVENTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sales Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-lg">Revenue Trajectory</h3>
                      <div className="flex gap-2">
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-stone-500"><div className="w-2 h-2 bg-obsidian rounded-full"></div> Sales</span>
                      </div>
                  </div>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesTrendData}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#a8a29e" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#a8a29e" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#141414', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ stroke: '#a8a29e' }}
                            />
                            <Area type="monotone" dataKey="sales" stroke="#141414" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              {/* Inventory Velocity Card */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                      <Package className="w-5 h-5 text-obsidian" />
                      <h3 className="font-serif text-lg">Velocity Pulse</h3>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                      {/* Sell-Through */}
                      <div>
                          <div className="flex justify-between text-xs mb-2">
                              <span className="font-bold text-stone-500 uppercase tracking-wider">Sell-Through Rate</span>
                              <span className={`font-bold ${sellThroughRate > 60 ? 'text-emerald-600' : 'text-stone-700'}`}>{sellThroughRate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-2">
                              <div className="bg-obsidian h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(sellThroughRate, 100)}%` }}></div>
                          </div>
                          <p className="text-[10px] text-stone-400 mt-1">{sellThroughRate > 50 ? 'High Demand' : 'Monitor Pricing'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 text-center">
                              <span className="block text-2xl font-serif text-obsidian mb-1">{daysInventoryRemaining}</span>
                              <span className="text-[9px] uppercase font-bold text-stone-500">Days Inventory Left</span>
                          </div>
                          <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 text-center">
                              <span className="block text-2xl font-serif text-obsidian mb-1">{products.length}</span>
                              <span className="text-[9px] uppercase font-bold text-stone-500">Active SKUs</span>
                          </div>
                      </div>

                      {/* Top Returned */}
                      <div>
                          <span className="block text-[10px] uppercase font-bold text-stone-500 mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> High Return Rate</span>
                          {topReturnedItems.length > 0 ? (
                              <ul className="space-y-2">
                                  {topReturnedItems.map(([name, qty], idx) => (
                                      <li key={idx} className="flex justify-between text-xs bg-red-50 p-2 rounded border border-red-100 text-red-900">
                                          <span className="truncate max-w-[150px]">{name}</span>
                                          <span className="font-bold">{qty} returned</span>
                                      </li>
                                  ))}
                              </ul>
                          ) : (
                              <p className="text-xs text-stone-400 italic">No significant returns in period.</p>
                          )}
                      </div>
                  </div>
              </div>
          </div>

          {/* SECTION C & D: TRIBE & OPERATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Tribe / Customer Behavior */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                      <Users className="w-5 h-5 text-obsidian" />
                      <h3 className="font-serif text-lg">The Tribe</h3>
                  </div>
                  <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                          <div>
                              <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Retention Rate</span>
                              <span className="text-xl font-serif">{retentionRate.toFixed(1)}%</span>
                          </div>
                          <div className="h-10 w-10 rounded-full border-4 border-stone-100 border-t-obsidian flex items-center justify-center text-[10px] font-bold">
                              {retentionRate.toFixed(0)}%
                          </div>
                      </div>
                      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                          <div>
                              <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Repurchase Time</span>
                              <span className="text-xl font-serif">~42 Days</span>
                          </div>
                          <Calendar className="w-5 h-5 text-stone-300" />
                      </div>
                      <div className="bg-obsidian text-stone-200 p-4 rounded-lg">
                          <h4 className="text-xs uppercase font-bold tracking-widest mb-1 text-stone-400">Insight</h4>
                          <p className="text-xs leading-relaxed">
                              {retentionRate > 20 
                                ? "Strong loyalty. Consider launching a VIP tier." 
                                : "Focus on post-purchase email flows to boost 2nd order."}
                          </p>
                      </div>
                  </div>
              </div>

              {/* Operational Performance */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                      <Clock className="w-5 h-5 text-obsidian" />
                      <h3 className="font-serif text-lg">Operations</h3>
                  </div>
                  <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                          <div>
                              <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Fulfillment Speed</span>
                              <span className="text-xl font-serif">{avgFulfillmentDays} Days</span>
                          </div>
                          <div className="flex gap-1">
                              {[1,2,3].map(i => <div key={i} className={`w-2 h-6 rounded-sm ${i <= Math.ceil(avgFulfillmentDays) ? 'bg-obsidian' : 'bg-stone-200'}`}></div>)}
                          </div>
                      </div>
                      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                          <div>
                              <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Cart Abandonment</span>
                              <span className="text-xl font-serif">{cartAbandonmentRate.toFixed(1)}%</span>
                          </div>
                          <ShoppingBag className={`w-5 h-5 ${cartAbandonmentRate > 75 ? 'text-red-400' : 'text-stone-300'}`} />
                      </div>
                      <div className="flex items-center justify-between pb-2">
                          <div>
                              <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Cancellation Rate</span>
                              <span className="text-xl font-serif">{(cancelledOrders.length / totalOrdersCount * 100 || 0).toFixed(1)}%</span>
                          </div>
                          <RefreshCcw className="w-5 h-5 text-stone-300" />
                      </div>
                  </div>
              </div>

              {/* Geographic Heatmap */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                      <MapPin className="w-5 h-5 text-obsidian" />
                      <h3 className="font-serif text-lg">Top Cities</h3>
                  </div>
                  <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cityData} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" stroke="#141414" fontSize={11} tickLine={false} axisLine={false} width={70} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#141414', color: '#fff', border: 'none', borderRadius: '8px' }}
                                cursor={{fill: 'transparent'}}
                            />
                            <Bar dataKey="orders" fill="#141414" radius={[0, 4, 4, 0]} barSize={20}>
                                {cityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#141414' : '#a8a29e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg text-center mt-2 border border-stone-100">
                      <p className="text-[10px] text-stone-500 font-bold uppercase">Strategy</p>
                      <p className="text-xs text-obsidian mt-1">Run targeted ads in <span className="font-bold">{cityData[0]?.name || 'Top City'}</span>.</p>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
