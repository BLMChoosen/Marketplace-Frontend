import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import CartAddedPopup from '../components/ui/CartAddedPopup';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const socialImage = siteUrl ? { images: ['/logo.png'] } : {};

export const metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: 'Bloodmoon Marketplace',
  description: 'Bloodmoon Marketplace — comércio digital com identidade. Sombrio, intenso, sem concessões.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Bloodmoon Marketplace',
    description: 'Comércio digital com identidade dark, intensa e premium.',
    ...socialImage,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <CartAddedPopup />
        </AuthProvider>
      </body>
    </html>
  );
}
