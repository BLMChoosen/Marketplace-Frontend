'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Store as StoreIcon, ArrowRight } from 'lucide-react';
import useProductStore from '../../lib/productStore';

export default function StoresListPage() {
  const stores = useProductStore((s) => s.stores);
  const loading = useProductStore((s) => s.loading);
  const error = useProductStore((s) => s.error);
  const fetchStores = useProductStore((s) => s.fetchStores);

  useEffect(() => {
    fetchStores({ page: 1, per_page: 24 });
  }, [fetchStores]);

  return (
    <div className="bm-page bm-container py-16">
      <div className="mb-10">
        <div className="bm-kicker mb-3">Diretório</div>
        <h1 className="text-4xl md:text-5xl font-black font-heading text-white mb-2">
          Lojas
        </h1>
        <p className="text-[rgb(161,161,170)]">As casas que carregam o selo Bloodmoon.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-md bg-[rgb(17,17,20)] border border-[rgba(255,255,255,0.04)] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bm-empty border-[rgba(163,0,21,0.4)] p-16">
          <StoreIcon className="w-12 h-12 text-[#A30015] mx-auto mb-3" />
          <p className="text-lg text-white font-medium mb-1">Falha ao carregar lojas</p>
          <p className="text-[rgb(161,161,170)]">{error}</p>
        </div>
      ) : stores.length === 0 ? (
        <div className="bm-empty p-16">
          <StoreIcon className="w-12 h-12 text-[#A30015] mx-auto mb-3" />
          <p className="text-lg text-white font-medium mb-1">Nenhuma loja cadastrada</p>
          <p className="text-[rgb(161,161,170)]">Volte mais tarde.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/products?store_id=${store.id}`}
              className="group bm-card p-6 interactive-hover flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-md bg-black border border-[#A30015] flex items-center justify-center text-[#A30015] font-black text-2xl shadow-[0_0_22px_-6px_rgba(163,0,21,0.7)]">
                  {store.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#A30015] transition-colors">
                    {store.name}
                  </h3>
                  <p className="text-[10px] text-[rgb(161,161,170)] mt-1 uppercase font-bold">Loja oficial</p>
                </div>
              </div>
              <p className="text-[rgb(161,161,170)] text-sm mb-6 line-clamp-3 flex-grow">
                {store.description || 'Sem descrição.'}
              </p>
              <div className="flex items-center justify-between text-sm text-[#A30015] font-bold uppercase">
                Ver produtos <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
