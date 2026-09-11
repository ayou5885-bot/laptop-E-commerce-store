import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import OptimizedImage from '@/components/OptimizedImage';

const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/ayoub123123321321@gmail.com';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function CheckoutPage() {
  const { cartItemsDetailed, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    notes: '',
  });

  const shipping = 0;
  const tax = Math.round(cartSubtotal * 0.08);
  const total = cartSubtotal + shipping + tax;

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const buildOrderMessage = () => {
    const items = cartItemsDetailed
      .map(
        ({ product, quantity }, idx) =>
          `${idx + 1}. ${product.brand} ${product.model}\n` +
          `   Brand: ${product.brand}\n` +
          `   Quantity: ${quantity}\n` +
          `   Unit Price: $${product.price}\n` +
          `   Total: $${product.price * quantity}`,
      )
      .join('\n\n');

    return (
      `=== NEW ORDER REQUEST ===\n\n` +
      `--- CUSTOMER INFORMATION ---\n` +
      `Name: ${formData.fullName}\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email}\n` +
      `City: ${formData.city}\n` +
      `Address: ${formData.address}\n` +
      `Notes: ${formData.notes || 'None'}\n\n` +
      `--- ORDER ---\n${items}\n\n` +
      `--- ORDER SUMMARY ---\n` +
      `Subtotal: $${cartSubtotal}\n` +
      `Shipping: Free\n` +
      `Tax: $${tax}\n` +
      `TOTAL: $${total}`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cartItemsDetailed.length === 0) return;

    setSubmitState('submitting');
    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New Order Request — ${formData.fullName}`,
          _template: 'table',
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          address: formData.address,
          notes: formData.notes || 'None',
          order: cartItemsDetailed
            .map(
              ({ product, quantity }) =>
                `${product.brand} ${product.model} — Qty: ${quantity} — Unit: $${product.price} — Total: $${product.price * quantity}`,
            )
            .join('\n'),
          subtotal: `$${cartSubtotal}`,
          shipping: 'Free',
          tax: `$${tax}`,
          total: `$${total}`,
          _message: buildOrderMessage(),
        }),
      });

      if (response.ok) {
        setSubmitState('success');
        clearCart();
      } else {
        setSubmitState('error');
      }
    } catch {
      setSubmitState('error');
    }
  };

  // Success state
  if (submitState === 'success') {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50"
        >
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </motion.div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-charcoal-900">
          Order Request Submitted!
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600">
          Thank you, {formData.fullName.split(' ')[0]}! Your order request has been received.
          Our team will contact you at <strong>{formData.email}</strong> or{' '}
          <strong>{formData.phone}</strong> within 24 hours to confirm your order and arrange
          delivery.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-lg bg-charcoal-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-charcoal-900 transition-colors hover:border-charcoal-900"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart redirect
  if (cartItemsDetailed.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-charcoal-900">Your Cart is Empty</h1>
        <p className="mt-2 text-sm text-gray-600">
          Add some laptops to your cart before checking out.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-charcoal-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Laptops
        </Link>
      </div>
    );
  }

  const formFields: {
    name: keyof FormData;
    label: string;
    type: string;
    icon: typeof User;
    placeholder: string;
    required: boolean;
  }[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Doe', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+1 (555) 123-4567', required: true },
    { name: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'john@example.com', required: true },
    { name: 'city', label: 'City', type: 'text', icon: MapPin, placeholder: 'San Jose, CA', required: true },
    { name: 'address', label: 'Address', type: 'text', icon: MapPin, placeholder: '123 Main Street, Apt 4B', required: true },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill in your details to submit an order request. No online payment required.
        </p>
      </div>

      <Link
        to="/cart"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-charcoal-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Form fields */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-charcoal-900">
              Customer Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className={field.name === 'address' ? 'sm:col-span-2' : ''}
                >
                  <label
                    htmlFor={field.name}
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                    {field.required && <span className="ml-0.5 text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <field.icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2 ${
                        errors[field.name]
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-accent-600 focus:ring-accent-600/20'
                      }`}
                      aria-invalid={!!errors[field.name]}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
                  )}
                </div>
              ))}

              <div className="sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Order Notes <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any special instructions or delivery preferences..."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-accent-600 focus:ring-2 focus:ring-accent-600/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-charcoal-900">Your Order</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {cartItemsDetailed.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  <div className="h-14 w-18 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50 p-1">
                    <OptimizedImage
                      src={product.image}
                      alt={`${product.brand} ${product.model}`}
                      aspectRatio="4/3"
                      objectFit="contain"
                      fallbackLabel={product.model}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-medium text-charcoal-900">
                      {product.brand} {product.model}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {quantity} × {formatPrice(product.price)}</p>
                    <p className="text-xs font-semibold text-charcoal-900">
                      {formatPrice(product.price * quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-charcoal-900">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-700">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium text-charcoal-900">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-base font-semibold text-charcoal-900">Total</span>
                <span className="text-lg font-bold text-charcoal-900">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitState === 'submitting'}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-charcoal-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
            >
              {submitState === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Order Request
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {submitState === 'error' && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                Something went wrong. Please try again or contact us directly.
              </p>
            )}

            <p className="mt-3 text-center text-xs text-gray-400">
              By submitting, you agree to be contacted about your order.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
