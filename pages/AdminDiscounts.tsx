import React, { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
import { Plus, Trash2, CheckCircle, Percent, AlertCircle, RefreshCw, X } from 'lucide-react';
import { Product } from '../types';

const AdminDiscounts = () => {
  const { promos, addPromo, deletePromo, togglePromo, products, updateProducts, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'coupons' | 'sale'>('coupons');
  
  // Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(10);

  // Sale Manager State
  const [salePercent, setSalePercent] = useState(15);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);

  // Filter for product selection
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const toggleProductSelection = (id: string) => {
      const newSet = new Set(selectedProductIds);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setSelectedProductIds(newSet);
  };

  const toggleSelectAll = () => {
      if (selectedProductIds.size === filteredProducts.length) {
          setSelectedProductIds(new Set());
      } else {
          setSelectedProductIds(new Set(filteredProducts.map(p => p.id)));
      }
  };

  const handleApplySale = async () => {
      if (selectedProductIds.size === 0) {
          showToast("Please select products first");
          return;
      }
      
      if (!salePercent || salePercent <= 0 || salePercent >= 100) {
          showToast("Enter a valid percentage (1-99)");
          return;
      }

      if (!window.confirm(`Apply ${salePercent}% OFF to ${selectedProductIds.size} products? This will update public prices.`)) return;

      setProcessing(true);

      try {
          const productsToUpdate: Product[] = [];
          
          // Use Array.from to iterate safely
          Array.from(selectedProductIds).forEach(id => {
              const product = products.find(p => p.id === id);
              if (product) {
                  // LOGIC:
                  // If product is ALREADY on sale (has compareAtPrice), use that as the base.
                  // If product is NOT on sale, use current price as base.
                  // This allows changing sale % without compounding errors.
                  const basePrice = (product.compareAtPrice && product.compareAtPrice > 0) 
                                    ? product.compareAtPrice 
                                    : product.price;
                  
                  const discountMultiplier = 1 - (salePercent / 100);
                  const newPrice = Math.round(basePrice * discountMultiplier);
                  
                  productsToUpdate.push({
                      ...product,
                      price: newPrice,
                      compareAtPrice: basePrice // Ensure compareAtPrice is always the original price
                  });
              }
          });
          
          if (productsToUpdate.length > 0) {
              console.log("Updating products:", productsToUpdate);
              updateProducts(productsToUpdate);
              showToast(`Success! Sale applied to ${productsToUpdate.length} items.`);
              setSelectedProductIds(new Set());
          }
      } catch (error) {
          console.error("Failed to apply sale:", error);
          showToast("Error applying sale. Check console.");
      } finally {
          setProcessing(false);
      }
  };
  
  const handleRemoveSale = () => {
      if (selectedProductIds.size === 0) {
          showToast("Select products to revert");
          return;
      }

      if (!window.confirm(`Revert prices for ${selectedProductIds.size} products?`)) return;

      setProcessing(true);
      
      try {
          const productsToUpdate: Product[] = [];
          
          Array.from(selectedProductIds).forEach(id => {
              const product = products.find(p => p.id === id);
              // Only revert if it actually has a compareAtPrice
              if (product && product.compareAtPrice) {
                   productsToUpdate.push({
                      ...product,
                      price: product.compareAtPrice, // Restore original
                      compareAtPrice: undefined      // Remove sale flag
                  });
              }
          });
          
          if (productsToUpdate.length > 0) {
              updateProducts(productsToUpdate);
              showToast(`Restored prices for ${productsToUpdate.length} items.`);
              setSelectedProductIds(new Set());
          } else {
              showToast("Selected items were not on sale.");
          }
      } finally {
          setProcessing(false);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-6">
          <div>
            <h1 className="text-3xl font-serif">Promotions Engine</h1>
            <p className="text-stone-500 text-sm mt-1">Manage coupons and flash sales.</p>
          </div>
          
          <div className="bg-stone-100 p-1 rounded-lg flex self-start md:self-auto">
              <button 
                  onClick={() => setActiveTab('coupons')}
                  className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'coupons' ? 'bg-white text-obsidian shadow-sm' : 'text-stone-500 hover:text-obsidian'}`}
              >
                  Coupons
              </button>
              <button 
                  onClick={() => setActiveTab('sale')}
                  className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'sale' ? 'bg-white text-obsidian shadow-sm' : 'text-stone-500 hover:text-obsidian'}`}
              >
                  Flash Sales
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
      )}

      {/* PRODUCT SALE MANAGER */}
      {activeTab === 'sale' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              {/* Sidebar Controls */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-fit space-y-8 sticky top-24">
                  <div>
                      <div className="flex items-center gap-2 mb-4">
                          <Percent className="w-5 h-5 text-obsidian" />
                          <h3 className="font-serif text-lg">Bulk Discount</h3>
                      </div>
                      
                      <div className="mb-6">
                          <label className="block text-xs uppercase opacity-50 mb-2 font-bold">Percentage Off</label>
                          <div className="flex items-center border border-stone-300 rounded-md overflow-hidden focus-within:border-obsidian focus-within:ring-1 focus-within:ring-obsidian transition-all">
                              <input 
                                  type="number"
                                  className="w-full p-3 text-lg font-bold outline-none"
                                  min="1"
                                  max="99"
                                  value={salePercent}
                                  onChange={e => setSalePercent(Number(e.target.value))}
                              />
                              <div className="bg-stone-100 px-4 py-3 text-stone-500 font-bold border-l border-stone-300">%</div>
                          </div>
                      </div>

                      <div className="space-y-3">
                        <button 
                            onClick={handleApplySale}
                            disabled={selectedProductIds.size === 0 || processing}
                            className="w-full bg-obsidian text-white py-3.5 text-xs uppercase tracking-widest rounded-lg font-bold shadow-md hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                            Apply Sale
                        </button>
                        <button 
                            onClick={handleRemoveSale}
                            disabled={selectedProductIds.size === 0 || processing}
                            className="w-full bg-white border border-stone-300 text-stone-600 py-3.5 text-xs uppercase tracking-widest rounded-lg font-bold hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Remove Sale
                        </button>
                      </div>
                  </div>
                  
                  <div className="pt-6 border-t border-stone-200 bg-stone-50/50 -mx-6 px-6 pb-2">
                      <div className="flex gap-3 items-start text-stone-500">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                          <p className="text-[10px] leading-relaxed">
                              <strong>Note:</strong> Applying a sale calculates the new price based on the original price. If an item is already on sale, the discount is updated (not compounded).
                          </p>
                      </div>
                  </div>
              </div>

              {/* Product Selector */}
              <div className="lg:col-span-3 space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-20">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                          <h3 className="font-serif text-lg whitespace-nowrap">Select Products</h3>
                          <span className="bg-obsidian text-white text-[10px] font-bold px-2 py-1 rounded-full">{selectedProductIds.size} Selected</span>
                      </div>
                      
                      <div className="flex gap-3 w-full md:w-auto">
                          <input 
                             type="text" 
                             placeholder="Search products..." 
                             className="flex-1 md:w-64 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-obsidian"
                             value={searchTerm}
                             onChange={e => setSearchTerm(e.target.value)}
                          />
                          <button onClick={toggleSelectAll} className="whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wider border border-stone-300 rounded-lg hover:bg-stone-50">
                              {selectedProductIds.size === filteredProducts.length ? 'Deselect All' : 'Select All'}
                          </button>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredProducts.map(product => {
                          const isSelected = selectedProductIds.has(product.id);
                          const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
                          const discount = isOnSale ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) : 0;
                          
                          return (
                              <div 
                                key={product.id}
                                onClick={() => toggleProductSelection(product.id)}
                                className={`
                                    relative flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all select-none group
                                    ${isSelected ? 'border-obsidian bg-stone-50 ring-2 ring-obsidian/10' : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-md'}
                                `}
                              >
                                  {/* Selection Checkbox */}
                                  <div className={`absolute top-3 right-3 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-obsidian border-obsidian' : 'border-stone-300 bg-white'}`}>
                                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                  </div>

                                  <div className="w-16 h-20 bg-stone-200 rounded-md overflow-hidden flex-shrink-0 border border-stone-100">
                                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  
                                  <div className="flex-1 min-w-0 pr-6">
                                      <p className="font-serif text-sm text-obsidian leading-tight mb-1 truncate">{product.name}</p>
                                      <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">{product.category}</p>
                                      
                                      <div className="flex flex-wrap items-center gap-2">
                                          {isOnSale ? (
                                              <>
                                                <span className="text-xs text-stone-400 line-through decoration-stone-400/50">PKR {product.compareAtPrice?.toLocaleString()}</span>
                                                <span className="text-sm font-bold text-red-700">PKR {product.price.toLocaleString()}</span>
                                              </>
                                          ) : (
                                              <span className="text-sm font-bold text-stone-700">PKR {product.price.toLocaleString()}</span>
                                          )}
                                      </div>

                                      {isOnSale && (
                                          <div className="mt-2 inline-flex items-center gap-1 bg-red-50 border border-red-100 text-red-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                              <Percent className="w-3 h-3" /> {discount}% OFF Active
                                          </div>
                                      )}
                                  </div>
                              </div>
                          )
                      })}
                  </div>
                  {filteredProducts.length === 0 && (
                      <div className="text-center py-12 text-stone-400 bg-stone-50 rounded-xl border border-stone-200 border-dashed">
                          No products match your search.
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDiscounts;