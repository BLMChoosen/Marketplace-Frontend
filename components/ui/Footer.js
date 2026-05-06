import Link from 'next/link';
import { Moon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[rgba(163,0,21,0.18)] bg-black">
      <div className="bm-container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-black border border-[#A30015] flex items-center justify-center text-[#A30015] shadow-[0_0_18px_-6px_rgba(163,0,21,0.6)]">
              <Moon className="w-4 h-4 fill-[#A30015] stroke-[#A30015]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-black text-lg text-white">
                Bloodmoon
              </span>
              <span className="text-[10px] uppercase text-[#A30015] mt-1">
                Marketplace
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[rgb(161,161,170)]">
            <Link href="/products" className="hover:text-white transition-colors">Produtos</Link>
            <Link href="/stores" className="hover:text-white transition-colors">Lojas</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Painel</Link>
            <Link href="/cart" className="hover:text-white transition-colors">Carrinho</Link>
          </nav>

          <Link
            href="https://agency.bloodmoonbr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[rgb(120,120,125)] hover:text-white transition-colors"
          >
            © 2026 Bloodmoon Agency
          </Link>
        </div>
      </div>
    </footer>
  );
}
