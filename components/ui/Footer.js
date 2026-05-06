import Link from 'next/link';
import BrandMark from './BrandMark';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[rgba(163,0,21,0.18)] bg-black">
      <div className="bm-container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-3">
            <BrandMark size="sm" alt="" className="shadow-[0_0_18px_-6px_rgba(163,0,21,0.6)]" />
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

          <div className="text-xs text-[rgb(120,120,125)]">
            © {new Date().getFullYear()} Bloodmoon Marketplace
          </div>
        </div>
      </div>
    </footer>
  );
}
