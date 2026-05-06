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

    // Clear checkout session data
    sessionStorage.removeItem('checkout_data');

    const verify = async () => {
      try {
        // Verify payment with backend (confirms intent status)
        const res = await api.post(`/payments/verify/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Verify failed', err);
        // Fallback: just show order
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
      <div className="container mx-auto px-4 py-24 text-center text-white">
        Confirmando pagamento...
      </div>
    );
  }

  const isPaid = order?.status === 'paid' || order?.status === 'shipped' || order?.status === 'delivered';

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center max-w-lg">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isPaid ? 'bg-green-400/10' : 'bg-yellow-400/10'}`}>
        {isPaid
          ? <CheckCircle2 className="w-12 h-12 text-green-400" />
          : <Package className="w-12 h-12 text-yellow-400" />
        }
      </div>

      <h1 className="text-3xl font-bold font-heading text-white mb-3">
        {isPaid ? 'Pagamento Confirmado!' : 'Pedido Recebido'}
      </h1>
      <p className="text-gray-400 mb-8">
        {isPaid
          ? `Seu pedido #${order?.id} foi pago com sucesso. Você receberá atualizações por e-mail.`
          : `Seu pedido #${order?.id} foi criado. Aguardando confirmação do pagamento.`
        }
      </p>

      {order && (
        <div className="w-full glass-panel rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Pedido</span>
            <span className="text-white font-medium">#{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className={`font-medium capitalize ${isPaid ? 'text-green-400' : 'text-yellow-400'}`}>
              {order.status}
            </span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3">
            <span className="text-gray-400">Total pago</span>
            <span className="text-white font-bold text-lg">
              R$ {parseFloat(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link href="/products" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            Continuar Comprando
          </Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button variant="primary" size="lg" className="w-full gap-2">
            Ver Meus Pedidos <ArrowRight className="w-4 h-4" />
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
