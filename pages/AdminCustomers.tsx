import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../StoreContext';
import { Customer, Order } from '../types';
import { Search, Filter, ArrowUp, ArrowDown, UserPlus, Upload, Download, Trash2, X, ChevronRight, Mail, Phone, MapPin, Calendar, ShoppingBag, CreditCard } from 'lucide-react';

const AdminCustomers = () => {
  const { customers, orders, addCustomer, deleteCustomer } = useStore();
  
  // UI State
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter State
  const [statusFilter, setStatusFilter] = useState<'all' | 'vip' | 'regular' | 'new' | 'churned'>('all');
  const [spendRange, setSpendRange] = useState({ min: '', max: '' });
  const [orderRange, setOrderRange] = useState({ min: '', max: '' });
  
  // Sort State
  const [sortField, setSortField] = useState<'address' | 'ordersCount' | 'totalSpend' | 'lastOrderDate' | 'joinedDate'>('lastOrderDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Form State
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
      name: '', email: '', phone: '', address: '', city: 'Lahore', isDHA: false
  });

  // Helper: Sanitize Phone
  const sanitizePhone = (p: string) => p.replace(/[\s\-\(\)]/g, '');

  // Derived: Filtered & Sorted Customers
  const processedCustomers = useMemo(() => {
    let result = [...customers];

    // Search
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(c => 
            c.name.toLowerCase().includes(q) || 
            sanitizePhone(c.phone).includes(sanitizePhone(q)) || 
            c.address.toLowerCase().includes(q)
        );
    }

    // Status Filter
    if (statusFilter !== 'all') {
        const now = new Date();
        result = result.filter(c => {
            const daysSinceLastOrder = (now.getTime() - new Date(c.lastOrderDate).getTime()) / (1000 * 3600 * 24);
            
            if (statusFilter === 'vip') return c.totalSpend > 50000;
            if (statusFilter === 'regular') return c.ordersCount > 3;
            if (statusFilter === 'new') return c.ordersCount >= 1 && c.ordersCount <= 3;
            if (statusFilter === 'churned') return daysSinceLastOrder > 30;
            return true;
        });
    }

    // Range Filters
    if (spendRange.min) result = result.filter(c => c.totalSpend >= Number(spendRange.min));
    if (spendRange.max) result = result.filter(c => c.totalSpend <= Number(spendRange.max));
    if (orderRange.min) result = result.filter(c => c.ordersCount >= Number(orderRange.min));
    if (orderRange.max) result = result.filter(c => c.ordersCount <= Number(orderRange.max));

    // Sort
    result.sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];
        
        // Handle dates
        if (sortField === 'lastOrderDate' || sortField === 'joinedDate') {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
        }
        // Handle strings (Address/Name) - mapping address to generic sort
        if (sortField === 'address') {
             valA = a.address.toLowerCase();
             valB = b.address.toLowerCase();
        }

        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    return result;
  }, [customers, searchQuery, statusFilter, spendRange, orderRange, sortField, sortDir]);

  // Actions
  const handleSort = (field: typeof sortField) => {
      if (sortField === field) {
          setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
          setSortField(field);
          setSortDir('desc'); // Default to desc for new metrics
      }
  };

  const resetFilters = () => {
      setStatusFilter('all');
      setSpendRange({ min: '', max: '' });
      setOrderRange({ min: '', max: '' });
      setSearchQuery('');
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Phone", "Email", "Address", "City", "DHA", "Orders", "Total Spend", "Last Visit"];
    const rows = processedCustomers.map(c => [
        c.id, `"${c.name}"`, c.phone, c.email, `"${c.address}"`, c.city, c.isDHA ? 'Yes' : 'No', c.ordersCount, c.totalSpend, c.lastOrderDate
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `customers_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          const text = event.target?.result as string;
          const rows = text.split('\n').slice(1); // Skip header
          let count = 0;
          
          rows.forEach(row => {
              const cols = row.split(',');
              if (cols.length >= 5) {
                  // Basic duplicate check by phone
                  const phone = cols[2]?.trim();
                  if (phone && !customers.some(c => sanitizePhone(c.phone) === sanitizePhone(phone))) {
                      addCustomer({
                          id: `CUST-IMP-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                          name: cols[1]?.replace(/"/g, '').trim() || 'Unknown',
                          phone: phone,
                          email: cols[3]?.trim() || '',
                          address: cols[4]?.replace(/"/g, '').trim() || '',
                          city: cols[5]?.trim() || 'Lahore',
                          isDHA: (cols[4] || '').toLowerCase().includes('dha'),
                          ordersCount: 0,
                          totalSpend: 0,
                          lastOrderDate: new Date().toISOString().split('T')[0],
                          joinedDate: new Date().toISOString().split('T')[0]
                      });
                      count++;
                  }
              }
          });
          alert(`Imported ${count} new customers.`);
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addCustomer({
          ...newCustomer as Customer,
          id: `CUST-MAN-${Date.now()}`,
          ordersCount: 0,
          totalSpend: 0,
          lastOrderDate: new Date().toISOString().split('T')[0],
          joinedDate: new Date().toISOString().split('T')[0],
          isDHA: (newCustomer.address || '').toLowerCase().includes('dha') || (newCustomer.address || '').toLowerCase().includes('defence')
      });
      setShowAddModal(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '', city: 'Lahore', isDHA: false });
  };

  const handleDelete = (id: string) => {
      if(window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
          deleteCustomer(id);
          if (selectedCustomerId === id) {
              setViewMode('list');
              setSelectedCustomerId(null);
          }
      }
  };

  // ----- DETAIL VIEW LOGIC -----
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  
  // Analytics Calculation
  const getCustomerAnalytics = (c: Customer) => {
      const customerOrders = orders.filter(o => sanitizePhone(o.customerPhone) === sanitizePhone(c.phone));
      
      // Busy Day
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayCounts = new Array(7).fill(0);
      customerOrders.forEach(o => dayCounts[new Date(o.date).getDay()]++);
      const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
      const busyDay = customerOrders.length > 0 ? days[maxDayIndex] : 'N/A';

      // Favorite Item
      const itemCounts: Record<string, number> = {};
      let favItem = 'N/A';
      customerOrders.forEach(o => o.items.forEach(i => {
          itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
      }));
      const sortedItems = Object.entries(itemCounts).sort((a,b) => b[1] - a[1]);
      if (sortedItems.length > 0) favItem = sortedItems[0][0];

      // Preference (Category based)
      const catCounts: Record<string, number> = {};
      customerOrders.forEach(o => o.items.forEach(i => {
          catCounts[i.category] = (catCounts[i.category] || 0) + 1;
      }));
      const sortedCats = Object.entries(catCounts).sort((a,b) => b[1] - a[1]);
      const preference = sortedCats.length > 0 ? sortedCats[0][0] : 'General';

      // AOV
      const aov = c.ordersCount > 0 ? Math.round(c.totalSpend / c.ordersCount) : 0;

      return { busyDay, favItem, preference, aov, history: customerOrders };
  };

  return (
    <div className="animate-fade-in relative min-h-screen">
      
      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
          <div className="fixed inset-0 z-[60] bg-obsidian/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-xl">Add Customer</h3>
                      <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-stone-500" /></button>
                  </div>
                  <form onSubmit={handleAddSubmit} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Full Name</label>
                          <input required className="w-full border border-stone-300 rounded p-2 text-sm" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Phone</label>
                          <input required className="w-full border border-stone-300 rounded p-2 text-sm" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email</label>
                          <input className="w-full border border-stone-300 rounded p-2 text-sm" type="email" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Address</label>
                          <input required className="w-full border border-stone-300 rounded p-2 text-sm" value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
                      </div>
                      <button type="submit" className="w-full bg-obsidian text-white py-3 rounded uppercase text-xs font-bold tracking-widest hover:bg-stone-800">Save Customer</button>
                  </form>
              </div>
          </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif">Customer Database</h1>
            <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest font-bold">
                {processedCustomers.length} Active Records
            </p>
          </div>
          <div className="flex gap-2">
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleImportCSV} />
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-lg text-xs uppercase font-bold text-stone-600 hover:bg-stone-50">
                  <Upload className="w-4 h-4" /> Import
              </button>
              <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-lg text-xs uppercase font-bold text-stone-600 hover:bg-stone-50">
                  <Download className="w-4 h-4" /> Export
              </button>
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-obsidian text-white rounded-lg text-xs uppercase font-bold hover:bg-stone-800 shadow-md">
                  <UserPlus className="w-4 h-4" /> Add New
              </button>
          </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                  type="text" 
                  placeholder="Search by name, phone, or address..." 
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-obsidian"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
              />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase font-bold border transition-all ${showFilters ? 'bg-stone-100 border-stone-300' : 'bg-white border-stone-200 hover:bg-stone-50'}`}>
              <Filter className="w-4 h-4" /> Filters
          </button>
          <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-700 underline font-medium">Reset All</button>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
              <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-2">Customer Status</label>
                  <div className="flex flex-wrap gap-2">
                      {['all', 'vip', 'regular', 'new', 'churned'].map(s => (
                          <button 
                            key={s} 
                            onClick={() => setStatusFilter(s as any)}
                            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold border ${statusFilter === s ? 'bg-obsidian text-white border-obsidian' : 'bg-white text-stone-500 border-stone-200'}`}
                          >
                              {s}
                          </button>
                      ))}
                  </div>
              </div>
              <div>
                   <label className="block text-[10px] uppercase font-bold text-stone-500 mb-2">Total Spend (PKR)</label>
                   <div className="flex items-center gap-2">
                       <input type="number" placeholder="Min" className="w-20 p-2 text-xs border rounded" value={spendRange.min} onChange={e => setSpendRange({...spendRange, min: e.target.value})} />
                       <span className="text-stone-400">-</span>
                       <input type="number" placeholder="Max" className="w-20 p-2 text-xs border rounded" value={spendRange.max} onChange={e => setSpendRange({...spendRange, max: e.target.value})} />
                   </div>
              </div>
              <div>
                   <label className="block text-[10px] uppercase font-bold text-stone-500 mb-2">Order Volume</label>
                   <div className="flex items-center gap-2">
                       <input type="number" placeholder="Min" className="w-16 p-2 text-xs border rounded" value={orderRange.min} onChange={e => setOrderRange({...orderRange, min: e.target.value})} />
                       <span className="text-stone-400">-</span>
                       <input type="number" placeholder="Max" className="w-16 p-2 text-xs border rounded" value={orderRange.max} onChange={e => setOrderRange({...orderRange, max: e.target.value})} />
                   </div>
              </div>
          </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
          
          {viewMode === 'list' ? (
            /* LIST VIEW */
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead className="bg-stone-50 text-xs uppercase tracking-widest text-stone-500">
                        <tr>
                            <th className="p-4 font-normal cursor-pointer hover:text-obsidian" onClick={() => handleSort('address')}>Address Info {sortField === 'address' && (sortDir === 'asc' ? <ArrowUp className="inline w-3 h-3"/> : <ArrowDown className="inline w-3 h-3"/>)}</th>
                            <th className="p-4 font-normal cursor-pointer hover:text-obsidian" onClick={() => handleSort('ordersCount')}>Orders {sortField === 'ordersCount' && (sortDir === 'asc' ? <ArrowUp className="inline w-3 h-3"/> : <ArrowDown className="inline w-3 h-3"/>)}</th>
                            <th className="p-4 font-normal cursor-pointer hover:text-obsidian" onClick={() => handleSort('totalSpend')}>Spend {sortField === 'totalSpend' && (sortDir === 'asc' ? <ArrowUp className="inline w-3 h-3"/> : <ArrowDown className="inline w-3 h-3"/>)}</th>
                            <th className="p-4 font-normal cursor-pointer hover:text-obsidian" onClick={() => handleSort('lastOrderDate')}>Last Visit {sortField === 'lastOrderDate' && (sortDir === 'asc' ? <ArrowUp className="inline w-3 h-3"/> : <ArrowDown className="inline w-3 h-3"/>)}</th>
                            <th className="p-4 font-normal text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedCustomers.map(c => (
                            <tr key={c.id} className="border-t border-stone-100 hover:bg-stone-50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-obsidian">{c.address}</span>
                                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                                            <span>{c.name}</span>
                                            <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                                            <span className="font-mono">{c.phone}</span>
                                            {c.isDHA && <span className="px-1.5 py-0.5 bg-obsidian text-white text-[9px] rounded uppercase font-bold tracking-wider">DHA Resident</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-medium">{c.ordersCount}</td>
                                <td className="p-4 text-sm font-medium">PKR {c.totalSpend.toLocaleString()}</td>
                                <td className="p-4 text-xs text-stone-500">{new Date(c.lastOrderDate).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => { setSelectedCustomerId(c.id); setViewMode('detail'); }}
                                        className="text-xs font-bold uppercase tracking-wider text-obsidian border border-stone-300 px-3 py-1.5 rounded hover:bg-obsidian hover:text-white transition-colors"
                                    >
                                        View Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {processedCustomers.length === 0 && <div className="p-12 text-center text-stone-400">No customers found matching your criteria.</div>}
            </div>
          ) : (
            /* DETAIL VIEW */
            selectedCustomer && (() => {
                const analytics = getCustomerAnalytics(selectedCustomer);
                return (
                    <div className="animate-fade-in">
                        {/* Profile Header */}
                        <div className="bg-stone-50 p-6 md:p-8 border-b border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <button onClick={() => setViewMode('list')} className="flex items-center gap-1 text-xs uppercase font-bold text-stone-400 hover:text-obsidian mb-4">
                                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Database
                                </button>
                                <h2 className="text-2xl md:text-3xl font-serif mb-2">{selectedCustomer.address}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600">
                                    <span className="flex items-center gap-1"><UserPlus className="w-4 h-4" /> {selectedCustomer.name}</span>
                                    <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {selectedCustomer.phone}</span>
                                    {selectedCustomer.isDHA && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold rounded">DHA Resident</span>}
                                    <span className="px-2 py-0.5 bg-stone-200 text-stone-600 text-[10px] uppercase font-bold rounded">{selectedCustomer.ordersCount > 3 ? 'Regular' : 'New'}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDelete(selectedCustomer.id)} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs uppercase font-bold border border-transparent hover:border-red-200 transition-colors">
                                    <Trash2 className="w-4 h-4" /> Delete Profile
                                </button>
                            </div>
                        </div>

                        {/* Analytics Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-stone-200">
                             <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                                 <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Lifetime Value</span>
                                 <span className="text-xl md:text-2xl font-serif text-obsidian">PKR {selectedCustomer.totalSpend.toLocaleString()}</span>
                             </div>
                             <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                                 <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Average Order</span>
                                 <span className="text-xl md:text-2xl font-serif text-obsidian">PKR {analytics.aov.toLocaleString()}</span>
                             </div>
                             <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                                 <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Busy Day</span>
                                 <span className="text-xl md:text-2xl font-serif text-obsidian">{analytics.busyDay}</span>
                             </div>
                             <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                                 <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Favorite Item</span>
                                 <span className="text-lg font-serif text-obsidian line-clamp-1" title={analytics.favItem}>{analytics.favItem}</span>
                             </div>
                        </div>

                        {/* Order History */}
                        <div className="p-6">
                            <h3 className="text-sm uppercase font-bold text-stone-500 mb-4">Order History</h3>
                            <div className="overflow-x-auto border border-stone-200 rounded-lg">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase font-bold text-stone-500">
                                        <tr>
                                            <th className="p-3">Order ID</th>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Items</th>
                                            <th className="p-3">Total</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.history.map(order => (
                                            <tr key={order.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                                                <td className="p-3 font-mono">{order.id}</td>
                                                <td className="p-3">{order.date}</td>
                                                <td className="p-3 text-stone-600 max-w-xs truncate">{order.items.map(i => i.name).join(', ')}</td>
                                                <td className="p-3 font-medium">PKR {order.total.toLocaleString()}</td>
                                                <td className="p-3">
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                    }`}>{order.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            })()
          )}
      </div>
    </div>
  );
};

export default AdminCustomers;