import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Plus, Trash2, CheckCircle, X } from 'lucide-react';

const AdminDiscounts = () => {
  const { promos, addPromo, deletePromo, togglePromo, showToast } = useStore();
  
  // Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(10);

  const handleAddCoupon = (e: React.FormEvent) => {
      e.preventDefault();
      if(newCouponCode && newCouponPercent > 0) {
          addPromo({
              code: newCouponCode.toUpperCase(),
              discountPercentage: newCouponPercent,
              usageLimit: -1,
              usedCount: 0,
              isActive: true
          });
          setNewCouponCode('');
          setNewCouponPercent(10);
          showToast("Coupon created successfully");
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-6">
          <div>
            <h1 className="text-3xl font-serif">Promotions Engine</h1>
            <p className="text-stone-500 text-sm mt-1">Manage discount coupons.</p>
          </div>
      </div>

      {/* COUPON MANAGER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Coupon Form */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-fit">
              <h3 className="font-serif text-lg mb-6 flex items-center gap-2"><Plus className="w-5 h-5" /> Create Coupon</h3>
              <form onSubmit={handleAddCoupon} className="space-y-4">
                  <div>
                      <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Coupon Code</label>
                      <input 
                          className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none uppercase font-mono tracking-wide"
                          placeholder="e.g. SUMMER20"
                          value={newCouponCode}
                          onChange={e => setNewCouponCode(e.target.value)}
                          required
                      />
                  </div>
                  <div>
                      <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Discount Percentage</label>
                      <div className="relative">
                          <input 
                              type="number"
                              className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none pr-8"
                              min="1"
                              max="100"
                              value={newCouponPercent}
                              onChange={e => setNewCouponPercent(Number(e.target.value))}
                              required
                          />
                          <span className="absolute right-3 top-3 text-stone-400 font-bold">%</span>
                      </div>
                  </div>
                  <button type="submit" className="w-full bg-obsidian text-white py-3 text-xs uppercase tracking-widest rounded-lg font-bold shadow-md hover:bg-stone-800 transition-colors">
                      Create Coupon
                  </button>
              </form>
          </div>

          {/* Active Coupons List */}
          <div className="lg:col-span-2 space-y-4">
              <h3 className="font-serif text-lg mb-4">Active Coupons</h3>
              {promos.length === 0 ? (
                  <div className="p-12 text-center text-stone-400 bg-stone-50 rounded-xl border border-stone-200 border-dashed">No active coupons found.</div>
              ) : (
                  <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                          <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-widest text-stone-500">
                              <tr>
                                  <th className="p-4 font-normal">Code</th>
                                  <th className="p-4 font-normal">Discount</th>
                                  <th className="p-4 font-normal">Usage</th>
                                  <th className="p-4 font-normal">Status</th>
                                  <th className="p-4 font-normal text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {promos.map((promo, idx) => (
                                  <tr key={idx} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                                      <td className="p-4 font-mono font-bold text-obsidian text-sm">{promo.code}</td>
                                      <td className="p-4 font-medium text-emerald-700">{promo.discountPercentage}% OFF</td>
                                      <td className="p-4 text-stone-500 text-sm">{promo.usedCount} times</td>
                                      <td className="p-4">
                                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] uppercase font-bold ${promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'}`}>
                                              {promo.isActive ? 'Active' : 'Inactive'}
                                          </span>
                                      </td>
                                      <td className="p-4 text-right space-x-2">
                                          <button onClick={() => togglePromo(promo.code)} className="text-stone-400 hover:text-obsidian p-2 rounded hover:bg-stone-200 transition-colors" title={promo.isActive ? "Deactivate" : "Activate"}>
                                              {promo.isActive ? <CheckCircle className="w-4 h-4 fill-emerald-100 text-emerald-700" /> : <X className="w-4 h-4" />}
                                          </button>
                                          <button onClick={() => deletePromo(promo.code)} className="text-stone-400 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors" title="Delete">
                                              <Trash2 className="w-4 h-4" />
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default AdminDiscounts;