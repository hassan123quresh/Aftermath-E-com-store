
import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Plus, Trash2, CheckCircle, X, Edit2, Search } from 'lucide-react';
import { PromoCode } from '../types';

const AdminDiscounts = () => {
  const { promos, products, addPromo, updatePromo, deletePromo, togglePromo, showToast } = useStore();
  
  // Coupon Form State
  const [isEditing, setIsEditing] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(10);
  const [newCouponLimit, setNewCouponLimit] = useState<string>('');
  
  // Product Selection State
  const [selectionType, setSelectionType] = useState<'all' | 'specific'>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState('');

  const handleProductToggle = (id: string) => {
      setSelectedProductIds(prev => 
          prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
      );
  };

  const handleSelectAll = () => {
      if (selectedProductIds.length === products.length) {
          setSelectedProductIds([]);
      } else {
          setSelectedProductIds(products.map(p => p.id));
      }
  };

  const resetForm = () => {
      setNewCouponCode('');
      setNewCouponPercent(10);
      setNewCouponLimit('');
      setSelectionType('all');
      setSelectedProductIds([]);
      setIsEditing(false);
      setProductSearch('');
  };

  const handleEdit = (promo: PromoCode) => {
      setNewCouponCode(promo.code);
      setNewCouponPercent(promo.discountPercentage);
      setNewCouponLimit(promo.usageLimit === -1 ? '' : promo.usageLimit.toString());
      
      if (promo.applicableProductIds && promo.applicableProductIds.length > 0) {
          setSelectionType('specific');
          setSelectedProductIds(promo.applicableProductIds);
      } else {
          setSelectionType('all');
          setSelectedProductIds([]);
      }
      
      setIsEditing(true);
      window.scrollTo(0, 0);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(newCouponCode && newCouponPercent > 0) {
          const limit = newCouponLimit && parseInt(newCouponLimit) > 0 ? parseInt(newCouponLimit) : -1;
          
          const promoData: PromoCode = {
              code: newCouponCode.toUpperCase(),
              discountPercentage: newCouponPercent,
              usageLimit: limit,
              usedCount: isEditing ? (promos.find(p => p.code === newCouponCode)?.usedCount || 0) : 0,
              isActive: true,
              applicableProductIds: selectionType === 'specific' ? selectedProductIds : undefined
          };

          if (isEditing) {
              updatePromo(promoData);
              showToast("Coupon updated successfully");
          } else {
              if (promos.some(p => p.code === promoData.code)) {
                  showToast("Coupon code already exists!");
                  return;
              }
              addPromo(promoData);
              showToast("Coupon created successfully");
          }
          
          resetForm();
      }
  };

  // Filter products for the selection list
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-6">
          <div>
            <h1 className="text-3xl font-serif">Promotions Engine</h1>
            <p className="text-stone-500 text-sm mt-1">Manage discount coupons and product eligibility.</p>
          </div>
          {isEditing && (
              <button onClick={resetForm} className="text-xs uppercase font-bold text-red-600 border border-red-200 px-4 py-2 rounded hover:bg-red-50">
                  Cancel Edit
              </button>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create/Edit Coupon Form */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-fit">
              <h3 className="font-serif text-lg mb-6 flex items-center gap-2">
                  {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
                  {isEditing ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              
              <form onSubmit={handleFormSubmit} className="space-y-5">
                  {/* Basic Info */}
                  <div>
                      <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Coupon Code</label>
                      <input 
                          className={`w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none uppercase font-mono tracking-wide ${isEditing ? 'bg-stone-100 text-stone-500 cursor-not-allowed' : ''}`}
                          placeholder="e.g. SUMMER20"
                          value={newCouponCode}
                          onChange={e => setNewCouponCode(e.target.value)}
                          required
                          disabled={isEditing} 
                      />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Discount %</label>
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
                      <div>
                          <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Limit</label>
                          <input 
                              type="number"
                              className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none"
                              placeholder="∞"
                              min="1"
                              value={newCouponLimit}
                              onChange={e => setNewCouponLimit(e.target.value)}
                          />
                      </div>
                  </div>

                  {/* Product Applicability Section */}
                  <div className="border-t border-stone-100 pt-4">
                      <label className="block text-xs uppercase opacity-50 mb-3 font-bold">Applies To</label>
                      <div className="flex gap-4 mb-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                  type="radio" 
                                  name="selectionType" 
                                  checked={selectionType === 'all'} 
                                  onChange={() => setSelectionType('all')}
                                  className="accent-obsidian"
                              />
                              <span className="text-sm font-medium">All Products</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                  type="radio" 
                                  name="selectionType" 
                                  checked={selectionType === 'specific'} 
                                  onChange={() => setSelectionType('specific')}
                                  className="accent-obsidian"
                              />
                              <span className="text-sm font-medium">Specific Products</span>
                          </label>
                      </div>

                      {selectionType === 'specific' && (
                          <div className="border border-stone-200 rounded-lg overflow-hidden bg-stone-50 animate-fade-in">
                              <div className="p-2 border-b border-stone-200 bg-white sticky top-0 flex gap-2">
                                  <div className="relative flex-1">
                                      <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-stone-400" />
                                      <input 
                                          className="w-full pl-7 pr-2 py-1 text-xs border border-stone-200 rounded bg-stone-50 focus:outline-none"
                                          placeholder="Search..."
                                          value={productSearch}
                                          onChange={e => setProductSearch(e.target.value)}
                                      />
                                  </div>
                                  <button 
                                      type="button" 
                                      onClick={handleSelectAll} 
                                      className="text-[10px] uppercase font-bold text-obsidian px-2 hover:bg-stone-100 rounded"
                                  >
                                      {selectedProductIds.length === products.length ? 'None' : 'All'}
                                  </button>
                              </div>
                              <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                                  {filteredProducts.map(p => (
                                      <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                                          <input 
                                              type="checkbox" 
                                              checked={selectedProductIds.includes(p.id)}
                                              onChange={() => handleProductToggle(p.id)}
                                              className="rounded border-stone-300 accent-obsidian"
                                          />
                                          <div className="flex-1 min-w-0">
                                              <div className="text-xs font-medium truncate">{p.name}</div>
                                              <div className="text-[9px] text-stone-400">{p.category}</div>
                                          </div>
                                      </label>
                                  ))}
                                  {filteredProducts.length === 0 && <p className="text-xs text-center py-4 text-stone-400">No products found.</p>}
                              </div>
                              <div className="bg-stone-100 p-2 text-[10px] text-center border-t border-stone-200 text-stone-500 font-medium">
                                  {selectedProductIds.length} Products Selected
                              </div>
                          </div>
                      )}
                  </div>

                  <button type="submit" className="w-full bg-obsidian text-white py-3 text-xs uppercase tracking-widest rounded-lg font-bold shadow-md hover:bg-stone-800 transition-colors">
                      {isEditing ? 'Update Coupon' : 'Create Coupon'}
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
                                  <th className="p-4 font-normal">Scope</th>
                                  <th className="p-4 font-normal">Status</th>
                                  <th className="p-4 font-normal text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {promos.map((promo, idx) => (
                                  <tr key={idx} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                                      <td className="p-4 font-mono font-bold text-obsidian text-sm">{promo.code}</td>
                                      <td className="p-4 font-medium text-emerald-700">{promo.discountPercentage}% OFF</td>
                                      <td className="p-4 text-stone-500 text-sm">
                                          {promo.usedCount} <span className="text-stone-300">/</span> {promo.usageLimit === -1 ? '∞' : promo.usageLimit}
                                      </td>
                                      <td className="p-4 text-xs">
                                          {promo.applicableProductIds && promo.applicableProductIds.length > 0 ? (
                                              <span className="bg-stone-100 border border-stone-200 px-2 py-1 rounded text-stone-600 font-medium cursor-help" title={`${promo.applicableProductIds.length} Products`}>
                                                  {promo.applicableProductIds.length} Products
                                              </span>
                                          ) : (
                                              <span className="text-stone-400 font-medium">All Products</span>
                                          )}
                                      </td>
                                      <td className="p-4">
                                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] uppercase font-bold ${promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'}`}>
                                              {promo.isActive ? 'Active' : 'Inactive'}
                                          </span>
                                      </td>
                                      <td className="p-4 text-right space-x-1">
                                          <button onClick={() => handleEdit(promo)} className="text-stone-400 hover:text-obsidian p-2 rounded hover:bg-stone-200 transition-colors" title="Edit">
                                              <Edit2 className="w-4 h-4" />
                                          </button>
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
