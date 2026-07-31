import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [], // Keranjang kosong dari awal
      addToCart: (product) => set((state) => {
        const existing = state.items.find((item) => item.id === product.id);
        if (existing) {
          return {
            items: state.items.map((item) => 
              item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item
            ),
          };
        }
        return { items: [...state.items, product] };
      }),
      removeFromCart: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'vocamarket-cart' }
  )
);