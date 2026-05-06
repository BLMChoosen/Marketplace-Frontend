'use client';

import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ImageOff, Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import useCartStore from '../../lib/cartStore';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { resolveImageUrl } from '../../lib/media';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const toCheckoutPayload = useCartStore((s) => s.toCheckoutPayload);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const handleProceedToCheckout = async () => {
    if (!user) { router.push('/login'); return; }
    if (!shippingAddress.trim()) { setErrorMsg('Informe o endereço de entrega.'); return; }
    if (items.length === 0) return;

    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await api.post('/payments/intent', {
        items: toCheckoutPayload(),
        shipping_address: shippingAddress,
      });
      sessionStorage.setItem('checkout_data', JSON.stringify({
        client_secret: res.data.client_secret,
        publishable_key: res.data.publishable_key,
        order: res.data.order,
      }));
      clear();
      router.push(`/checkout?order_id=${res.data.order.id}`);
    } catch (err) {
      console.error('Checkout initiation failed', err);
      setErrorMsg(err.response?.data?.error || 'Falha ao iniciar pagamento');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return <div className="bm-container py-12 text-white">Carregando carrinho...</div>;
  }

  return (
    <div className="bm-page bm-container py-16">
      <div className="mb-10">
        <div className="bm-kicker mb-3">Carrinho</div>
        <h1 className="text-4xl md:text-5xl font-black font-heading text-white">
          Sua coleção
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="bm-empty p-16">
          <ShoppingCart className="w-12 h-12 text-[#A30015] mx-auto mb-4" />
          <p className="text-lg text-white font-medium mb-1">Seu carrinho está vazio</p>
          <p className="text-[rgb(161,161,170)] mb-6">Adicione produtos para continuar.</p>
          <Link href="/products">
            <Button variant="primary" size="md">Explorar produtos</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bm-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative w-20 h-20 rounded-md bg-[rgb(20,20,19)] overflow-hidden shrink-0 border border-[rgba(255,255,255,0.04)]">
                  {resolveImageUrl(item.image_url) ? (
                    <Image
                      src={resolveImageUrl(item.image_url)}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-6 h-6 text-[rgb(80,80,85)]" />
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0 w-full">
                  <h3 className="font-medium text-white truncate">{item.title}</h3>
                  <p className="text-sm text-[rgb(161,161,170)] mt-0.5">R$ {item.price.toFixed(2)} cada</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-md bg-black border border-[rgba(255,255,255,0.06)] hover:border-[#A30015] hover:text-[#A30015] text-white flex items-center justify-center transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-md bg-black border border-[rgba(255,255,255,0.06)] hover:border-[#A30015] hover:text-[#A30015] text-white flex items-center justify-center transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-white font-black">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-[#A30015] hover:text-white transition-colors mt-1">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clear} className="text-sm text-[rgb(161,161,170)] hover:text-[#A30015] transition-colors uppercase">
              Limpar carrinho
            </button>
          </div>

          {/* Summary */}
          <div className="bm-panel p-6 h-fit sticky top-24">
            <h2 className="text-xl font-black font-heading text-white mb-6 uppercase">Resumo</h2>

            <div className="space-y-3 mb-6 border-b border-[rgba(255,255,255,0.06)] pb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-[rgb(161,161,170)]">
                  <span className="truncate mr-2">{item.title} × {item.quantity}</span>
                  <span className="shrink-0 text-white">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-white font-black text-lg mb-6">
              <span className="uppercase">Total</span>
              <span className="text-[#A30015]">R$ {totalPrice().toFixed(2)}</span>
            </div>

            <div className="mb-4">
              <Input
                label="Endereço de entrega"
                placeholder="Rua, número, bairro, cidade..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bm-danger text-sm">
                {errorMsg}
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleProceedToCheckout}
              isLoading={submitting}
              disabled={authLoading}
            >
              {user ? 'Ir para pagamento' : 'Fazer login para comprar'}
            </Button>

            <p className="text-[10px] text-[rgb(120,120,125)] text-center mt-3 uppercase">
              Pagamento seguro · Stripe
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
