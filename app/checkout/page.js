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

function PaymentForm({ order }) {
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

    if (error) {
      setErrorMsg(error.message || 'Pagamento falhou. Tente novamente.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-md border border-[rgba(255,255,255,0.06)] bg-black">
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: { billingDetails: { address: { country: 'never' } } },
          }}
        />
      </div>

      {errorMsg && (
        <div className="p-3 bm-danger text-sm">
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={submitting}
        disabled={!stripe || !elements}
      >
        <Lock className="w-4 h-4" />
        Pagar R$ {parseFloat(order.total_amount).toFixed(2)}
      </Button>

      <p className="text-[10px] text-[rgb(120,120,125)] text-center flex items-center justify-center gap-1 uppercase">
        <ShieldCheck className="w-3.5 h-3.5" />
        Criptografado via Stripe
      </p>
    </form>
  );
}

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
      <div className="bm-container py-24 text-center text-white">
        Carregando checkout...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bm-container py-24 text-center">
        <p className="text-[#A30015] mb-4">{errorMsg}</p>
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
        colorPrimary: '#A30015',
        colorBackground: 'rgb(17, 17, 20)',
        colorText: '#ffffff',
        colorDanger: '#A30015',
        borderRadius: '6px',
      },
    },
  };

  return (
    <div className="bm-page bm-container py-16">
      <div className="mb-10">
        <div className="bm-kicker mb-3">Pagamento</div>
        <h1 className="text-4xl md:text-5xl font-black font-heading text-white">Selar a compra</h1>
      </div>

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div>
          <h2 className="text-xs uppercase font-bold text-[rgb(161,161,170)] mb-4">Resumo do pedido</h2>
          <div className="bm-card p-6 space-y-4">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-[rgb(161,161,170)]">
                  {item.product_title || `Produto #${item.product_id}`} × {item.quantity}
                </span>
                <span className="text-white font-medium">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 flex justify-between text-white font-black text-lg">
              <span className="uppercase">Total</span>
              <span className="text-[#A30015]">R$ {parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
            {order.shipping_address && (
              <div className="text-xs text-[rgb(161,161,170)] pt-2 border-t border-[rgba(255,255,255,0.06)]">
                <span className="font-bold text-white uppercase text-[10px]">Entrega: </span>
                {order.shipping_address}
              </div>
            )}
          </div>

          <div className="mt-6 bm-panel p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#A30015] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white font-bold">Compra 100% segura</p>
              <p className="text-xs text-[rgb(161,161,170)] mt-0.5">
                Dados criptografados pela Stripe. Seu cartão nunca toca nossos servidores.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div>
          <h2 className="text-xs uppercase font-bold text-[rgb(161,161,170)] mb-4">Pagamento</h2>
          <div className="bm-panel p-6">
            <Elements stripe={stripePromise} options={elementsOptions}>
              <PaymentForm order={order} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="bm-container py-24 text-center text-white">Carregando...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
