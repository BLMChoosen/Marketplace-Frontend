'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ShoppingCart, User, LogOut, Package, MessageCircle, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../lib/cartStore';
import Button from './Button';

const navLinks = [
  { href: '/products', label: 'Produtos' },
  { href: '/stores', label: 'Lojas' },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const isActive = (href) =>
    pathname === href || (href !== '/' && pathname?.startsWith(`${href}/`));

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  const linkClass = (href) =>
    `text-sm font-semibold transition-colors ${
      isActive(href)
        ? 'text-white'
        : 'text-[rgb(161,161,170)] hover:text-white'
    }`;

  const cartLabel = `Carrinho com ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`;
  const cartBadge = (
    <span className={`absolute -top-2 -right-2 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(163,0,21,0.8)] ${
      cartCount > 0 ? 'bg-[#A30015]' : 'bg-[rgb(63,63,70)]'
    }`}>
      {cartCount > 99 ? '99+' : cartCount}
    </span>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-[rgba(163,0,21,0.22)]">
      <div className="bm-container h-18 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={() => setOpen(false)}>
          <div className="relative w-10 h-10 rounded-md bg-black border border-[#A30015] flex items-center justify-center text-[#A30015] shadow-[0_0_22px_-6px_rgba(163,0,21,0.7)] group-hover:shadow-[0_0_28px_-4px_rgba(163,0,21,0.9)] transition-all">
            <Moon className="w-5 h-5 fill-[#A30015] stroke-[#A30015]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-black text-xl text-white">
              Bloodmoon
            </span>
            <span className="font-sans text-[10px] uppercase text-[#A30015] mt-1">
              Marketplace
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}

          <div className="h-6 w-px bg-[rgba(163,0,21,0.4)] mx-1" />

          <Link
            href="/cart"
            className="text-[rgb(161,161,170)] hover:text-[#A30015] transition-colors relative"
            aria-label={cartLabel}
            title={cartLabel}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartBadge}
          </Link>

          {!loading && (
            user ? (
              <div className="flex items-center gap-4">
                <Link href="/chat" className="text-[rgb(161,161,170)] hover:text-[#A30015] transition-colors" aria-label="Mensagens">
                  <MessageCircle className="w-5 h-5" />
                </Link>

                <div className="relative group ml-2">
                  <button className="flex items-center gap-3 rounded-md p-1.5 hover:bg-[rgba(163,0,21,0.08)] transition-colors" type="button">
                    <span className="w-9 h-9 rounded-md bg-[rgb(17,17,20)] flex items-center justify-center border border-[rgba(163,0,21,0.3)] overflow-hidden">
                      <User className="w-5 h-5 text-[rgb(161,161,170)]" />
                    </span>
                    <span className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-white leading-tight max-w-32 truncate">{user.name}</span>
                      <span className="text-[10px] text-[#A30015] uppercase font-bold">{user.role}</span>
                    </span>
                  </button>

                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right translate-y-2 group-hover:translate-y-0">
                    <div className="bg-[rgb(17,17,20)] border border-[rgba(163,0,21,0.25)] rounded-md p-2 w-52 flex flex-col gap-1 shadow-[0_20px_50px_-20px_rgba(163,0,21,0.4)]">
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[rgba(163,0,21,0.12)] text-[rgb(161,161,170)] hover:text-white transition-colors text-sm">
                        <Package className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[rgba(163,0,21,0.18)] text-[#A30015] hover:text-white transition-colors text-sm w-full text-left" type="button">
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
            )
          )}
        </nav>

        <button
          type="button"
          className="md:hidden w-10 h-10 rounded-md border border-[rgba(163,0,21,0.35)] bg-[rgb(17,17,20)] text-white flex items-center justify-center"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[rgba(163,0,21,0.18)] bg-black">
          <nav className="bm-container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="px-3 py-3 rounded-md text-white bg-[rgb(17,17,20)] border border-[rgba(255,255,255,0.05)]" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}

            <Link href="/cart" className="px-3 py-3 rounded-md text-white bg-[rgb(17,17,20)] border border-[rgba(255,255,255,0.05)] flex items-center justify-between" onClick={() => setOpen(false)}>
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#A30015]" />
                Carrinho
              </span>
              <span className={`${cartCount > 0 ? 'bg-[#A30015]' : 'bg-[rgb(63,63,70)]'} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </Link>

            {!loading && (
              user ? (
                <>
                  <Link href="/dashboard" className="px-3 py-3 rounded-md text-white bg-[rgb(17,17,20)] border border-[rgba(255,255,255,0.05)]" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/chat" className="px-3 py-3 rounded-md text-white bg-[rgb(17,17,20)] border border-[rgba(255,255,255,0.05)]" onClick={() => setOpen(false)}>
                    Mensagens
                  </Link>
                  <button onClick={handleLogout} className="px-3 py-3 rounded-md text-left text-[#A30015] bg-[rgba(163,0,21,0.08)] border border-[rgba(163,0,21,0.25)]" type="button">
                    Sair
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full">Entrar</Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button variant="primary" className="w-full">Cadastrar</Button>
                  </Link>
                </div>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
