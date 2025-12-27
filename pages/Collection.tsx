import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { Link } from 'react-router-dom';
import { PriceBadge } from '../components/PriceBadge';
import { Filter, X, ChevronDown, Check, ArrowUpDown, SlidersHorizontal } from 'lucide-react';

const Collection = () => {
  const { products, orders } = useStore();
  
  // UI State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeSortDropdown, setActiveSortDropdown] = useState(false);

  // Filter State
  const [sortBy, setSortBy] = useState('featured');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileFilterOpen]);

  // --- Dynamic Data Extraction ---
  const allColors = useMemo(() => {
      const colors = new Set<string>();
      products.forEach(p => {
          if (p.name.includes(' in ')) {
              colors.add(p.name.split(' in ')[1].trim());
          }
      });
      return Array.from(colors).sort();
  }, [products]);

  const allMaterials = ['Fleece', 'French Terry', 'Cotton', 'Knit'];
  const allSizes = ['XS', 'S', 'M', 'L', 'XL'];

  // --- Filtering Logic ---
  const filteredProducts = useMemo(() => {
      return products.filter(product => {
          // Color Filter
          if (selectedColors.length > 0) {
              const color = product.name.includes(' in ') ? product.name.split(' in ')[1].trim() : '';
              if (!selectedColors.includes(color)) return false;
          }

          // Material Filter (Search in description)
          if (selectedMaterials.length > 0) {
              const desc = product.description.toLowerCase();
              const hasMaterial = selectedMaterials.some(m => desc.includes(m.toLowerCase()));
              if (!hasMaterial) return false;
          }

          // Size Filter
          if (selectedSizes.length > 0) {
              const hasSize = product.sizes.some(s => selectedSizes.includes(s));
              if (!hasSize) return false;
          }

          return true;
      });
  }, [products, selectedColors, selectedMaterials, selectedSizes]);

  // --- Sorting Logic ---
  const sortedProducts = useMemo(() => {
      const items = [...filteredProducts];
      switch (sortBy) {
          case 'best-selling':
              // Calculate sales volume per product id
              const sales: Record<string, number> = {};
              orders.forEach(o => o.items.forEach(i => {
                  sales[i.id] = (sales[i.id] || 0) + i.quantity;
              }));
              return items.sort((a, b) => (sales[b.id] || 0) - (sales[a.id] || 0));
          case 'title-a-z':
              return items.sort((a, b) => a.name.localeCompare(b.name));
          case 'title-z-a':
              return items.sort((a, b) => b.name.localeCompare(a.name));
          case 'price-low-high':
              return items.sort((a, b) => a.price - b.price);
          case 'price-high-low':
              return items.sort((a, b) => b.price - a.price);
          case 'date-new-old':
              return items; // Assuming default is newest first or ID based
          case 'date-old-new':
              return items.reverse();
          default: // featured
              return items;
      }
  }, [filteredProducts, sortBy, orders]);

  // --- Handlers ---
  const toggleFilter = (item: string, current: string[], setter: (val: string[]) => void) => {
      if (current.includes(item)) {
          setter(current.filter(i => i !== item));
      } else {
          setter([...current, item]);
      }
  };

  const clearAllFilters = () => {
      setSelectedColors([]);
      setSelectedMaterials([]);
      setSelectedSizes([]);
  };

  const activeFilterCount = selectedColors.length + selectedMaterials.length + selectedSizes.length;

  const sortOptions = [
      { label: 'Featured', value: 'featured' },
      { label: 'Best Selling', value: 'best-selling' },
      { label: 'Alphabetically, A-Z', value: 'title-a-z' },
      { label: 'Alphabetically, Z-A', value: 'title-z-a' },
      { label: 'Price, low to high', value: 'price-low-high' },
      { label: 'Price, high to low', value: 'price-high-low' },
      { label: 'Date, new to old', value: 'date-new-old' },
      { label: 'Date, old to new', value: 'date-old-new' },
  ];

  // --- Components ---
  const FilterSection = ({ title, items, selected, setter }: { title: string, items: string[], selected: string[], setter: (v: string[]) => void }) => (
      <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-obsidian mb-4">{title}</h3>
          <div className="space-y-2">
              {items.map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border transition-colors flex items-center justify-center ${selected.includes(item) ? 'bg-obsidian border-obsidian' : 'border-stone-300 group-hover:border-obsidian'}`}>
                          {selected.includes(item) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${selected.includes(item) ? 'text-obsidian font-medium' : 'text-stone-500 group-hover:text-obsidian'}`}>
                          {item}
                      </span>
                      <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selected.includes(item)}
                          onChange={() => toggleFilter(item, selected, setter)}
                      />
                  </label>
              ))}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen pt-4 md:pt-8 pb-24 px-4 md:px-6 max-w-[1600px] mx-auto animate-fade-in relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-obsidian/10 pb-6">
        <div>
            <h1 className="text-4xl md:text-6xl font-serif text-obsidian mb-2">
            The Archive
            </h1>
            <p className="text-xs md:text-sm text-stone-500 max-w-md leading-relaxed">
                Timeless artifacts designed for stillness.
            </p>
        </div>
        
        {/* Desktop Sort & Count */}
        <div className="hidden md:flex items-center gap-8 mt-6 md:mt-0">
            <span className="text-xs tracking-[0.2em] uppercase opacity-50">
            {sortedProducts.length} Artifacts
            </span>
            <div className="relative">
                <button 
                    onClick={() => setActiveSortDropdown(!activeSortDropdown)}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold hover:text-stone-600"
                >
                    Sort by: <span className="opacity-50">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                {activeSortDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone-200 shadow-xl rounded-lg py-2 z-30 animate-fade-in">
                        {sortOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => { setSortBy(option.value); setActiveSortDropdown(false); }}
                                className={`w-full text-left px-4 py-2 text-xs uppercase tracking-widest hover:bg-stone-50 transition-colors ${sortBy === option.value ? 'font-bold text-obsidian' : 'text-stone-500'}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Mobile Controls Bar */}
      <div className="md:hidden flex items-center justify-between py-4 sticky top-14 z-20 bg-stone-200/95 backdrop-blur border-b border-obsidian/5 -mx-4 px-4 mb-6">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold"
          >
              <SlidersHorizontal className="w-4 h-4" /> 
              Filter {activeFilterCount > 0 && <span className="w-4 h-4 bg-obsidian text-white rounded-full flex items-center justify-center text-[9px]">{activeFilterCount}</span>}
          </button>
          
          <div className="flex items-center gap-4">
             <span className="text-[10px] uppercase text-stone-500 tracking-wider">{sortedProducts.length} items</span>
             <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-1 text-xs uppercase tracking-widest font-bold">
                 Sort <ArrowUpDown className="w-3 h-3" />
             </button>
          </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block w-64 sticky top-32 flex-shrink-0 pr-8 border-r border-obsidian/5 min-h-[50vh]">
              <div className="flex justify-between items-center mb-8">
                  <span className="text-xs uppercase tracking-widest opacity-50">Filters</span>
                  {activeFilterCount > 0 && (
                      <button onClick={clearAllFilters} className="text-[10px] uppercase underline text-stone-500 hover:text-obsidian">Clear All</button>
                  )}
              </div>
              
              <FilterSection title="Color" items={allColors} selected={selectedColors} setter={setSelectedColors} />
              <FilterSection title="Material" items={allMaterials} selected={selectedMaterials} setter={setSelectedMaterials} />
              <FilterSection title="Size" items={allSizes} selected={selectedSizes} setter={setSelectedSizes} />
          </aside>

          {/* Product Grid */}
          <div className="flex-1 w-full">
                {sortedProducts.length === 0 ? (
                    <div className="py-24 text-center flex flex-col items-center justify-center opacity-50">
                        <Filter className="w-8 h-8 mb-4 stroke-[1]" />
                        <p className="font-serif text-xl">No artifacts match your search.</p>
                        <button onClick={clearAllFilters} className="mt-4 text-xs uppercase tracking-widest underline">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
                        {sortedProducts.map((product, idx) => (
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
                            {!product.inStock && (
                                <div className="absolute top-2 right-2 bg-stone-200/90 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-widest z-10">
                                    Sold Out
                                </div>
                            )}
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <div className="absolute top-2 left-2 bg-red-900/90 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-widest text-white rounded-sm shadow-sm z-10">
                                    Sale
                                </div>
                            )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col items-start space-y-1">
                            <h3 className="font-serif text-sm md:text-xl leading-tight group-hover:text-stone-600 transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-40">
                                {product.category}
                            </p>
                            <PriceBadge price={product.price} compareAtPrice={product.compareAtPrice} className="mt-2" />
                            </div>
                        </Link>
                        ))}
                    </div>
                )}
          </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[60] flex flex-col md:hidden">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-obsidian/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
              
              {/* Drawer Content */}
              <div className="absolute inset-x-0 bottom-0 top-20 bg-stone-50 rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-white">
                      <h2 className="font-serif text-xl">Filter & Sort</h2>
                      <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 -mr-2 text-stone-500">
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      {/* Sort Options */}
                      <div className="mb-8 pb-8 border-b border-stone-200">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-obsidian mb-4">Sort By</h3>
                          <div className="grid grid-cols-2 gap-3">
                              {sortOptions.map(option => (
                                  <button
                                      key={option.value}
                                      onClick={() => setSortBy(option.value)}
                                      className={`px-3 py-2 text-xs text-left rounded border transition-colors ${
                                          sortBy === option.value 
                                          ? 'bg-obsidian text-white border-obsidian' 
                                          : 'bg-white text-stone-600 border-stone-200'
                                      }`}
                                  >
                                      {option.label}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Filters */}
                      <FilterSection title="Color" items={allColors} selected={selectedColors} setter={setSelectedColors} />
                      <FilterSection title="Material" items={allMaterials} selected={selectedMaterials} setter={setSelectedMaterials} />
                      <FilterSection title="Size" items={allSizes} selected={selectedSizes} setter={setSelectedSizes} />
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 border-t border-stone-200 bg-white flex gap-4">
                      <button 
                        onClick={clearAllFilters}
                        className="flex-1 py-3 text-xs uppercase tracking-widest font-bold border border-stone-300 rounded hover:bg-stone-50"
                      >
                          Clear ({activeFilterCount})
                      </button>
                      <button 
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="flex-1 py-3 bg-obsidian text-white text-xs uppercase tracking-widest font-bold rounded shadow-lg"
                      >
                          View {sortedProducts.length} Items
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Collection;