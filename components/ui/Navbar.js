'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../lib/cartStore';
import { ShoppingCart, User, LogOut, Package, MessageCircle } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-50 w-full glass border-b-0 border-white/5">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all">
            M
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
            Marketplace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-gray-300 hover:text-white transition-colors font-medium">
            Produtos
          </Link>
          <Link href="/stores" className="text-gray-300 hover:text-white transition-colors font-medium">
            Lojas
          </Link>

          <div className="h-6 w-px bg-white/10 mx-2"></div>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/chat" className="text-gray-300 hover:text-white transition-colors" aria-label="Mensagens">
                    <MessageCircle className="w-6 h-6" />
                  </Link>
                  {user.role === 'buyer' && (
                    <Link href="/cart" className="text-gray-300 hover:text-white transition-colors relative">
                      <ShoppingCart className="w-6 h-6" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>
                  )}

                  <div className="relative group ml-4 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-white/10 overflow-hidden">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white leading-tight">{user.name}</span>
                        <span className="text-[10px] text-primary uppercase tracking-wider">{user.role}</span>
                      </div>
                    </div>

                    {/* Dropdown menu */}
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2">
                      <div className="glass-panel rounded-xl p-2 w-48 flex flex-col gap-1">
                        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-sm">
                          <Package className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-sm w-full text-left">
                          <LogOut className="w-4 h-4" />
                          Sair
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Entrar</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">Cadastrar</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
