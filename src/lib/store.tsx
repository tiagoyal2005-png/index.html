import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/data/catalog";

export type CartLine = { slug: string; qty: number; variant?: string };

export type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

export type Order = {
  id: string;
  placedAt: string;
  items: { slug: string; name: string; qty: number; price: number; variant?: string }[];
  total: number;
  paymentMethod: string;
  address: Address | null;
  status: "Confirmed" | "In production" | "Shipped" | "Delivered";
  trackingSteps: { label: string; done: boolean }[];
};

export type User = { name: string; email: string };

type StoreState = {
  cart: CartLine[];
  wishlist: string[];
  user: User | null;
  addresses: Address[];
  orders: Order[];
};

const EMPTY: StoreState = {
  cart: [],
  wishlist: [],
  user: null,
  addresses: [],
  orders: [],
};

const KEY = "actdf-store-v1";

type StoreContextValue = StoreState & {
  hydrated: boolean;
  addToCart: (slug: string, qty?: number, variant?: string) => void;
  updateQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  saveAddress: (address: Omit<Address, "id">) => Address;
  placeOrder: (input: { paymentMethod: string; address: Address | null }) => Order;
  cartCount: number;
  cartLines: { product: Product; qty: number; variant?: string }[];
  subtotal: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as StoreState) });
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const addToCart = useCallback((slug: string, qty = 1, variant?: string) => {
    setState((s) => {
      const existing = s.cart.find((l) => l.slug === slug);
      const cart = existing
        ? s.cart.map((l) =>
            l.slug === slug
              ? { slug: l.slug, qty: l.qty + qty, ...(variant ?? l.variant ? { variant: (variant ?? l.variant) as string } : {}) }
              : l,
          )
        : [...s.cart, { slug, qty, ...(variant ? { variant } : {}) }];
      return { ...s, cart };
    });
  }, []);

  const updateQty = useCallback((slug: string, qty: number) => {
    setState((s) => ({
      ...s,
      cart: qty <= 0 ? s.cart.filter((l) => l.slug !== slug) : s.cart.map((l) => (l.slug === slug ? { ...l, qty } : l)),
    }));
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((l) => l.slug !== slug) }));
  }, []);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), []);

  const toggleWishlist = useCallback((slug: string) => {
    setState((s) => ({
      ...s,
      wishlist: s.wishlist.includes(slug)
        ? s.wishlist.filter((w) => w !== slug)
        : [...s.wishlist, slug],
    }));
  }, []);

  const signIn = useCallback((user: User) => setState((s) => ({ ...s, user })), []);
  const signOut = useCallback(() => setState((s) => ({ ...s, user: null })), []);

  const saveAddress = useCallback((address: Omit<Address, "id">) => {
    const created: Address = { ...address, id: `addr-${Date.now()}` };
    setState((s) => ({ ...s, addresses: [...s.addresses, created] }));
    return created;
  }, []);

  const cartLines = useMemo(
    () =>
      state.cart
        .map((line) => {
          const product = products.find((p) => p.slug === line.slug);
          return product ? { product, qty: line.qty, ...(line.variant ? { variant: line.variant } : {}) } : null;
        })
        .filter((v): v is { product: Product; qty: number; variant?: string } => v !== null),
    [state.cart],
  );

  const subtotal = useMemo(
    () => cartLines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    [cartLines],
  );

  const placeOrder = useCallback<StoreContextValue["placeOrder"]>(
    ({ paymentMethod, address }) => {
      const items = cartLines.map((l) => ({
        slug: l.product.slug,
        name: l.product.name,
        qty: l.qty,
        price: l.product.price,
        ...(l.variant ? { variant: l.variant } : {}),
      }));
      const order: Order = {
        id: `ACTDF-${String(Date.now()).slice(-6)}`,
        placedAt: new Date().toISOString(),
        items,
        total: items.reduce((s, i) => s + i.price * i.qty, 0),
        paymentMethod,
        address,
        status: "Confirmed",
        trackingSteps: [
          { label: "Order confirmed", done: true },
          { label: "Preparing your piece", done: false },
          { label: "Shipped", done: false },
          { label: "Delivered", done: false },
        ],
      };
      setState((s) => ({ ...s, orders: [order, ...s.orders], cart: [] }));
      return order;
    },
    [cartLines],
  );

  const value: StoreContextValue = {
    ...state,
    hydrated,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted: (slug) => state.wishlist.includes(slug),
    signIn,
    signOut,
    saveAddress,
    placeOrder,
    cartCount: state.cart.reduce((n, l) => n + l.qty, 0),
    cartLines,
    subtotal,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
