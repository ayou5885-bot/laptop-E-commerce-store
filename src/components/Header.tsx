import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Laptop } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products, brands } from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandsOpen, setBrandsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const brandsTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setBrandsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-charcoal-900' : 'text-gray-600 hover:text-charcoal-900'
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="LaptopHub home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal-900 text-white">
              <Laptop className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-charcoal-900">
              Laptop<span className="text-accent-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/shop" className={navLinkClass}>
              Shop
            </NavLink>
            <div
              className="relative"
              onMouseEnter={() => {
                clearTimeout(brandsTimeoutRef.current);
                setBrandsOpen(true);
              }}
              onMouseLeave={() => {
                brandsTimeoutRef.current = setTimeout(() => setBrandsOpen(false), 200);
              }}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-charcoal-900"
                aria-expanded={brandsOpen}
              >
                Brands
              </button>
              <AnimatePresence>
                {brandsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 top-full -translate-x-1/2 pt-2"
                  >
                    <div className="w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg shadow-gray-200/50">
                      {brands.map((brand) => (
                        <Link
                          key={brand.slug}
                          to={`/shop?brand=${brand.slug}`}
                          className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-charcoal-900"
                        >
                          <span>{brand.name}</span>
                          <span className="text-xs text-gray-400">{brand.productCount}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal-900"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/cart"
              className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal-900"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-100 bg-white"
            >
              <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for laptops, brands..."
                    className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-sm text-charcoal-900 placeholder-gray-400 outline-none transition focus:border-accent-600 focus:ring-2 focus:ring-accent-600/20"
                  />
                </form>
                {searchResults.length > 0 && (
                  <div className="mt-2 rounded-lg border border-gray-100 bg-white py-2 shadow-sm">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <span className="text-charcoal-900">
                          <span className="font-medium">{product.brand}</span> {product.model}
                        </span>
                        <span className="text-gray-500">${product.price}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-charcoal-900/20 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-l border-gray-200 bg-white px-4 py-6 md:hidden"
            >
              <div className="space-y-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-gray-100 text-charcoal-900' : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/shop"
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-gray-100 text-charcoal-900' : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  Shop
                </NavLink>
              </div>
              <div className="mt-6">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Brands
                </p>
                <div className="mt-2 space-y-1">
                  {brands.map((brand) => (
                    <Link
                      key={brand.slug}
                      to={`/shop?brand=${brand.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {brand.name} ({brand.productCount})
                    </Link>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
