import React, { useEffect } from 'react';
import { useStore } from '../StoreContext';
import { Link } from 'react-router-dom';
import { PriceBadge } from '../components/PriceBadge';

const Collection = () => {
  const { products } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 border-b border-obsidian/10 pb-6">
        <div>
            <h1 className="text-4xl md:text-6xl font-serif text-obsidian mb-2">
            The Archive
            </h1>
            <p className="text-xs md:text-sm text-stone-500 max-w-md leading-relaxed">
                Timeless artifacts designed for stillness.
            </p>
        </div>
        <div className="mt-6 md:mt-0">
            <span className="text-xs tracking-[0.2em] uppercase opacity-50">
            {products.length} Artifacts
            </span>
        </div>
      </div>

      {/* Product Grid */}
      {/* grid-cols-2 ensures 2 products per row on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10 md:gap-x-8 md:gap-y-16">
        {products.map((product, idx) => (
          <Link 
            key={product.id} 
            to={`/product/${product.id}`} 
            className="group block opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'forwards' }}
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden mb-3 md:mb-6 bg-stone-300">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0"
                loading="lazy"
                width="400"
                height="533"
              />
              <img 
                src={product.images[1] || product.images[0]} 
                alt={`${product.name} Alt`} 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
                loading="lazy"
                width="400"
                height="533"
              />
              
              {/* Badge if low stock or new (optional example) */}
              {!product.inStock && (
                  <div className="absolute top-2 right-2 bg-stone-200/90 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-widest">
                      Sold Out
                  </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col items-start space-y-1">
              <h3 className="font-serif text-sm md:text-2xl leading-tight group-hover:text-stone-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-40">
                {product.category}
              </p>
              <PriceBadge price={product.price} className="mt-2" />
            </div>
          </Link>
        ))}
      </div>
      
      {products.length === 0 && (
          <div className="py-24 text-center opacity-50 font-serif">
              No artifacts found.
          </div>
      )}
    </div>
  );
};

export default Collection;