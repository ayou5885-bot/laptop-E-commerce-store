import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/types/product';
import { formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  const availabilityColor =
    product.availability === 'In Stock'
      ? 'text-green-700 bg-green-50'
      : product.availability === 'Low Stock'
        ? 'text-amber-700 bg-amber-50'
        : 'text-blue-700 bg-blue-50';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg hover:shadow-gray-200/50"
    >
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden bg-gray-50"
        aria-label={`${product.brand} ${product.model}`}
      >
        <div className="aspect-[4/3] p-6 transition-transform duration-300 group-hover:scale-105">
          <OptimizedImage
            src={product.image}
            alt={`${product.brand} ${product.model}`}
            aspectRatio="4/3"
            objectFit="contain"
            fallbackLabel={product.model}
            className="h-full w-full"
          />
        </div>
        {(product.isNew || product.oldPrice) && (
          <div className="absolute left-3 top-3 flex gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-charcoal-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                New
              </span>
            )}
            {product.oldPrice && (
              <span className="rounded-full bg-accent-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                Sale
              </span>
            )}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {product.brand}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${availabilityColor}`}>
            {product.availability}
          </span>
        </div>

        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-charcoal-900 transition-colors group-hover:text-accent-700">
            {product.model}
          </h3>
        </Link>

        <p className="mt-1 text-xs text-gray-500">{product.processor.split('(')[0].trim()}</p>

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between">
            <div>
              {product.oldPrice && (
                <span className="block text-xs text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              <span className="text-lg font-bold text-charcoal-900">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="flex gap-1.5">
              <Link
                to={`/product/${product.slug}`}
                className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:border-charcoal-900 hover:text-charcoal-900"
                aria-label={`View ${product.model} details`}
              >
                <Eye className="h-4 w-4" />
              </Link>
              <button
                onClick={() => addToCart(product.id)}
                className="rounded-lg bg-charcoal-900 p-2 text-white transition-colors hover:bg-accent-600"
                aria-label={`Add ${product.model} to cart`}
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
