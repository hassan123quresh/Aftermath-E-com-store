import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Tag, Plus, Trash2, CheckCircle, Percent } from 'lucide-react';
import { Product } from '../types';

const AdminDiscounts = () => {
  const { promos, addPromo, deletePromo, togglePromo, products, updateProduct } = useStore();
  const [activeTab, setActiveTab] = useState<'coupons' | 'sale'>('coupons');
  
  // Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(10);

  // Sale Manager State
  const [salePercent, setSalePercent] = useState(15);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

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
      }
  };

  const toggleProductSelection = (id: string) => {
      const newSet = new Set(selectedProductIds);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setSelectedProductIds(newSet);
  };

  const handleApplySale = () => {
      if (selectedProductIds.size === 0) return;
      if (!window.confirm(`Apply ${salePercent}% off to ${selectedProductIds.size} products? This will update their prices.`)) return;

      selectedProductIds.forEach(id => {
          const product = products.find(p => p.id === id);
          if (product) {
              // Calculate new price
              const originalPrice = product.compareAtPrice || product.price;
              const discountMultiplier = 1 - (salePercent / 100);
              const newPrice = Math.round(originalPrice * discountMultiplier);
              
              updateProduct({
                  ...product,
                  price: newPrice,
                  compareAtPrice: originalPrice
              });
          }
      });
      alert('Sale applied successfully!');
      setSelectedProductIds(new Set());
  };
  
  const handleRemoveSale = () => {
      if (selectedProductIds.size === 0) return;
      if (!window.confirm(`Revert prices for ${selectedProductIds.size} products?`)) return;

      selectedProductIds.forEach(id => {
          const product = products.find(p => p.id === id);
          if (product && product.compareAtPrice) {
               updateProduct({
                  ...product,
                  price: product.compareAtPrice,
                  compareAtPrice: undefined
              });
          }
      });
      alert('Prices reverted successfully!');
      setSelectedProductIds(new Set());
  };

  const selectAll = () => {
      if (selectedProductIds.size === products.length) {
          setSelectedProductIds(new Set());
      } else {
          setSelectedProductIds(new Set(products.map(p => p.id)));
      }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif">Discounts & Promotions</h1>
          
          <div className="bg-white border border-stone-200 p-1 rounded-lg flex">
              <button 
                  onClick={() => setActiveTab('coupons')}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-md transition-all ${activeTab === 'coupons' ? 'bg-obsidian text-white' : 'text-stone-500 hover:text-obsidian'}`}
              >
                  Coupons
              </button>
              <button 
                  onClick={() => setActiveTab('sale')}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-md transition-all ${activeTab === 'sale' ? 'bg-obsidian text-white' : 'text-stone-500 hover:text-obsidian'}`}
              >
                  Product Sales
              </button>
          </div>
      </div>

      {/* COUPON MANAGER */}
      {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add Coupon Form */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-fit">
                  <h3 className="font-serif text-lg mb-6 flex items-center gap-2"><Plus className="w-5 h-5" /> Create Coupon</h3>
                  <form onSubmit={handleAddCoupon} className="space-y-4">
                      <div>
                          <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Coupon Code</label>
                          <input 
                              className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none uppercase"
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
                              <span className="absolute right-3 top-3 text-stone-400">%</span>
                          </div>
                      </div>
                      <button type="submit" className="w-full bg-obsidian text-white py-3 text-xs uppercase tracking-widest rounded-lg font-bold shadow-md hover:bg-stone-800 transition-colors">
                          Create Code
                      </button>
                  </form>
              </div>

              {/* Active Coupons List */}
              <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-serif text-lg mb-4">Active Promotions</h3>
                  {promos.length === 0 ? (
                      <div className="p-8 text-center text-stone-400 bg-stone-50 rounded-xl border border-stone-200 border-dashed">No active coupons.</div>
                  ) : (
                      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                          <table className="w-full text-left">
                              <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-widest text-stone-500">
                                  <tr>
                                      <th className="p-4 font-normal">Code</th>
                                      <th className="p-4 font-normal">Discount</th>
                                      <th className="p-4 font-normal">Used</th>
                                      <th className="p-4 font-normal">Status</th>
                                      <th className="p-4 font-normal text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {promos.map((promo, idx) => (
                                      <tr key={idx} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                                          <td className="p-4 font-mono font-bold text-obsidian">{promo.code}</td>
                                          <td className="p-4 font-medium text-emerald-700">{promo.discountPercentage}% OFF</td>
                                          <td className="p-4 text-stone-500">{promo.usedCount} times</td>
                                          <td className="p-4">
                                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] uppercase font-bold ${promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'}`}>
                                                  {promo.isActive ? 'Active' : 'Inactive'}
                                              </span>
                                          </td>
                                          <td className="p-4 text-right space-x-2">
                                              <button onClick={() => togglePromo(promo.code)} className="text-stone-400 hover:text-obsidian p-2 rounded hover:bg-stone-200" title="Toggle Status">
                                                  <CheckCircle className={`w-4 h-4 ${!promo.isActive && 'opacity-50'}`} />
                                              </button>
                                              <button onClick={() => deletePromo(promo.code)} className="text-stone-400 hover:text-red-700 p-2 rounded hover:bg-red-50" title="Delete">
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
      )}

      {/* PRODUCT SALE MANAGER */}
      {activeTab === 'sale' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Controls */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-fit space-y-6">
                  <div>
                      <h3 className="font-serif text-lg mb-2">Sale Settings</h3>
                      <p className="text-xs text-stone-500 mb-6">Apply discounts directly to product prices.</p>
                      
                      <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Discount Percentage</label>
                      <div className="relative mb-6">
                          <input 
                              type="number"
                              className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none pr-8"
                              min="1"
                              max="99"
                              value={salePercent}
                              onChange={e => setSalePercent(Number(e.target.value))}
                          />
                          <span className="absolute right-3 top-3 text-stone-400">%</span>
                      </div>

                      <div className="space-y-3">
                        <button 
                            onClick={handleApplySale}
                            disabled={selectedProductIds.size === 0}
                            className="w-full bg-obsidian text-white py-3 text-xs uppercase tracking-widest rounded-lg font-bold shadow-md hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Apply Sale
                        </button>
                        <button 
                            onClick={handleRemoveSale}
                            disabled={selectedProductIds.size === 0}
                            className="w-full border border-stone-300 text-stone-600 py-3 text-xs uppercase tracking-widest rounded-lg font-bold hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Revert Prices
                        </button>
                      </div>
                  </div>
                  
                  <div className="pt-6 border-t border-stone-200">
                      <p className="text-[10px] text-stone-400 leading-relaxed">
                          Applying a sale updates the <span className="font-mono">price</span> and moves the original price to <span className="font-mono">compareAtPrice</span>. Reverting restores the original price.
                      </p>
                  </div>
              </div>

              {/* Product Selector */}
              <div className="lg:col-span-3">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-serif text-lg">Select Products ({selectedProductIds.size})</h3>
                      <button onClick={selectAll} className="text-xs font-medium underline text-stone-500 hover:text-obsidian">
                          {selectedProductIds.size === products.length ? 'Deselect All' : 'Select All'}
                      </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {products.map(product => {
                          const isSelected = selectedProductIds.has(product.id);
                          const isOnSale = !!product.compareAtPrice;
                          
                          return (
                              <div 
                                key={product.id}
                                onClick={() => toggleProductSelection(product.id)}
                                className={`
                                    relative flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all
                                    ${isSelected ? 'border-obsidian bg-stone-50 ring-1 ring-obsidian' : 'border-stone-200 hover:border-stone-300 bg-white'}
                                `}
                              >
                                  <div className="w-12 h-16 bg-stone-200 rounded overflow-hidden flex-shrink-0">
                                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">{product.name}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                          {isOnSale && (
                                              <span className="text-xs text-stone-400 line-through">PKR {product.compareAtPrice?.toLocaleString()}</span>
                                          )}
                                          <span className={`text-sm font-bold ${isOnSale ? 'text-red-700' : 'text-stone-700'}`}>
                                              PKR {product.price.toLocaleString()}
                                          </span>
                                      </div>
                                  </div>
                                  {isSelected && (
                                      <div className="absolute top-2 right-2 text-obsidian">
                                          <CheckCircle className="w-5 h-5 fill-white" />
                                      </div>
                                  )}
                                  {isOnSale && !isSelected && (
                                      <div className="absolute top-2 right-2 text-red-700 bg-red-100 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                                          Sale
                                      </div>
                                  )}
                              </div>
                          )
                      })}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDiscounts;