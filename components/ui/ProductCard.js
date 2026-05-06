'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import Button from './Button';
import useCartStore from '../../lib/cartStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const title = product.title || product.name;
  const imageUrl =
    product.image_url || `https://picsum.photos/seed/${product.id}/400/300`;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <div className="group glass-panel rounded-2xl overflow-hidden flex flex-col interactive-hover relative">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-secondary">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs px-2 py-1 rounded-md font-medium">
          {product.category || 'Geral'}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1 text-xs text-gray-400 font-medium tracking-wider uppercase">
          {product.store?.name || 'Loja Parceira'}
        </div>
        <h3 className="font-heading font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-0.5">Preço</span>
            <span className="font-heading font-bold text-2xl text-white">
              R$ {parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="!p-2 rounded-xl group/btn relative z-10"
            onClick={handleAdd}
            aria-label="Adicionar ao Carrinho"
          >
            <ShoppingCart className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Clickable Overlay */}
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-0">
        <span className="sr-only">Ver produto {title}</span>
      </Link>
    </div>
  );
}
