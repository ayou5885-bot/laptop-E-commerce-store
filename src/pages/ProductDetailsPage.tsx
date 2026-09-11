import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  Cpu,
  Monitor,
  MemoryStick,
  HardDrive,
  Weight,
  MonitorSmartphone,
  Layers,
  Zap,
  Minus,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { getProductBySlug, getRelatedProducts, formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import OptimizedImage from '@/components/OptimizedImage';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-charcoal-900">Product Not Found</h1>
        <p className="mt-2 text-sm text-gray-600">
          The laptop you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-charcoal-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product, 4);
  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    navigate('/cart');
  };

  const specs = [
    { icon: Cpu, label: 'Processor', value: product.processor },
    { icon: Zap, label: 'Graphics', value: product.graphics },
    { icon: MemoryStick, label: 'Memory', value: product.ram },
    { icon: HardDrive, label: 'Storage', value: product.storage },
    { icon: Monitor, label: 'Display', value: product.display },
    { icon: MonitorSmartphone, label: 'Resolution', value: product.resolution },
    { icon: Layers, label: 'OS', value: product.operatingSystem },
    { icon: Weight, label: 'Weight', value: product.weight },
  ];

  const availabilityColor =
    product.availability === 'In Stock'
      ? 'text-green-700 bg-green-50'
      : product.availability === 'Low Stock'
        ? 'text-amber-700 bg-amber-50'
        : 'text-blue-700 bg-blue-50';

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-charcoal-900">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-charcoal-900">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/shop?brand=${product.brand.toLowerCase()}`} className="hover:text-charcoal-900">
          {product.brand}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-charcoal-900">{product.model}</span>
      </nav>

      {/* Back link */}
      <Link
        to="/shop"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-charcoal-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      {/* Main product section */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image gallery */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-8 sm:p-12"
          >
            <OptimizedImage
              src={gallery[selectedImage]}
              alt={`${product.brand} ${product.model}`}
              aspectRatio="4/3"
              objectFit="contain"
              fallbackLabel={product.model}
              className="h-full w-full"
            />
          </motion.div>

          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`overflow-hidden rounded-lg border-2 bg-gray-50 p-2 transition-colors ${
                    selectedImage === idx ? 'border-accent-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <div className="h-16 w-20">
                    <OptimizedImage
                      src={img}
                      alt={`${product.model} thumbnail ${idx + 1}`}
                      aspectRatio="4/3"
                      objectFit="contain"
                      className="h-full w-full"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              {product.brand}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${availabilityColor}`}>
              {product.availability}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
            {product.model}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {product.shortDescription}
          </p>

          {/* Price */}
          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl font-bold text-charcoal-900">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="pb-1 text-base text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            {product.oldPrice && (
              <span className="mb-1 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700">
                Save {formatPrice(product.oldPrice - product.price)}
              </span>
            )}
          </div>

          {/* Quick specs */}
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            {specs.slice(0, 4).map((spec) => (
              <div key={spec.label} className="flex items-start gap-2">
                <spec.icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{spec.label}</p>
                  <p className="truncate text-xs font-medium text-charcoal-900">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-gray-300">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 text-gray-600 transition-colors hover:text-charcoal-900 disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center text-sm font-semibold text-charcoal-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2.5 text-gray-600 transition-colors hover:text-charcoal-900"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-charcoal-900 text-white hover:bg-accent-600'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:border-charcoal-900"
            >
              Buy Now
            </button>
          </div>

          {/* Full Description */}
          <div className="mt-8">
            <h2 className="text-base font-semibold text-charcoal-900">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {product.fullDescription}
            </p>
          </div>

          {/* Features */}
          <div className="mt-6">
            <h2 className="text-base font-semibold text-charcoal-900">Key Features</h2>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 shrink-0 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Full specifications */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-charcoal-900">
          Full Specifications
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            <tbody>
              {specs.map((spec, index) => (
                <tr
                  key={spec.label}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="w-48 px-4 py-3 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-2">
                      <spec.icon className="h-4 w-4 text-gray-400" />
                      {spec.label}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal-900">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold tracking-tight text-charcoal-900">
            Related Laptops
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
