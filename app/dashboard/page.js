'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import useDashboardStore from '../../lib/dashboardStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import {
  CheckCircle2,
  DollarSign,
  Package,
  Plus,
  Store,
  Truck,
} from 'lucide-react';

function money(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
}

function statusLabel(status) {
  const labels = {
    pending: 'Pendente',
    paid: 'Pago',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
}

const TEXTAREA_CLASSES =
  'bm-field min-h-24 px-4 py-3';

const SELECT_CLASSES =
  'bm-field px-4 py-3';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    sellerStats,
    sellerOrders,
    sellerStores,
    sellerProducts,
    buyerOrders,
    loading,
    error,
    fetchSellerDashboard,
    fetchBuyerDashboard,
    createStore,
    createProduct,
    shipOrder,
    deliverOrder,
  } = useDashboardStore();

  const [storeForm, setStoreForm] = useState({ name: '', description: '', logo_url: '' });
  const [productForm, setProductForm] = useState({
    store_id: '',
    title: '',
    price: '',
    stock: '',
    category: '',
    image_url: '',
    description: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'seller') fetchSellerDashboard();
    else fetchBuyerDashboard();
  }, [user, fetchSellerDashboard, fetchBuyerDashboard]);

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await createStore(storeForm);
      setStoreForm({ name: '', description: '', logo_url: '' });
    } catch (err) {
      setFormError(err.response?.data?.error || 'Falha ao criar loja.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await createProduct({
        ...productForm,
        store_id: Number(productForm.store_id),
        price: Number(productForm.price),
        stock: Number(productForm.stock || 0),
      });
      setProductForm({
        store_id: productForm.store_id,
        title: '',
        price: '',
        stock: '',
        category: '',
        image_url: '',
        description: '',
      });
    } catch (err) {
      setFormError(err.response?.data?.error || 'Falha ao criar produto.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return <div className="flex-1 flex items-center justify-center text-white">Carregando dashboard...</div>;
  }

  const isSeller = user.role === 'seller';

  return (
    <div className="bm-page bm-container py-16">
      <div className="mb-10">
        <div className="bm-kicker mb-3">
          Painel {isSeller ? 'do vendedor' : 'do comprador'}
        </div>
        <h1 className="text-4xl md:text-5xl font-black font-heading text-white mb-2">
          Olá, {user.name}
        </h1>
        <p className="text-[rgb(161,161,170)]">
          Comando central da sua presença na lua de sangue.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bm-danger text-sm">
          {error}
        </div>
      )}

      {isSeller ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Receita total', value: money(sellerStats.total_revenue), icon: DollarSign },
              { label: 'Pedidos hoje', value: sellerStats.orders_today, icon: Package },
              { label: 'Pendentes', value: sellerStats.pending_orders, icon: Truck },
              { label: 'Produtos ativos', value: sellerStats.products_count, icon: Store },
            ].map((stat) => (
              <div key={stat.label} className="bm-card p-6 flex items-center gap-4">
                <div className="bm-icon-frame p-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-[rgb(161,161,170)] font-bold">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <section className="xl:col-span-2 space-y-8">
              <div className="bm-card p-8">
                <h2 className="text-xl font-black font-heading text-white mb-6 uppercase">Últimos pedidos</h2>
                {loading ? (
                  <p className="text-[rgb(161,161,170)]">Carregando pedidos...</p>
                ) : sellerOrders.length === 0 ? (
                  <p className="text-[rgb(161,161,170)]">Nenhum pedido para suas lojas ainda.</p>
                ) : (
                  <div className="space-y-3">
                    {sellerOrders.map((order) => (
                      <div key={order.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-md bg-black border border-[rgba(255,255,255,0.04)]">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-md bg-[rgb(20,20,19)] flex items-center justify-center border border-[rgba(163,0,21,0.25)]">
                            <Package className="w-6 h-6 text-[#A30015]" />
                          </div>
                          <div>
                            <p className="text-white font-bold">Pedido #{order.id}</p>
                            <p className="text-sm text-[rgb(161,161,170)]">{statusLabel(order.status)} • {order.items?.length || 0} itens</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 md:justify-end">
                          <p className="text-white font-black">{money(order.total_amount)}</p>
                          {order.status === 'paid' && (
                            <Button variant="secondary" size="sm" onClick={() => shipOrder(order.id)}>
                              Enviar
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button variant="secondary" size="sm" onClick={() => deliverOrder(order.id)}>
                              Entregar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bm-card p-8">
                <h2 className="text-xl font-black font-heading text-white mb-6 uppercase">Produtos cadastrados</h2>
                {sellerProducts.length === 0 ? (
                  <p className="text-[rgb(161,161,170)]">Nenhum produto publicado ainda.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sellerProducts.slice(0, 8).map((product) => (
                      <div key={product.id} className="p-4 rounded-md bg-black border border-[rgba(255,255,255,0.04)] hover:border-[rgba(163,0,21,0.4)] transition-colors">
                        <p className="text-white font-medium truncate">{product.title}</p>
                        <p className="text-sm text-[rgb(161,161,170)]">{money(product.price)} • estoque {product.stock}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-8">
              <form onSubmit={handleStoreSubmit} className="bm-panel p-6 space-y-4">
                <h2 className="text-lg font-black font-heading text-white flex items-center gap-2 uppercase">
                  <Store className="w-5 h-5 text-[#A30015]" />
                  Nova loja
                </h2>
                <Input label="Nome" value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} required />
                <Input label="Logo URL" value={storeForm.logo_url} onChange={(e) => setStoreForm({ ...storeForm, logo_url: e.target.value })} />
                <textarea
                  className={TEXTAREA_CLASSES}
                  placeholder="Descrição"
                  value={storeForm.description}
                  onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                />
                <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
                  <Plus className="w-4 h-4" />
                  Criar loja
                </Button>
              </form>

              <form onSubmit={handleProductSubmit} className="bm-panel p-6 space-y-4">
                <h2 className="text-lg font-black font-heading text-white flex items-center gap-2 uppercase">
                  <Package className="w-5 h-5 text-[#A30015]" />
                  Novo produto
                </h2>
                <select
                  className={SELECT_CLASSES}
                  value={productForm.store_id}
                  onChange={(e) => setProductForm({ ...productForm, store_id: e.target.value })}
                  required
                >
                  <option value="">Selecione a loja</option>
                  {sellerStores.map((store) => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
                <Input label="Título" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} required />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Preço" type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                  <Input label="Estoque" type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required />
                </div>
                <Input label="Categoria" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
                <Input label="Imagem URL" value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })} />
                <textarea
                  className={TEXTAREA_CLASSES}
                  placeholder="Descrição"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
                {formError && <p className="text-sm text-[#A30015]">{formError}</p>}
                <Button type="submit" variant="primary" className="w-full" isLoading={submitting} disabled={sellerStores.length === 0}>
                  Publicar produto
                </Button>
              </form>
            </aside>
          </div>
        </>
      ) : (
        <div className="bm-card p-8">
          <h2 className="text-xl font-black font-heading text-white mb-6 uppercase">Seus pedidos</h2>
          {loading ? (
            <p className="text-[rgb(161,161,170)]">Carregando pedidos...</p>
          ) : buyerOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-[rgba(255,255,255,0.1)] rounded-md">
              <Package className="w-12 h-12 text-[#A30015] mb-3" />
              <p className="text-lg text-white font-medium mb-1">Nenhum pedido encontrado</p>
              <p className="text-[rgb(161,161,170)] mb-6">Você ainda não fez nenhuma compra.</p>
              <Button variant="primary" onClick={() => router.push('/products')}>
                Explorar produtos
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {buyerOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-md bg-black border border-[rgba(255,255,255,0.04)] hover:border-[rgba(163,0,21,0.4)] transition-colors">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#A30015]" />
                    <div>
                      <p className="text-white font-bold">Pedido #{order.id}</p>
                      <p className="text-sm text-[rgb(161,161,170)]">{statusLabel(order.status)}</p>
                    </div>
                  </div>
                  <p className="text-white font-black">{money(order.total_amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
