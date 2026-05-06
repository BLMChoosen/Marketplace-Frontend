'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '../../../components/ui/Button';
import api from '../../../lib/api';

function SuccessInner() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('order_id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { router.push('/'); return; }

    sessionStorage.removeItem('checkout_data');

    const verify = async () => {
      try {
        const res = await api.post(`/payments/verify/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Verify failed', err);
        try {
          const res = await api.get(`/orders/${orderId}`);
          setOrder(res.data.order);
        } catch (_) {}
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="bm-container py-24 text-center text-white">
        Confirmando pagamento...
      </div>
    );
  }

  const isPaid = order?.status === 'paid' || order?.status === 'shipped' || order?.status === 'delivered';

  return (
    <div className="bm-page w-full max-w-lg mx-auto px-4 py-20 flex flex-col items-center text-center relative">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border ${
        isPaid
          ? 'bg-[rgba(163,0,21,0.12)] border-[#A30015] shadow-[0_0_30px_-6px_rgba(163,0,21,0.7)]'
          : 'bg-[rgb(17,17,20)] border-[rgba(255,255,255,0.1)]'
      }`}>
        {isPaid
          ? <CheckCircle2 className="w-10 h-10 text-[#A30015]" />
          : <Package className="w-10 h-10 text-[rgb(161,161,170)]" />
        }
      </div>

      <div className="mb-3">
        <span className="bm-kicker">{isPaid ? 'Confirmado' : 'Aguardando'}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-black font-heading text-white mb-3">
        {isPaid ? 'Pagamento confirmado' : 'Pedido recebido'}
      </h1>
      <p className="text-[rgb(161,161,170)] mb-8">
        {isPaid
          ? `Seu pedido #${order?.id} foi pago com sucesso. Atualizações chegarão por e-mail.`
          : `Seu pedido #${order?.id} foi criado. Aguardando confirmação do pagamento.`
        }
      </p>

      {order && (
        <div className="w-full bm-panel p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-[rgb(161,161,170)] uppercase text-[10px] font-bold">Pedido</span>
            <span className="text-white font-medium">#{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[rgb(161,161,170)] uppercase text-[10px] font-bold">Status</span>
            <span className={`font-bold capitalize ${isPaid ? 'text-[#A30015]' : 'text-white'}`}>
              {order.status}
            </span>
          </div>
          <div className="flex justify-between border-t border-[rgba(255,255,255,0.06)] pt-3">
            <span className="text-[rgb(161,161,170)] uppercase text-[10px] font-bold">Total pago</span>
            <span className="text-white font-black text-lg">
              R$ {parseFloat(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link href="/products" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            Continuar comprando
          </Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            Meus pedidos <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center text-white">Confirmando...</div>}>
      <SuccessInner />
    </Suspense>
  );
}
