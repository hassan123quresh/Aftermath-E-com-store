import React, { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
import { Product, ProductVariant } from '../types';
import { Plus, Trash2, Edit2, X, Settings, MessageSquare, AlertCircle } from 'lucide-react';
import StarRating from '../components/StarRating';

const AdminProducts = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory, reviews, addReview, deleteReview } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  // Review Management State
  const [selectedProductForReviews, setSelectedProductForReviews] = useState<Product | null>(null);
  const [newReviewForm, setNewReviewForm] = useState({ name: '', rating: 5, comment: '' });

  // Form State
  const initialProductState: Partial<Product> = {
      name: '',
      price: 0,
      compareAtPrice: 0,
      category: categories[0] || '',
      description: '',
      images: [],
      inventory: [
          { size: 'XS', stock: 0 },
          { size: 'S', stock: 0 },
          { size: 'M', stock: 0 },
          { size: 'L', stock: 0 },
          { size: 'XL', stock: 0 }
      ],
      inStock: true,
      isVisible: true,
      video: '',
      galleryVideo: ''
  };
  
  const [productForm, setProductForm] = useState<Partial<Product>>(initialProductState);
  const [imgUrlInput, setImgUrlInput] = useState('');
  
  // Inventory Manager State
  const [newVariantSize, setNewVariantSize] = useState('');
  const [newVariantStock, setNewVariantStock] = useState(0);

  // Handle entering Edit Mode
  const handleEditClick = (product: Product) => {
      setProductForm(product);
      setIsEditing(true);
      window.scrollTo(0, 0);
  };

  const handleAddImage = () => {
      if(imgUrlInput) {
          setProductForm({...productForm, images: [...(productForm.images || []), imgUrlInput]});
          setImgUrlInput('');
      }
  };

  const handleRemoveImage = (index: number) => {
      const newImages = [...(productForm.images || [])];
      newImages.splice(index, 1);
      setProductForm({...productForm, images: newImages});
  };

  // Inventory Handlers
  const handleAddVariant = () => {
      if (newVariantSize) {
          const updatedInventory = [...(productForm.inventory || [])];
          // Check if size already exists
          const existingIndex = updatedInventory.findIndex(v => v.size.toLowerCase() === newVariantSize.toLowerCase());
          
          if (existingIndex >= 0) {
              // Update stock if exists
              updatedInventory[existingIndex].stock = newVariantStock;
          } else {
              // Add new
              updatedInventory.push({ size: newVariantSize.toUpperCase(), stock: newVariantStock });
          }
          
          setProductForm({ ...productForm, inventory: updatedInventory });
          setNewVariantSize('');
          setNewVariantStock(0);
      }
  };

  const handleRemoveVariant = (index: number) => {
      const updatedInventory = [...(productForm.inventory || [])];
      updatedInventory.splice(index, 1);
      setProductForm({ ...productForm, inventory: updatedInventory });
  };

  const handleVariantStockChange = (index: number, val: number) => {
      const updatedInventory = [...(productForm.inventory || [])];
      updatedInventory[index].stock = val;
      setProductForm({ ...productForm, inventory: updatedInventory });
  };

  const handleSave = () => {
      if(productForm.name && productForm.price) {
          const totalStock = (productForm.inventory || []).reduce((acc, v) => acc + v.stock, 0);
          
          const finalProduct: Product = {
              id: productForm.id || `p-${Date.now()}`,
              name: productForm.name!,
              price: Number(productForm.price),
              compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
              category: productForm.category || 'Uncategorized',
              description: productForm.description || '',
              images: productForm.images?.length ? productForm.images : ['https://picsum.photos/800/1000'],
              inventory: productForm.inventory || [],
              inStock: totalStock > 0, // Computed purely from stock
              isVisible: productForm.isVisible !== undefined ? productForm.isVisible : true, // Manual toggle
              stock: totalStock, // Derived global stock count for backward compat if needed, mainly explicit inventory used now
              sizes: (productForm.inventory || []).map(v => v.size), // Derived sizes array
              video: productForm.video || '',
              galleryVideo: productForm.galleryVideo || ''
          } as Product; // Cast to Product to satisfy legacy generic type check if needed, though we updated interface

          if (productForm.id) {
              updateProduct(finalProduct);
          } else {
              addProduct(finalProduct);
          }

          setIsEditing(false);
          setProductForm(initialProductState);
      }
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newCategory) {
          addCategory(newCategory);
          setNewCategory('');
      }
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedProductForReviews && newReviewForm.name && newReviewForm.comment) {
          addReview({
              id: `REV-ADMIN-${Date.now()}`,
              productId: selectedProductForReviews.id,
              userName: newReviewForm.name,
              rating: newReviewForm.rating,
              comment: newReviewForm.comment,
              date: new Date().toISOString().split('T')[0]
          });
          setNewReviewForm({ name: '', rating: 5, comment: '' });
      }
  };

  // Main Form UI
  if (isEditing) {
      return (
          <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-serif">{productForm.id ? 'Edit Product' : 'Add New Product'}</h1>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-stone-200 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              
              <div className="bg-white p-6 md:p-8 border border-stone-200 space-y-6 shadow-sm rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                          <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Product Name</label>
                          <input 
                            className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none"
                            value={productForm.name}
                            onChange={e => setProductForm({...productForm, name: e.target.value})}
                            placeholder="e.g. Studio Cut Hoodie"
                          />
                      </div>
                      
                      {/* Price Section */}
                      <div>
                            <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Price (PKR)</label>
                            <input 
                                type="number"
                                className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none"
                                value={productForm.price}
                                onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                            />
                      </div>
                      <div>
                            <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Compare at Price (Optional)</label>
                            <input 
                                type="number"
                                className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none"
                                value={productForm.compareAtPrice || ''}
                                onChange={e => setProductForm({...productForm, compareAtPrice: Number(e.target.value)})}
                                placeholder="Original Price"
                            />
                      </div>

                      {/* Category Selection */}
                      <div>
                            <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Category</label>
                            <div className="flex gap-2">
                                <select 
                                    className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none bg-white"
                                    value={productForm.category}
                                    onChange={e => setProductForm({...productForm, category: e.target.value})}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <button onClick={() => setShowCategoryModal(true)} className="p-3 border border-stone-300 rounded-md hover:bg-stone-100" title="Manage Categories">
                                    <Settings className="w-4 h-4 text-stone-600" />
                                </button>
                            </div>
                      </div>

                      {/* Global Visibility */}
                      <div>
                            <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Visibility</label>
                            <select 
                                className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none bg-white"
                                value={productForm.isVisible ? "true" : "false"}
                                onChange={e => setProductForm({...productForm, isVisible: e.target.value === 'true'})}
                            >
                                <option value="true">Visible</option>
                                <option value="false">Hidden</option>
                            </select>
                      </div>
                   </div>

                   {/* Inventory Manager */}
                   <div className="border-t border-b border-stone-100 py-6 my-2">
                       <label className="block text-xs uppercase opacity-50 mb-3 font-bold">Inventory by Size</label>
                       
                       {/* Add Variant Form */}
                       <div className="flex gap-2 mb-4 bg-stone-50 p-3 rounded-lg border border-stone-200">
                           <input 
                               placeholder="Size (e.g. XXL or Custom)"
                               className="flex-1 border border-stone-300 p-2 text-sm rounded focus:border-obsidian outline-none"
                               value={newVariantSize}
                               onChange={e => setNewVariantSize(e.target.value)}
                           />
                           <input 
                               type="number"
                               placeholder="Stock"
                               className="w-24 border border-stone-300 p-2 text-sm rounded focus:border-obsidian outline-none"
                               min="0"
                               value={newVariantStock}
                               onChange={e => setNewVariantStock(Number(e.target.value))}
                           />
                           <button onClick={handleAddVariant} className="bg-obsidian text-white px-4 py-2 text-xs uppercase font-bold rounded">Add</button>
                       </div>

                       {/* Variant List */}
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                           {productForm.inventory?.map((variant, idx) => (
                               <div key={idx} className="flex items-center justify-between p-3 border border-stone-200 rounded bg-white">
                                   <div className="flex flex-col">
                                       <span className="font-bold text-sm">{variant.size}</span>
                                       <span className="text-[10px] text-stone-400 uppercase tracking-wider">Size</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <input 
                                           type="number" 
                                           className="w-16 border border-stone-300 p-1 text-sm rounded text-center focus:border-obsidian outline-none"
                                           value={variant.stock}
                                           onChange={(e) => handleVariantStockChange(idx, Number(e.target.value))}
                                           min="0"
                                       />
                                       <button onClick={() => handleRemoveVariant(idx)} className="text-stone-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                                   </div>
                               </div>
                           ))}
                           {(!productForm.inventory || productForm.inventory.length === 0) && (
                               <p className="col-span-full text-center text-sm text-stone-400 italic py-2">No sizes defined. Add one above.</p>
                           )}
                       </div>
                   </div>

                   <div>
                      <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Description (Markdown)</label>
                      <textarea 
                        className="w-full border border-stone-300 p-3 h-40 font-mono text-xs md:text-sm rounded-md focus:border-obsidian outline-none"
                        value={productForm.description}
                        onChange={e => setProductForm({...productForm, description: e.target.value})}
                        placeholder="# Header&#10;* Bullet point&#10;Details..."
                      />
                  </div>

                  {/* Image Management */}
                  <div>
                      <label className="block text-xs uppercase opacity-50 mb-1 font-bold">
                          Images (URL) <span className="normal-case font-medium text-stone-400 ml-1">- Rec: 3:4 Portrait (e.g. 1200x1600px)</span>
                      </label>
                      <div className="flex gap-2">
                          <input 
                            className="flex-1 border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none"
                            value={imgUrlInput}
                            onChange={e => setImgUrlInput(e.target.value)}
                            placeholder="https://..."
                          />
                          <button onClick={handleAddImage} className="bg-obsidian text-white px-6 text-xs uppercase tracking-wider rounded-md">Add</button>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4">
                          {productForm.images?.map((img, i) => (
                              <div key={i} className="relative group aspect-[3/4]">
                                  <img src={img} className="w-full h-full object-cover border rounded-md" alt="" />
                                  <button 
                                    onClick={() => handleRemoveImage(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                      <X className="w-3 h-3" />
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Video URL Input - Unboxing */}
                  <div>
                      <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Unboxing Video URL (Bottom Section)</label>
                      <input 
                          className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none"
                          value={productForm.video || ''}
                          onChange={e => setProductForm({...productForm, video: e.target.value})}
                          placeholder="https://..."
                      />
                  </div>

                  {/* Video URL Input - Gallery */}
                  <div>
                      <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Gallery Video URL (Beside Images)</label>
                      <input 
                          className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none"
                          value={productForm.galleryVideo || ''}
                          onChange={e => setProductForm({...productForm, galleryVideo: e.target.value})}
                          placeholder="https://..."
                      />
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-stone-100">
                      <button onClick={handleSave} className="flex-1 bg-obsidian text-white py-4 text-xs uppercase tracking-widest rounded-lg font-bold shadow-lg hover:bg-stone-800 transition-colors">Save Product</button>
                      <button onClick={() => setIsEditing(false)} className="px-8 py-4 text-xs uppercase tracking-widest rounded-lg border border-stone-200 hover:bg-stone-50 font-bold transition-colors">Cancel</button>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-serif">Products</h1>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center gap-2 border border-stone-300 bg-white px-4 py-2 text-[10px] md:text-xs uppercase tracking-widest rounded-full hover:bg-stone-50"
            >
                <Settings className="w-4 h-4" /> <span className="hidden md:inline">Categories</span>
            </button>
            <button 
                onClick={() => {
                    setProductForm(initialProductState);
                    setIsEditing(true);
                }}
                className="flex items-center gap-2 bg-obsidian text-white px-4 py-2 text-[10px] md:text-xs uppercase tracking-widest rounded-full shadow-md hover:bg-stone-800"
            >
                <Plus className="w-4 h-4" /> <span className="hidden md:inline">Add Product</span><span className="md:hidden">Add</span>
            </button>
        </div>
      </div>

      <div className="bg-white border border-stone-200 overflow-hidden rounded-lg shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                    <tr className="bg-stone-100 text-xs uppercase tracking-widest text-stone-500">
                        <th className="p-4 font-normal">Image</th>
                        <th className="p-4 font-normal">Name</th>
                        <th className="p-4 font-normal">Category</th>
                        <th className="p-4 font-normal">Price</th>
                        <th className="p-4 font-normal">Total Stock</th>
                        <th className="p-4 font-normal text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => {
                        const totalStock = product.inventory.reduce((acc, v) => acc + v.stock, 0);
                        return (
                        <tr key={product.id} className="border-t border-stone-100 hover:bg-stone-50 transition-colors">
                            <td className="p-4">
                                <img src={product.images[0]} alt="" className="w-10 h-12 object-cover bg-stone-200 rounded-sm" />
                            </td>
                            <td className="p-4 font-medium text-sm">
                                {product.name}
                                {!product.isVisible && <span className="ml-2 text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Hidden</span>}
                            </td>
                            <td className="p-4 text-stone-500 text-xs md:text-sm">{product.category}</td>
                            <td className="p-4 text-sm">
                                {product.compareAtPrice && <span className="text-stone-400 line-through text-xs mr-2">{product.compareAtPrice.toLocaleString()}</span>}
                                PKR {product.price.toLocaleString()}
                            </td>
                            <td className="p-4 text-sm">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    totalStock === 0 ? 'bg-red-100 text-red-700' :
                                    totalStock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {totalStock} Units
                                </span>
                                <div className="text-[9px] text-stone-400 mt-1 max-w-[150px] truncate">
                                    {product.inventory.map(v => `${v.size}:${v.stock}`).join(', ')}
                                </div>
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <button onClick={() => setSelectedProductForReviews(product)} className="text-stone-400 hover:text-obsidian p-2 rounded-full hover:bg-stone-200 transition-colors" title="Manage Reviews"><MessageSquare className="w-4 h-4" /></button>
                                <button onClick={() => handleEditClick(product)} className="text-stone-400 hover:text-obsidian p-2 rounded-full hover:bg-stone-200 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => deleteProduct(product.id)} className="text-stone-400 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
      </div>

      {/* Category Management Modal */}
      {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                  <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                      <h3 className="font-serif text-lg">Manage Categories</h3>
                      <button onClick={() => setShowCategoryModal(false)}><X className="w-5 h-5 text-stone-500" /></button>
                  </div>
                  <div className="p-6 space-y-6">
                      <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
                          <input 
                              className="flex-1 border border-stone-300 px-3 py-2 text-sm rounded-md focus:border-obsidian outline-none"
                              placeholder="New Category Name"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                          />
                          <button type="submit" className="bg-obsidian text-white px-4 py-2 text-xs uppercase tracking-wider rounded-md hover:bg-stone-800">Add</button>
                      </form>
                      
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {categories.map(cat => (
                              <div key={cat} className="flex justify-between items-center p-3 border border-stone-100 rounded-md bg-stone-50 group hover:border-stone-300">
                                  <span className="text-sm font-medium">{cat}</span>
                                  <button onClick={() => deleteCategory(cat)} className="text-stone-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-all">
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Review Management Modal */}
      {selectedProductForReviews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
                  {/* Header */}
                  <div className="p-6 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
                      <div>
                          <h3 className="font-serif text-xl">Manage Reviews</h3>
                          <p className="text-xs text-stone-500 mt-1">{selectedProductForReviews.name}</p>
                      </div>
                      <button onClick={() => setSelectedProductForReviews(null)}><X className="w-5 h-5 text-stone-600" /></button>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      
                      {/* Add Review Manual Form */}
                      <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                          <h4 className="text-xs font-bold uppercase mb-4 text-stone-600">Add Manual Review</h4>
                          <form onSubmit={handleAddReviewSubmit} className="space-y-3">
                              <div className="flex gap-4">
                                  <input 
                                      className="flex-1 border border-stone-300 rounded p-2 text-sm" 
                                      placeholder="Customer Name"
                                      value={newReviewForm.name}
                                      onChange={e => setNewReviewForm({...newReviewForm, name: e.target.value})}
                                      required
                                  />
                                  <div className="flex items-center gap-2 border border-stone-300 rounded px-2 bg-white">
                                      <span className="text-xs font-bold uppercase text-stone-500">Rating</span>
                                      <StarRating rating={newReviewForm.rating} interactive onChange={r => setNewReviewForm({...newReviewForm, rating: r})} />
                                  </div>
                              </div>
                              <textarea 
                                  className="w-full border border-stone-300 rounded p-2 text-sm h-20 resize-none"
                                  placeholder="Review comment..."
                                  value={newReviewForm.comment}
                                  onChange={e => setNewReviewForm({...newReviewForm, comment: e.target.value})}
                                  required
                              />
                              <button type="submit" className="bg-obsidian text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider w-full hover:bg-stone-800">Add Review</button>
                          </form>
                      </div>

                      {/* Review List */}
                      <div>
                          <h4 className="text-xs font-bold uppercase mb-4 text-stone-600">Existing Reviews</h4>
                          <div className="space-y-4">
                              {reviews.filter(r => r.productId === selectedProductForReviews.id).length === 0 ? (
                                  <p className="text-stone-400 italic text-sm text-center py-4">No reviews for this product.</p>
                              ) : (
                                  reviews.filter(r => r.productId === selectedProductForReviews.id).map(review => (
                                      <div key={review.id} className="border border-stone-200 rounded-lg p-4 flex justify-between items-start hover:bg-stone-50 transition-colors">
                                          <div>
                                              <div className="flex items-center gap-2 mb-1">
                                                  <span className="font-bold text-sm">{review.userName}</span>
                                                  <StarRating rating={review.rating} size={10} />
                                                  <span className="text-xs text-stone-400">| {review.date}</span>
                                              </div>
                                              <p className="text-sm text-stone-600">{review.comment}</p>
                                          </div>
                                          <button 
                                              onClick={() => deleteReview(review.id)}
                                              className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                                              title="Delete Review"
                                          >
                                              <Trash2 className="w-4 h-4" />
                                          </button>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminProducts;