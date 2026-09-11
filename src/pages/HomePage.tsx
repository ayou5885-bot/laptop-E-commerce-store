import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Cpu,
  ShieldCheck,
  Truck,
  Headphones,
  Laptop,
  Zap,
  Briefcase,
  Gamepad2,
  Palette,
  Sparkles,
} from 'lucide-react';
import { products, brands, categories, formatPrice } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import OptimizedImage from '@/components/OptimizedImage';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  const categoryIcons: Record<string, typeof Cpu> = {
    Business: Briefcase,
    Gaming: Gamepad2,
    Ultrabook: Zap,
    Everyday: Laptop,
    Creative: Palette,
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
                <Sparkles className="h-3.5 w-3.5 text-accent-600" />
                40+ laptops from top brands
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-charcoal-900 sm:text-5xl lg:text-6xl">
                Technology that
                <br />
                works for you.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
                Discover premium laptops engineered for performance, productivity, gaming, and
                portability. From the world's most trusted brands — all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-lg bg-charcoal-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  Shop All Laptops
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/shop?category=gaming"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:border-charcoal-900"
                >
                  Explore Gaming
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-8">
                <div>
                  <p className="text-2xl font-bold text-charcoal-900">40+</p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-charcoal-900">6</p>
                  <p className="text-xs text-gray-500">Top Brands</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-charcoal-900">5</p>
                  <p className="text-xs text-gray-500">Categories</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-md rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-12 lg:max-w-lg">
                <div className="aspect-square">
                  <OptimizedImage
                    src={products[2].image}
                    alt="Featured premium laptop"
                    aspectRatio="1/1"
                    objectFit="contain"
                    fallbackLabel="Premium Laptop"
                    className="h-full w-full"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:-left-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Warranty Included</p>
                    <p className="text-xs text-gray-500">On every purchase</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust/Value Section */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-100 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On all orders' },
            { icon: ShieldCheck, title: '2-Year Warranty', desc: 'Manufacturer backed' },
            { icon: Cpu, title: 'Genuine Products', desc: 'Authorized retailer' },
            { icon: Headphones, title: 'Expert Support', desc: 'Mon–Sat, 9am–6pm' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 px-4 py-6 lg:px-6">
              <item.icon className="h-6 w-6 shrink-0 text-accent-600" />
              <div>
                <p className="text-sm font-semibold text-charcoal-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Laptops */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
              Featured Laptops
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hand-picked highlights from our top brands
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden items-center gap-1 text-sm font-semibold text-accent-700 hover:text-accent-800 sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
              Shop by Brand
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose from the world's leading laptop manufacturers
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/shop?brand=${brand.slug}`}
                  className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-8 text-center transition-all hover:border-charcoal-900 hover:shadow-md"
                >
                  <span className="text-lg font-bold text-charcoal-900">{brand.name}</span>
                  <span className="mt-1 text-xs text-gray-500">
                    {brand.productCount} {brand.productCount === 1 ? 'product' : 'products'}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
            Shop by Category
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Find the perfect laptop for your needs
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => {
            const Icon = categoryIcons[cat.name] || Laptop;
            const count = products.filter((p) => p.category === cat.name).length;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-charcoal-900 hover:shadow-md"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-charcoal-900 transition-colors group-hover:bg-charcoal-900 group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-charcoal-900">{cat.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">{cat.description}</p>
                    <p className="mt-1 text-xs font-medium text-accent-700">
                      {count} {count === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
                  Best Sellers
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Our most popular laptops, loved by customers
                </p>
              </div>
              <Link
                to="/shop"
                className="hidden items-center gap-1 text-sm font-semibold text-accent-700 hover:text-accent-800 sm:flex"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {bestSellers.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
                New Arrivals
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                The latest laptops to hit our shelves
              </p>
            </div>
            <Link
              to="/shop?sort=newest"
              className="hidden items-center gap-1 text-sm font-semibold text-accent-700 hover:text-accent-800 sm:flex"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-charcoal-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to find your next laptop?
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Browse our full catalog of 40+ laptops from Dell, HP, Lenovo, ASUS, Acer, and Apple.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-accent-600 hover:text-white"
            >
              Browse All Laptops
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
