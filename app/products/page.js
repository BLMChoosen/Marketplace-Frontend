'use client';

import { useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import api from '../../lib/api';
import ProductCard from '../../components/ui/ProductCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [useElastic, setUseElastic] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (useElastic && query) {
        const params = { q: query, page, per_page: 12 };
        if (category) params.category = category;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        const res = await api.get('/search', { params });
        setProducts(
          (res.data.results || []).map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            price: r.price,
            category: r.category,
            image_url: r.image_url,
            store_id: r.store_id,
          }))
        );
        setPagination({
          pages: Math.max(1, Math.ceil(res.data.total / 12)),
          total: res.data.total,
        });
      } else {
        const params = { page, per_page: 12 };
        if (query) params.search = query;
        if (category) params.category = category;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        const res = await api.get('/products', { params });
        setProducts(res.data.products || []);
        setPagination(res.data.pagination || { pages: 1, total: 0 });
      }
    } catch (err) {
      console.error('Failed to load products', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">
          Produtos
        </h1>
        <p className="text-gray-400">
          {pagination.total ? `${pagination.total} produtos encontrados` : 'Encontre o que você precisa'}
        </p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="glass-panel rounded-2xl p-6 mb-10 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <Input
            type="text"
            placeholder="Buscar produtos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Input
          type="text"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Preço mínimo"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Preço máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <div className="md:col-span-5 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useElastic}
              onChange={(e) => setUseElastic(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <SlidersHorizontal className="w-4 h-4" />
            Busca avançada (Elasticsearch)
          </label>
          <Button type="submit" variant="primary" size="md">
            Buscar
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center">
          <p className="text-lg text-white font-medium mb-1">Nenhum produto encontrado</p>
          <p className="text-gray-400">Tente outros termos de busca.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <span className="text-gray-300 text-sm px-4">
                Página {page} de {pagination.pages}
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
