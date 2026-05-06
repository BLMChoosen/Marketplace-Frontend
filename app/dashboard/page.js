'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Package, TrendingUp, Users, DollarSign, Store } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex-1 flex items-center justify-center text-white">Carregando dashboard...</div>;
  }

  const isSeller = user.role === 'seller';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">
          Olá, {user.name}
        </h1>
        <p className="text-gray-400">
          Bem-vindo ao seu painel de controle ({isSeller ? 'Vendedor' : 'Comprador'}).
        </p>
      </div>

      {isSeller ? (
        <>
          {/* Seller Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Vendas Totais', value: 'R$ 12.450', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
              { label: 'Pedidos Hoje', value: '24', icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { label: 'Visitas na Loja', value: '1.204', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { label: 'Conversão', value: '4.8%', icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Últimos Pedidos</h2>
                <button className="text-sm text-primary hover:text-primary-hover">Ver todos</button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Pedido #102{i}</p>
                        <p className="text-sm text-gray-400">Há {i * 2} horas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">R$ 450,00</p>
                      <span className="inline-block px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs rounded-md mt-1 font-medium">
                        Processando
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center">
              <Store className="w-16 h-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Gerencie sua Loja</h2>
              <p className="text-gray-400 text-sm mb-6">Cadastre novos produtos, configure frete e gerencie seus dados.</p>
              <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/10">
                Acessar Configurações
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Buyer Dashboard */}
          <div className="glass-panel p-8 rounded-2xl mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Seus Pedidos Recentes</h2>
            
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-white/10 rounded-xl">
              <Package className="w-12 h-12 text-gray-500 mb-3" />
              <p className="text-lg text-white font-medium mb-1">Nenhum pedido encontrado</p>
              <p className="text-gray-400 mb-6">Parece que você ainda não fez nenhuma compra.</p>
              <button onClick={() => router.push('/products')} className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors">
                Explorar Produtos
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
