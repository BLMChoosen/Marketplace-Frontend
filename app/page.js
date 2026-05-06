'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame, ImageOff, Moon, Shield, ShoppingBag, Store, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import useProductStore from '../lib/productStore';
import { resolveImageUrl } from '../lib/media';

export default function Home() {
  const products = useProductStore((s) => s.featuredProducts);
  const loading = useProductStore((s) => s.loading);
  const error = useProductStore((s) => s.error);
  const fetchFeaturedProducts = useProductStore((s) => s.fetchFeaturedProducts);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const previewProducts = products.slice(0, 3);

  return (
    <div className="bm-page flex flex-col">
      <section className="relative overflow-hidden bg-black border-b border-[rgba(163,0,21,0.18)]">
        <div className="absolute inset-0 bm-grid-bg opacity-70 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-px blood-divider pointer-events-none" />

        <div className="bm-container relative z-10 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <div className="bm-kicker mb-5">
              A lua de sangue se ergueu
            </div>

            <h1 className="text-5xl md:text-7xl font-black font-heading text-white leading-none mb-6">
              Bloodmoon Marketplace
            </h1>

            <p className="text-lg text-[rgb(161,161,170)] max-w-2xl mb-8 leading-relaxed">
              Um marketplace dark, intenso e premium para comprar, vender e construir presença com identidade. Preto absoluto, contraste brutal e vermelho sangue nos pontos de decisão.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/products">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Explorar catálogo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/stores">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Ver lojas
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
              {[
                { icon: Shield, label: 'Compra segura', value: 'Stripe' },
                { icon: Store, label: 'Lojas', value: 'Curadas' },
                { icon: Zap, label: 'Busca', value: 'Precisa' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bm-card p-4 flex items-center gap-3">
                    <div className="bm-icon-frame w-10 h-10 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-[rgb(161,161,170)] font-bold">{item.label}</p>
                      <p className="text-white font-black">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bm-panel p-4 md:p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] uppercase text-[#A30015] font-bold mb-1">Vitrine Bloodmoon</p>
                <h2 className="text-2xl font-black font-heading text-white">Produtos em destaque</h2>
              </div>
              <div className="w-10 h-10 rounded-md bg-black border border-[#A30015] flex items-center justify-center text-[#A30015]">
                <Moon className="w-5 h-5 fill-[#A30015] stroke-[#A30015]" />
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-md bg-black border border-[rgba(255,255,255,0.05)] animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="bm-empty p-8">
                <p className="text-white font-semibold">Catálogo indisponível agora.</p>
                <p className="text-sm text-[rgb(161,161,170)] mt-1">{error}</p>
              </div>
            ) : previewProducts.length === 0 ? (
              <div className="bm-empty p-8">
                <ShoppingBag className="w-10 h-10 text-[#A30015] mx-auto mb-3" />
                <p className="text-white font-semibold">A vitrine ainda está vazia.</p>
                <p className="text-sm text-[rgb(161,161,170)] mt-1">Os primeiros produtos publicados aparecem aqui.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {previewProducts.map((product) => {
                  const title = product.title || product.name;
                  const imageUrl = resolveImageUrl(product.image_url);
                  return (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      className="group flex gap-4 rounded-md bg-black border border-[rgba(255,255,255,0.05)] hover:border-[rgba(163,0,21,0.5)] p-3 transition-colors"
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-[rgb(20,20,19)] border border-[rgba(255,255,255,0.05)] shrink-0">
                        {imageUrl ? (
                          <Image src={imageUrl} alt={title} fill sizes="80px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="w-6 h-6 text-[rgb(80,80,85)]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase text-[#A30015] font-bold mb-1">{product.category || 'Geral'}</p>
                        <h3 className="text-white font-bold line-clamp-1 group-hover:text-[#A30015] transition-colors">{title}</h3>
                        <p className="text-sm text-[rgb(161,161,170)] line-clamp-1">{product.store?.name || 'Loja Parceira'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white font-black">R$ {Number(product.price || 0).toFixed(2)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bm-section-alt py-18">
        <div className="bm-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bm-card p-7 bg-black">
              <div className="bm-kicker mb-5">The Old Way</div>
              <h2 className="text-3xl font-black font-heading text-white mb-5">Marketplace sem alma.</h2>
              <div className="space-y-3 text-[rgb(161,161,170)]">
                <p className="border-l border-[rgba(255,255,255,0.12)] pl-4">Vitrine genérica, visual sem assinatura e navegação sem presença.</p>
                <p className="border-l border-[rgba(255,255,255,0.12)] pl-4">Compra fragmentada, pouco contexto e nenhuma sensação de marca.</p>
                <p className="border-l border-[rgba(255,255,255,0.12)] pl-4">Vendedor vira só mais um item perdido no catálogo.</p>
              </div>
            </div>

            <div className="bm-panel p-7 bg-black">
              <div className="bm-kicker mb-5">The Bloodmoon Way</div>
              <h2 className="text-3xl font-black font-heading text-white mb-5">Identidade primeiro. Conversão depois.</h2>
              <div className="space-y-3 text-[rgb(250,249,245)]">
                <p className="border-l border-[#A30015] pl-4">Interface noir com preto dominante e vermelho sangue onde a ação acontece.</p>
                <p className="border-l border-[#A30015] pl-4">Produtos, lojas, carrinho, checkout e painel seguindo a mesma presença visual.</p>
                <p className="border-l border-[#A30015] pl-4">Experiência premium sem perder clareza para comprar e vender rápido.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bm-section py-20">
        <div className="bm-container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <div className="bm-kicker mb-3">Catálogo</div>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-white">Produtos recentes</h2>
              <p className="text-[rgb(161,161,170)] mt-2">Direto das lojas que carregam o selo Bloodmoon.</p>
            </div>
            <Link href="/products" className="inline-flex text-[#A30015] hover:text-white font-medium items-center gap-1 transition-colors group">
              Ver todos <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 rounded-md bg-[rgb(17,17,20)] border border-[rgba(255,255,255,0.04)] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bm-empty">
              <p className="text-white font-medium">Não foi possível carregar produtos agora.</p>
              <p className="text-[rgb(161,161,170)] text-sm mt-1">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bm-empty">
              <Flame className="w-10 h-10 text-[#A30015] mx-auto mb-3" />
              <p className="text-white font-medium">Nenhum produto cadastrado ainda.</p>
              <p className="text-[rgb(161,161,170)] text-sm mt-1">Quando uma loja publicar itens, eles aparecem aqui.</p>
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

      <section className="bm-section-alt py-18">
        <div className="bm-container">
          <div className="bm-panel p-8 md:p-12 bg-black flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="bm-kicker mb-3">Vendedores</div>
              <h2 className="text-3xl md:text-5xl font-black font-heading text-white mb-4">
                Abra sua loja sob a <span className="text-[#A30015]">lua de sangue</span>.
              </h2>
              <p className="text-[rgb(161,161,170)] max-w-2xl">
                Publique produtos, acompanhe pedidos e transforme sua vitrine em presença de marca.
              </p>
            </div>
            <Link href="/register" className="shrink-0">
              <Button variant="primary" size="lg" className="w-full lg:w-auto">
                Quero vender
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
