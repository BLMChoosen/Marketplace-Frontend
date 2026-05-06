'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Store as StoreIcon, ArrowRight } from 'lucide-react';
import api from '../../lib/api';

export default function StoresListPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/stores');
        setStores(res.data.stores || []);
      } catch (err) {
        console.error('Failed to load stores', err);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">
          Lojas
        </h1>
        <p className="text-gray-400">Conheça as lojas parceiras do marketplace.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center">
          <StoreIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-lg text-white font-medium mb-1">Nenhuma loja cadastrada</p>
          <p className="text-gray-400">Volte mais tarde.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/products?store_id=${store.id}`}
              className="group glass-panel rounded-2xl p-6 interactive-hover flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30">
                  {store.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-primary transition-colors">
                    {store.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Loja oficial</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                {store.description || 'Sem descrição.'}
              </p>
              <div className="flex items-center justify-between text-sm text-primary font-medium group-hover:text-primary-hover">
                Ver produtos <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
