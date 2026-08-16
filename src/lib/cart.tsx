"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  /** Ключ позиции: один и тот же вариант не дублируется. */
  id: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
};

type State = { items: CartItem[] };

type Action =
  | { type: "add"; item: Omit<CartItem, "qty">; qty?: number }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

const STORAGE_KEY = "artsystema-cart";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const qty = action.qty ?? 1;
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + qty } : i,
          ),
        };
      }
      return { items: [...state.items, { ...action.item, qty }] };
    }
    case "remove":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "setQty":
      // Уход в ноль — это удаление позиции, а не строка с «0 шт.».
      if (action.qty < 1) return { items: state.items.filter((i) => i.id !== action.id) };
      return {
        items: state.items.map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i)),
      };
    case "clear":
      return { items: [] };
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** Последняя добавленная позиция — для всплывающего подтверждения. */
  lastAdded: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isOpen, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Читаем корзину только на клиенте — иначе SSR-разметка разойдётся с DOM.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) as CartItem[] });
    } catch {
      // Приватный режим / переполнение — просто стартуем с пустой корзиной.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return; // не затираем сохранённое пустым стартовым состоянием
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* хранилище недоступно — корзина живёт в памяти */
    }
  }, [state.items, hydrated]);

  // Тост «добавлено» гаснет сам.
  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(() => setLastAdded(null), 2600);
    return () => clearTimeout(t);
  }, [lastAdded]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((s, i) => s + i.qty, 0);
    const total = state.items.reduce((s, i) => s + i.qty * i.price, 0);
    return {
      items: state.items,
      count,
      total,
      add: (item, qty) => {
        dispatch({ type: "add", item, qty });
        setLastAdded(`${item.name} — ${item.variant}`);
      },
      remove: (id) => dispatch({ type: "remove", id }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      clear: () => dispatch({ type: "clear" }),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      lastAdded,
    };
  }, [state.items, isOpen, lastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart должен вызываться внутри <CartProvider>");
  return ctx;
}
