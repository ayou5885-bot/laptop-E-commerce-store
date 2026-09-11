import { Link } from 'react-router-dom';
import { Laptop, Mail, Phone, MapPin } from 'lucide-react';
import { brands, categories } from '@/data/products';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-charcoal-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2" aria-label="LaptopHub home">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-charcoal-900">
                <Laptop className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Laptop<span className="text-accent-400">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Your trusted destination for premium laptops from the world's leading brands.
              Technology that works for you.
            </p>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Brands</h3>
            <ul className="mt-4 space-y-2">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    to={`/shop?brand=${brand.slug}`}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Categories</h3>
            <ul className="mt-4 space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0" />
                <span>support@laptophub.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+1 (800) 555-0190</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>123 Tech Avenue, San Jose, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} LaptopHub. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Dell, HP, Lenovo, ASUS, Acer, and Apple are trademarks of their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
