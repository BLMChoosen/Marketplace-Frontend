import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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
    images: ['/logo.png'],
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
        </AuthProvider>
      </body>
    </html>
  );
}
