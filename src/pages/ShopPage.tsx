import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products, brands, categories } from '@/data/products';
import type { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest';

const ramOptions = ['8 GB', '16 GB', '32 GB'];
const storageOptions = ['256 GB', '512 GB', '1 TB'];

function matchesRam(productRam: string, filter: string): boolean {
  const ramGB = parseInt(productRam.match(/\d+/)?.[0] || '0', 10);
  const filterGB = parseInt(filter, 10);
  return ramGB >= filterGB;
}

function matchesStorage(productStorage: string, filter: string): boolean {
  const storageGB = parseInt(productStorage.match(/\d+/)?.[0] || '0', 10);
  const filterGB = parseInt(filter, 10);
  if (filter === '1 TB') return storageGB >= 1000;
  return storageGB >= filterGB;
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand') ? [searchParams.get('brand')!] : [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : [],
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2500]);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'featured',
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync from URL on mount / URL change
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const sort = (searchParams.get('sort') as SortOption) || 'featured';

    setSearchQuery(q);
    setSelectedBrands(brand ? [brand] : []);
    setSelectedCategories(category ? [category] : []);
    setSortBy(sort);
  }, [searchParams]);

  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ q: searchQuery.trim() || null });
  };

  const toggleBrand = (slug: string) => {
    setSelectedBrands((prev) => {
      const next = prev.includes(slug) ? [] : [slug];
      updateURL({ brand: next[0] || null });
      return next;
    });
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(slug) ? [] : [slug];
      updateURL({ category: next[0] || null });
      return next;
    });
  };

  const filteredProducts = useMemo(() => {
    let result: Product[] = [...products];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.model.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.processor.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      const brandNames = selectedBrands.map(
        (slug) => brands.find((b) => b.slug === slug)?.name || '',
      );
      result = result.filter((p) => brandNames.includes(p.brand));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      const categoryNames = selectedCategories.map(
        (slug) => categories.find((c) => c.slug === slug)?.name || '',
      );
      result = result.filter((p) => categoryNames.includes(p.category));
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    // RAM filter
    if (selectedRam.length > 0) {
      result = result.filter((p) =>
        selectedRam.some((ram) => matchesRam(p.ram, ram)),
      );
    }

    // Storage filter
    if (selectedStorage.length > 0) {
      result = result.filter((p) =>
        selectedStorage.some((storage) => matchesStorage(p.storage, storage)),
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [searchQuery, selectedBrands, selectedCategories, priceRange, selectedRam, selectedStorage, sortBy]);

  const activeFilterCount =
    selectedBrands.length +
    selectedCategories.length +
    selectedRam.length +
    selectedStorage.length +
    (priceRange[0] > 0 || priceRange[1] < 2500 ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 2500]);
    setSelectedRam([]);
    setSelectedStorage([]);
    setSearchQuery('');
    updateURL({ q: null, brand: null, category: null, sort: null });
    setSortBy('featured');
  };

  const FilterSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-100 py-5 first:pt-0">
      <h3 className="mb-3 text-sm font-semibold text-charcoal-900">{title}</h3>
      {children}
    </div>
  );

  const FilterContent = () => (
    <>
      <FilterSection title="Brand">
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand.slug} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.slug)}
                onChange={() => toggleBrand(brand.slug)}
                className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-600"
              />
              <span className="text-sm text-gray-700">
                {brand.name}
                <span className="ml-1 text-xs text-gray-400">({brand.productCount})</span>
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category">
        <div className="space-y-2">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;
            return (
              <label key={cat.slug} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-600"
                />
                <span className="text-sm text-gray-700">
                  {cat.name}
                  <span className="ml-1 text-xs text-gray-400">({count})</span>
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-accent-600 focus:ring-1 focus:ring-accent-600"
              placeholder="Min"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              min={priceRange[0]}
              max={5000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-accent-600 focus:ring-1 focus:ring-accent-600"
              placeholder="Max"
            />
          </div>
          <input
            type="range"
            min={0}
            max={2500}
            step={50}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-accent-600"
          />
          <p className="text-xs text-gray-500">
            ${priceRange[0]} — ${priceRange[1]}
          </p>
        </div>
      </FilterSection>

      <FilterSection title="RAM">
        <div className="space-y-2">
          {ramOptions.map((ram) => (
            <label key={ram} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedRam.includes(ram)}
                onChange={() =>
                  setSelectedRam((prev) =>
                    prev.includes(ram) ? prev.filter((r) => r !== ram) : [...prev, ram],
                  )
                }
                className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-600"
              />
              <span className="text-sm text-gray-700">{ram} or more</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Storage">
        <div className="space-y-2">
          {storageOptions.map((storage) => (
            <label key={storage} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedStorage.includes(storage)}
                onChange={() =>
                  setSelectedStorage((prev) =>
                    prev.includes(storage)
                      ? prev.filter((s) => s !== storage)
                      : [...prev, storage],
                  )
                }
                className="h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-600"
              />
              <span className="text-sm text-gray-700">{storage} or more</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-charcoal-900 hover:text-charcoal-900"
        >
          Clear All Filters
        </button>
      )}
    </>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
          Shop Laptops
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {/* Search + sort bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search laptops, brands, processors..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-accent-600 focus:ring-2 focus:ring-accent-600/20"
          />
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-charcoal-900 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                updateURL({ sort: e.target.value === 'featured' ? null : e.target.value });
              }}
              className="appearance-none rounded-lg border border-gray-300 py-2.5 pl-3 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-accent-600 focus:ring-2 focus:ring-accent-600/20"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Filters
              </h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-medium text-accent-700 hover:text-accent-800"
                >
                  Clear all
                </button>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
              <Search className="mb-4 h-10 w-10 text-gray-300" />
              <h3 className="text-lg font-semibold text-charcoal-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 rounded-lg bg-charcoal-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-charcoal-900/30 lg:hidden"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed bottom-0 left-0 top-16 z-50 h-[calc(100vh-4rem)] w-80 max-w-[85vw] overflow-y-auto bg-white px-5 py-6 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-charcoal-900">Filters</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
