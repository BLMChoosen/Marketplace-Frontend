'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import useCartStore from '../../lib/cartStore';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const toCheckoutPayload = useCartStore((s) => s.toCheckoutPayload);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { setHydrated(true); }, []);

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
      // Store data for checkout page
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
    return <div className="container mx-auto px-4 py-12 text-white">Carregando carrinho...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-8">
        Seu Carrinho
      </h1>

      {items.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center">
          <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-lg text-white font-medium mb-1">Seu carrinho está vazio</p>
          <p className="text-gray-400 mb-6">Adicione produtos para continuar.</p>
          <Link href="/products">
            <Button variant="primary" size="md">Explorar produtos</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="glass-panel rounded-2xl p-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden shrink-0">
                  <img
                    src={item.image_url || `https://picsum.photos/seed/${item.id}/200/200`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-white truncate">{item.title}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">R$ {item.price.toFixed(2)} cada</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 mt-1">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clear} className="text-sm text-gray-400 hover:text-red-400 transition-colors">
              Limpar carrinho
            </button>
          </div>

          {/* Summary */}
          <div className="glass-panel rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Resumo</h2>

            <div className="space-y-3 mb-6 border-b border-white/10 pb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-400">
                  <span className="truncate mr-2">{item.title} x{item.quantity}</span>
                  <span className="shrink-0">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-white font-bold text-lg mb-6">
              <span>Total</span>
              <span>R$ {totalPrice().toFixed(2)}</span>
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
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
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
              {user ? 'Ir para Pagamento' : 'Fazer login para comprar'}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Pagamento seguro via Stripe
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
