'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImageOff, ShoppingCart, Star, ShieldCheck, Truck } from 'lucide-react';
import Button from '../../../components/ui/Button';
import useCartStore from '../../../lib/cartStore';
import useProductStore from '../../../lib/productStore';
import { resolveImageUrl } from '../../../lib/media';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const product = useProductStore((s) => s.selectedProduct);
  const loading = useProductStore((s) => s.loading);
  const error = useProductStore((s) => s.error);
  const fetchProduct = useProductStore((s) => s.fetchProduct);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id, fetchProduct]);

  if (loading) {
    return (
      <div className="bm-container py-16 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 h-96 bg-[rgb(17,17,20)] border border-[rgba(255,255,255,0.04)] rounded-md"></div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-[rgb(17,17,20)] rounded-md w-3/4"></div>
            <div className="h-6 bg-[rgb(17,17,20)] rounded-md w-1/4"></div>
            <div className="h-24 bg-[rgb(17,17,20)] rounded-md w-full mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bm-container py-12 text-center text-white">
        {error || 'Produto não encontrado.'}
      </div>
    );
  }

  const title = product.title || product.name;
  const imageUrl = resolveImageUrl(product.image_url);

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const handleBuyNow = () => {
    addItem(product, 1);
    router.push('/cart');
  };

  return (
    <div className="bm-page bm-container py-16">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bm-panel overflow-hidden aspect-[4/3] flex items-center justify-center relative group">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[rgb(20,20,19)]">
                <ImageOff className="w-16 h-16 text-[rgb(80,80,85)]" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-3">
            <span className="bm-kicker">
              {product.category || 'Geral'}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black font-heading text-white mb-4 leading-tight tracking-tight">
            {title}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            {product.store?.rating && (
              <>
                <div className="flex items-center gap-1 text-[#A30015]">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-white ml-1">
                    {product.store.rating}
                  </span>
                </div>
                <div className="w-1 h-1 bg-[rgba(163,0,21,0.5)] rounded-full"></div>
              </>
            )}
            <span className="text-[rgb(161,161,170)] text-sm">
              Vendido por{' '}
              <span className="text-white font-bold border-b border-[rgba(163,0,21,0.5)] pb-0.5">
                {product.store?.name || `Loja #${product.store_id}`}
              </span>
            </span>
          </div>

          <div className="mb-10 bm-panel p-6">
            <span className="text-[10px] text-[rgb(161,161,170)] mb-2 block uppercase font-bold">Preço</span>
            <div className="text-5xl font-black text-white flex items-start gap-1">
              <span className="text-2xl mt-2 text-[#A30015]">R$</span>
              {parseFloat(product.price).toFixed(2).split('.')[0]}
              <span className="text-2xl mt-2 text-[rgb(161,161,170)]">
                ,{parseFloat(product.price).toFixed(2).split('.')[1]}
              </span>
            </div>
            <p className="text-sm text-[rgb(161,161,170)] mt-3">
              Em até 12x sem juros no cartão de crédito
            </p>
            {typeof product.stock === 'number' && (
              <p className="text-xs text-[rgb(161,161,170)] mt-1 uppercase font-bold">
                {product.stock > 0
                  ? `${product.stock} em estoque`
                  : 'Sem estoque'}
              </p>
            )}
          </div>

          <p className="text-[rgb(161,161,170)] text-base leading-relaxed mb-10">
            {product.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button
              variant="primary"
              size="lg"
              className="flex-1 text-lg"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Comprar agora
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 text-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar ao carrinho
            </Button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 border-t border-[rgba(163,0,21,0.18)] pt-8">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[rgba(163,0,21,0.12)] border border-[rgba(163,0,21,0.4)] rounded-md text-[#A30015]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 text-sm uppercase">Compra segura</h4>
                <p className="text-xs text-[rgb(161,161,170)] leading-tight">
                  Garantia Bloodmoon de devolução de 7 dias.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[rgba(163,0,21,0.12)] border border-[rgba(163,0,21,0.4)] rounded-md text-[#A30015]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 text-sm uppercase">Frete expresso</h4>
                <p className="text-xs text-[rgb(161,161,170)] leading-tight">
                  Frete calculado no checkout com base no endereço.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
