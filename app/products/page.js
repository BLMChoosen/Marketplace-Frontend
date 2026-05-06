'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import useProductStore from '../../lib/productStore';
import ProductCard from '../../components/ui/ProductCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function ProductsListContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get('store_id') || '';

  const products = useProductStore((s) => s.products);
  const loading = useProductStore((s) => s.loading);
  const error = useProductStore((s) => s.error);
  const pagination = useProductStore((s) => s.pagination);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  const load = (nextPage = page) => {
    fetchProducts({
      page: nextPage,
      per_page: 12,
      search: query,
      category,
      min_price: minPrice,
      max_price: maxPrice,
      store_id: storeId,
    });
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, storeId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load(1);
  };

  return (
    <div className="bm-page bm-container py-16">
      <div className="mb-10">
        <div className="bm-kicker mb-3">Catálogo</div>
        <h1 className="text-4xl md:text-5xl font-black font-heading text-white mb-2">
          Produtos
        </h1>
        <p className="text-[rgb(161,161,170)]">
          {pagination.total
            ? `${pagination.total} ${pagination.total === 1 ? 'produto encontrado' : 'produtos encontrados'}`
            : 'Encontre o que você precisa sob a lua de sangue'}
        </p>
      </div>

      <form onSubmit={handleSearch} className="bm-panel p-6 mb-10 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Busca"
            type="text"
            placeholder="Nome, descrição, tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Input
          label="Categoria"
          type="text"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Input
          label="Preço mín."
          type="number"
          placeholder="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          label="Preço máx."
          type="number"
          placeholder="∞"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <div className="md:col-span-5 flex items-center justify-end gap-4 pt-2">
          <Button type="submit" variant="primary" size="md">
            <Search className="w-4 h-4" />
            Buscar
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 rounded-md bg-[rgb(17,17,20)] border border-[rgba(255,255,255,0.04)] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bm-empty border-[rgba(163,0,21,0.4)] p-16">
          <p className="text-lg text-white font-medium mb-1">Falha ao carregar produtos</p>
          <p className="text-[rgb(161,161,170)]">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bm-empty p-16">
          <p className="text-lg text-white font-medium mb-1">Nenhum produto encontrado</p>
          <p className="text-[rgb(161,161,170)]">Tente outros termos de busca.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <span className="text-[rgb(161,161,170)] text-sm px-4 uppercase">
                Página <span className="text-white font-bold">{page}</span> / {pagination.pages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsListPage() {
  return (
    <Suspense fallback={<div className="bm-container py-12 text-white">Carregando produtos...</div>}>
      <ProductsListContent />
    </Suspense>
  );
}
