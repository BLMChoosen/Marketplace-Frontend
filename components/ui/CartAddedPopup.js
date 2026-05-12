'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, ShoppingCart } from 'lucide-react';
import Button from './Button';
import useCartStore from '../../lib/cartStore';

export default function CartAddedPopup() {
  const router = useRouter();
  const item = useCartStore((s) => s.lastAddedItem);
  const dismissAddedItem = useCartStore((s) => s.dismissAddedItem);

  if (!item) return null;

  const goToCart = () => {
    dismissAddedItem();
    router.push('/cart');
  };

  return (
    <div className="fixed inset-x-4 bottom-4 z-[80] flex justify-center sm:justify-end pointer-events-none">
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Item adicionado ao carrinho"
        className="pointer-events-auto w-full max-w-md bm-panel p-5 shadow-[0_24px_70px_-28px_rgba(163,0,21,0.75)]"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-md bg-[rgba(163,0,21,0.14)] border border-[rgba(163,0,21,0.55)] flex items-center justify-center text-[#A30015] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-white font-black font-heading text-lg">
              Item adicionado ao carrinho
            </h2>
            <p className="text-sm text-[rgb(161,161,170)] truncate mt-1">
              {item.title}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="primary" className="w-full" onClick={goToCart}>
            <ShoppingCart className="w-4 h-4" />
            Ir para o carrinho
          </Button>
          <Button variant="secondary" className="w-full" onClick={dismissAddedItem}>
            Continuar comprando
          </Button>
        </div>
      </div>
    </div>
  );
}
