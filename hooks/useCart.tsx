"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const CART_STORAGE_KEY = "steroidssupplies-cart-v1";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type AddCartItemInput = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: AddCartItemInput) => void;
  openCartSidebar: () => void;
  cartSidebarOpenSignal: number;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is CartItem =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as CartItem).id === "string" &&
          typeof (item as CartItem).name === "string" &&
          typeof (item as CartItem).price === "number" &&
          typeof (item as CartItem).quantity === "number",
      )
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Math.floor(item.quantity)),
      }));
  } catch {
    // Ignore malformed local storage payload.
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCartFromStorage);
  const [cartSidebarOpenSignal, setCartSidebarOpenSignal] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: AddCartItemInput) => {
    const quantityToAdd = Math.max(1, Math.floor(item.quantity ?? 1));

    setItems((current) => {
      const existing = current.find((x) => x.id === item.id);
      if (!existing) {
        return [
          ...current,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantityToAdd,
          },
        ];
      }

      return current.map((x) =>
        x.id === item.id ? { ...x, quantity: x.quantity + quantityToAdd } : x,
      );
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const openCartSidebar = useCallback(() => {
    setCartSidebarOpenSignal((current) => current + 1);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.id !== id);
      }
      return current.map((item) =>
        item.id === id ? { ...item, quantity: Math.floor(quantity) } : item,
      );
    });
  }, []);

  const incrementItem = useCallback(
    (id: string) => {
      const target = items.find((item) => item.id === id);
      if (!target) {
        return;
      }
      updateQuantity(id, target.quantity + 1);
    },
    [items, updateQuantity],
  );

  const decrementItem = useCallback(
    (id: string) => {
      const target = items.find((item) => item.id === id);
      if (!target) {
        return;
      }
      updateQuantity(id, target.quantity - 1);
    },
    [items, updateQuantity],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      addItem,
      openCartSidebar,
      cartSidebarOpenSignal,
      removeItem,
      incrementItem,
      decrementItem,
      updateQuantity,
      clearCart,
    };
  }, [
    addItem,
    cartSidebarOpenSignal,
    clearCart,
    decrementItem,
    incrementItem,
    items,
    openCartSidebar,
    removeItem,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
