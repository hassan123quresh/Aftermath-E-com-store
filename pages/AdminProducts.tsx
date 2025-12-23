import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Product } from '../types';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const AdminProducts = () => {
  const { products, addProduct, deleteProduct } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Basic form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
      name: '',
      price: 0,
      category: '',
      description: '',
      images: [],
      sizes: ['XS', 'S', 'M', 'L'],
      inStock: true
  });
  const [imgUrlInput, setImgUrlInput] = useState('');

  const handleAddImage = () => {
      if(imgUrlInput) {
          setNewProduct({...newProduct, images: [...(newProduct.images || []), imgUrlInput]});
          setImgUrlInput('');
      }
  };

  const handleSave = () => {
      if(newProduct.name && newProduct.price) {
          const product: Product = {
              id: `p-${Date.now()}`,
              name: newProduct.name!,
              price: Number(newProduct.price),
              category: newProduct.category || 'Uncategorized',
              description: newProduct.description || '',
              images: newProduct.images?.length ? newProduct.images : ['https://picsum.photos/800/1000'],
              sizes: newProduct.sizes || [],
              inStock: true
          };
          addProduct(product);
          setIsEditing(false);
          setNewProduct({ name: '', price: 0, images: [] });
      }
  };

  if (isEditing) {
      return (
          <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-serif mb-8">Add New Product</h1>
              <div className="bg-white p-4 md:p-8 border border-stone-200 space-y-6 shadow-sm rounded-lg">
                  <div>
                      <label className="block text-xs uppercase opacity-50 mb-1">Product Name</label>
                      <input 
                        className="w-full border border-stone-300 p-2 text-sm rounded-md"
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase opacity-50 mb-1">Price (PKR)</label>
                            <input 
                                type="number"
                                className="w-full border border-stone-300 p-2 text-sm rounded-md"
                                value={newProduct.price}
                                onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase opacity-50 mb-1">Category</label>
                            <input 
                                className="w-full border border-stone-300 p-2 text-sm rounded-md"
                                value={newProduct.category}
                                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                            />
                        </div>
                   </div>
                   <div>
                      <label className="block text-xs uppercase opacity-50 mb-1">Description (Markdown Supported)</label>
                      <textarea 
                        className="w-full border border-stone-300 p-2 h-40 font-mono text-xs md:text-sm rounded-md"
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="# Header&#10;Product details..."
                      />
                  </div>
                  <div>
                      <label className="block text-xs uppercase opacity-50 mb-1">Images (URL)</label>
                      <div className="flex gap-2">
                          <input 
                            className="flex-1 border border-stone-300 p-2 text-sm rounded-md"
                            value={imgUrlInput}
                            onChange={e => setImgUrlInput(e.target.value)}
                            placeholder="https://..."
                          />
                          <button onClick={handleAddImage} className="btn-glass px-4 text-xs uppercase tracking-wider rounded-md">Add</button>
                      </div>
                      <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                          {newProduct.images?.map((img, i) => (
                              <img key={i} src={img} className="w-12 h-16 object-cover border flex-shrink-0 rounded-sm" alt="" />
                          ))}
                      </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                      <button onClick={handleSave} className="btn-glass-dark px-6 py-3 text-xs uppercase tracking-widest rounded-full">Save Product</button>
                      <button onClick={() => setIsEditing(false)} className="btn-glass px-6 py-3 text-xs uppercase tracking-widest rounded-full">Cancel</button>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-serif">Products</h1>
        <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 btn-glass-dark px-4 py-2 text-[10px] md:text-xs uppercase tracking-widest rounded-full"
        >
            <Plus className="w-4 h-4" /> <span className="hidden md:inline">Add Product</span><span className="md:hidden">Add</span>
        </button>
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
                        <tr key={product.id} className="border-t border-stone-100 hover:bg-stone-50">
                            <td className="p-4">
                                <img src={product.images[0]} alt="" className="w-10 h-12 object-cover bg-stone-200 rounded-sm" />
                            </td>
                            <td className="p-4 font-medium text-sm">{product.name}</td>
                            <td className="p-4 text-stone-500 text-xs md:text-sm">{product.category}</td>
                            <td className="p-4 text-sm">PKR {product.price.toLocaleString()}</td>
                            <td className="p-4 text-right space-x-4 min-w-[100px]">
                                <button className="text-stone-400 hover:text-obsidian p-2 rounded-full hover:bg-stone-200 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => deleteProduct(product.id)} className="text-stone-400 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

export default AdminProducts;