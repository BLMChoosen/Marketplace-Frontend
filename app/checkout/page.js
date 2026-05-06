'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { ShieldCheck, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

// ─── Payment Form ────────────────────────────────────────────────────────────
function PaymentForm({ order, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setErrorMsg('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order_id=${order.id}`,
      },
    });

    // Only reached if confirmPayment fails immediately (redirect didn't happen)
    if (error) {
      setErrorMsg(error.message || 'Pagamento falhou. Tente novamente.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-xl border border-white/10 bg-white/5">
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: { billingDetails: { address: { country: 'never' } } },
          }}
        />
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full gap-2"
        isLoading={submitting}
        disabled={!stripe || !elements}
      >
        <Lock className="w-4 h-4" />
        Pagar R$ {parseFloat(order.total_amount).toFixed(2)}
      </Button>

      <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5" />
        Pagamento criptografado e seguro via Stripe
      </p>
    </form>
  );
}

// ─── Checkout Inner ──────────────────────────────────────────────────────────
function CheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get('order_id');

  const [checkoutData, setCheckoutData] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const raw = sessionStorage.getItem('checkout_data');
      if (!raw) {
        setErrorMsg('Sessão de pagamento expirada. Volte ao carrinho.');
        setLoading(false);
        return;
      }

      const data = JSON.parse(raw);

      if (!data.client_secret || !data.publishable_key || !data.order) {
        setErrorMsg('Dados de pagamento inválidos. Volte ao carrinho.');
        setLoading(false);
        return;
      }

      setCheckoutData(data);
      setStripePromise(loadStripe(data.publishable_key));
      setLoading(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-white">
        Carregando checkout...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-red-400 mb-4">{errorMsg}</p>
        <Button variant="primary" onClick={() => router.push('/cart')}>
          Voltar ao Carrinho
        </Button>
      </div>
    );
  }

  const { client_secret, order } = checkoutData;

  const elementsOptions = {
    clientSecret: client_secret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#1e293b',
        colorText: '#f8fafc',
        colorDanger: '#ef4444',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-bold font-heading text-white mb-6">Resumo do pedido</h2>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-300">
                  {item.product_title || `Produto #${item.product_id}`} × {item.quantity}
                </span>
                <span className="text-white font-medium">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-lg">
              <span>Total</span>
              <span>R$ {parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
            {order.shipping_address && (
              <div className="text-xs text-gray-400 pt-2 border-t border-white/10">
                <span className="font-medium text-gray-300">Entrega: </span>
                {order.shipping_address}
              </div>
            )}
          </div>

          <div className="mt-6 glass-panel rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white font-medium">Compra 100% Segura</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Seus dados de pagamento são criptografados pela Stripe. Nunca armazenamos seu cartão.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div>
          <h1 className="text-xl font-bold font-heading text-white mb-6">Pagamento</h1>
          <div className="glass-panel rounded-2xl p-6">
            <Elements stripe={stripePromise} options={elementsOptions}>
              <PaymentForm order={order} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page Export (Suspense required for useSearchParams) ─────────────────────
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center text-white">Carregando...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
