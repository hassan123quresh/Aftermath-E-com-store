import React, { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
import { Product } from '../types';
import { Plus, Trash2, Edit2, X, Settings } from 'lucide-react';

const AdminProducts = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  // Form State
  const initialProductState: Partial<Product> = {
      name: '',
      price: 0,
      compareAtPrice: 0,
      category: categories[0] || '',
      description: '',
      images: [],
      sizes: ['XS', 'S', 'M', 'L'],
      inStock: true
  };
  
  const [productForm, setProductForm] = useState<Partial<Product>>(initialProductState);
  const [imgUrlInput, setImgUrlInput] = useState('');

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

  const handleSave = () => {
      if(productForm.name && productForm.price) {
          const finalProduct: Product = {
              id: productForm.id || `p-${Date.now()}`,
              name: productForm.name!,
              price: Number(productForm.price),
              compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
              category: productForm.category || 'Uncategorized',
              description: productForm.description || '',
              images: productForm.images?.length ? productForm.images : ['https://picsum.photos/800/1000'],
              sizes: productForm.sizes || [],
              inStock: productForm.inStock !== undefined ? productForm.inStock : true
          };

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

                      {/* Stock Status */}
                      <div>
                            <label className="block text-xs uppercase opacity-50 mb-1 font-bold">Stock Status</label>
                            <select 
                                className="w-full border border-stone-300 p-3 text-sm rounded-md focus:border-obsidian outline-none bg-white"
                                value={productForm.inStock ? "true" : "false"}
                                onChange={e => setProductForm({...productForm, inStock: e.target.value === 'true'})}
                            >
                                <option value="true">In Stock</option>
                                <option value="false">Out of Stock</option>
                            </select>
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
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="bg-stone-100 text-xs uppercase tracking-widest text-stone-500">
                        <th className="p-4 font-normal">Image</th>
                        <th className="p-4 font-normal">Name</th>
                        <th className="p-4 font-normal">Category</th>
                        <th className="p-4 font-normal">Price</th>
                        <th className="p-4 font-normal text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="border-t border-stone-100 hover:bg-stone-50 transition-colors">
                            <td className="p-4">
                                <img src={product.images[0]} alt="" className="w-10 h-12 object-cover bg-stone-200 rounded-sm" />
                            </td>
                            <td className="p-4 font-medium text-sm">
                                {product.name}
                                {!product.inStock && <span className="ml-2 text-[9px] bg-stone-200 px-1 rounded text-stone-500 uppercase">OOS</span>}
                            </td>
                            <td className="p-4 text-stone-500 text-xs md:text-sm">{product.category}</td>
                            <td className="p-4 text-sm">
                                {product.compareAtPrice && <span className="text-stone-400 line-through text-xs mr-2">{product.compareAtPrice.toLocaleString()}</span>}
                                PKR {product.price.toLocaleString()}
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <button onClick={() => handleEditClick(product)} className="text-stone-400 hover:text-obsidian p-2 rounded-full hover:bg-stone-200 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => deleteProduct(product.id)} className="text-stone-400 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
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
    </div>
  );
};

export default AdminProducts;