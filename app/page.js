'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import useProductStore from '../lib/productStore';

export default function Home() {
  const products = useProductStore((s) => s.featuredProducts);
  const loading = useProductStore((s) => s.loading);
  const error = useProductStore((s) => s.error);
  const fetchFeaturedProducts = useProductStore((s) => s.fetchFeaturedProducts);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent mb-8 backdrop-blur-sm animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">A revolução do comércio digital</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Compre o extraordinário, <br className="hidden md:block" />
            <span className="text-gradient">venda o inesquecível.</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Nossa plataforma conecta você aos melhores lojistas do mercado com uma 
            experiência de compra fluida, segura e espetacular.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/products">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                Explorar Produtos
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Seja um Vendedor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-black/20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold font-heading text-white mb-2">Produtos Recentes</h2>
              <p className="text-gray-400">Catálogo atualizado direto das lojas</p>
            </div>
            <Link href="/products" className="text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="glass-panel rounded-2xl p-10 text-center">
              <p className="text-white font-medium">Não foi possível carregar produtos agora.</p>
              <p className="text-gray-400 text-sm mt-1">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 text-center">
              <p className="text-white font-medium">Nenhum produto cadastrado ainda.</p>
              <p className="text-gray-400 text-sm mt-1">Assim que uma loja publicar itens, eles aparecem aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
