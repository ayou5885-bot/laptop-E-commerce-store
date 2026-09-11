import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types/product';
import { getProductById } from '@/data/products';

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
  cartItemsDetailed: { product: Product; quantity: number }[];
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'laptop_store_cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) =>
          typeof item === 'object' &&
          typeof item.productId === 'number' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0,
      );
    }
    return [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const addToCart = useCallback((productId: number, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== productId);
      }
      return prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (productId: number) => {
      return items.find((item) => item.productId === productId)?.quantity ?? 0;
    },
    [items],
  );

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const cartItemsDetailed = items
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((item): item is { product: Product; quantity: number } => item !== null);

  const cartSubtotal = cartItemsDetailed.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        cartItemsDetailed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
