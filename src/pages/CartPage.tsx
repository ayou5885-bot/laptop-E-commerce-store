import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import OptimizedImage from '@/components/OptimizedImage';

export default function CartPage() {
  const { cartItemsDetailed, cartSubtotal, updateQuantity, removeFromCart, clearCart, cartCount } =
    useCart();

  if (cartItemsDetailed.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ShoppingCart className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-charcoal-900">Your Cart is Empty</h1>
        <p className="mt-2 text-sm text-gray-600">
          Browse our catalog and add laptops to your cart to get started.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-charcoal-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shipping = 0;
  const tax = Math.round(cartSubtotal * 0.08);
  const total = cartSubtotal + shipping + tax;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            <AnimatePresence>
              {cartItemsDetailed.map(({ product, quantity }) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <Link
                    to={`/product/${product.slug}`}
                    className="shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
                  >
                    <div className="h-24 w-32 p-2">
                      <OptimizedImage
                        src={product.image}
                        alt={`${product.brand} ${product.model}`}
                        aspectRatio="4/3"
                        objectFit="contain"
                        fallbackLabel={product.model}
                        className="h-full w-full"
                      />
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          {product.brand}
                        </span>
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="text-sm font-semibold text-charcoal-900 hover:text-accent-700">
                            {product.model}
                          </h3>
                        </Link>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {product.processor.split('(')[0].trim()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
                        aria-label={`Remove ${product.model} from cart`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="flex items-center rounded-lg border border-gray-300">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-2 text-gray-600 transition-colors hover:text-charcoal-900"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-charcoal-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-2 text-gray-600 transition-colors hover:text-charcoal-900"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {formatPrice(product.price)} each
                        </p>
                        <p className="text-base font-bold text-charcoal-900">
                          {formatPrice(product.price * quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Link
            to="/shop"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-charcoal-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-charcoal-900">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-charcoal-900">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-700">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax</span>
                <span className="font-medium text-charcoal-900">{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-charcoal-900">Total</span>
                  <span className="text-xl font-bold text-charcoal-900">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-charcoal-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-3 text-center text-xs text-gray-400">
              No online payment — submit an order request
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
