'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ImageOff, ShoppingCart } from 'lucide-react';
import Button from './Button';
import useCartStore from '../../lib/cartStore';
import { resolveImageUrl } from '../../lib/media';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const title = product.title || product.name;
  const imageUrl = resolveImageUrl(product.image_url);
  const price = Number(product.price || 0);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <article className="group bm-card overflow-hidden flex flex-col interactive-hover relative min-h-full">
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-0" aria-label={`Ver produto ${title}`} />

      <div className="relative z-10 h-52 overflow-hidden bg-[rgb(20,20,19)] pointer-events-none">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[rgb(20,20,19)]">
            <ImageOff className="w-10 h-10 text-[rgb(80,80,85)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-[rgba(163,0,21,0.4)] text-[#A30015] text-[10px] uppercase px-2 py-1 rounded font-bold">
          {product.category || 'Geral'}
        </div>
      </div>

      <div className="relative z-10 p-5 flex flex-col flex-grow border-t border-[rgba(163,0,21,0.12)] pointer-events-none">
        <div className="mb-2 text-[10px] text-[rgb(161,161,170)] font-semibold uppercase">
          {product.store?.name || 'Loja Parceira'}
        </div>
        <h3 className="font-heading font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-[#A30015] transition-colors">
          {title}
        </h3>
        <p className="text-[rgb(161,161,170)] text-sm line-clamp-2 mb-5 flex-grow">
          {product.description}
        </p>

        <div className="flex items-end justify-between mt-auto pt-3 border-t border-[rgba(255,255,255,0.04)]">
          <div className="flex flex-col">
            <span className="text-[10px] text-[rgb(161,161,170)] mb-0.5 uppercase">Preço</span>
            <span className="font-heading font-black text-2xl text-white">
              R$ {price.toFixed(2)}
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="!p-2.5 rounded-md group/btn relative z-20 pointer-events-auto"
            onClick={handleAdd}
            aria-label="Adicionar ao Carrinho"
          >
            <ShoppingCart className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </div>
    </article>
  );
}
