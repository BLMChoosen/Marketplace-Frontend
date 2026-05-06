'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Star, ShieldCheck, Truck } from 'lucide-react';
import api from '../../../lib/api';
import Button from '../../../components/ui/Button';
import useCartStore from '../../../lib/cartStore';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error('Failed to fetch product', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 h-96 bg-white/5 rounded-2xl"></div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-white/5 rounded-lg w-3/4"></div>
            <div className="h-6 bg-white/5 rounded-lg w-1/4"></div>
            <div className="h-24 bg-white/5 rounded-lg w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-white">
        Produto não encontrado.
      </div>
    );
  }

  const title = product.title || product.name;
  const imageUrl =
    product.image_url || `https://picsum.photos/seed/${product.id}/800/600`;

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const handleBuyNow = () => {
    addItem(product, 1);
    router.push('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center relative group">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-primary font-medium tracking-wide uppercase">
              {product.category || 'Geral'}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4 leading-tight">
            {title}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold text-white ml-1">
                {product.store?.rating || '4.5'}
              </span>
            </div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <span className="text-gray-400 font-medium">
              Vendido por{' '}
              <span className="text-white border-b border-white/20 pb-0.5">
                {product.store?.name || `Loja #${product.store_id}`}
              </span>
            </span>
          </div>

          <div className="mb-8">
            <span className="text-gray-400 text-sm mb-1 block">Preço</span>
            <div className="text-4xl font-bold text-white flex items-start gap-1">
              <span className="text-2xl mt-1 text-gray-400">R$</span>
              {parseFloat(product.price).toFixed(2).split('.')[0]}
              <span className="text-xl mt-1 text-gray-400">
                ,{parseFloat(product.price).toFixed(2).split('.')[1]}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Em até 12x sem juros no cartão de crédito
            </p>
            {typeof product.stock === 'number' && (
              <p className="text-sm text-gray-400 mt-1">
                {product.stock > 0
                  ? `${product.stock} em estoque`
                  : 'Sem estoque'}
              </p>
            )}
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            {product.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button
              variant="primary"
              size="lg"
              className="flex-1 gap-2 text-lg"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Comprar Agora
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 gap-2 text-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar ao Carrinho
            </Button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Compra Segura</h4>
                <p className="text-sm text-gray-400 leading-tight">
                  Garantia Marketplace de devolução de 7 dias.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-accent">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Frete Expresso</h4>
                <p className="text-sm text-gray-400 leading-tight">
                  Entrega rápida para todo o Brasil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
