'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      lastAddedItem: null,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const cartItem = {
            id: product.id,
            title: product.title || product.name,
            price: parseFloat(product.price),
            image_url: product.image_url || '',
            store_id: product.store_id,
            quantity,
          };
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              lastAddedItem: cartItem,
            };
          }
          return {
            items: [...state.items, cartItem],
            lastAddedItem: cartItem,
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === productId ? { ...i, quantity: Math.max(0, quantity) } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),

      dismissAddedItem: () => set({ lastAddedItem: null }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      toCheckoutPayload: () =>
        get().items.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
        })),
    }),
    {
      name: 'marketplace-cart',
      version: 1,
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
