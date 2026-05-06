import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

export const metadata = {
  title: 'Marketplace Platform',
  description: 'A modern, dynamic marketplace built with Next.js and Tailwind CSS',
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
