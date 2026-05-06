'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import BrandMark from '../../../components/ui/BrandMark';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    if (!res.success) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="bm-page flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bm-grid-bg opacity-50 pointer-events-none" />

      <div className="w-full max-w-md bm-panel p-8 animate-fade-in-up relative z-10 bg-[rgb(17,17,20)]">
        <div className="text-center mb-8">
          <BrandMark size="lg" className="mb-5" />
          <h1 className="text-3xl font-black font-heading text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-[rgb(161,161,170)] text-sm">Entre na sua conta Bloodmoon</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bm-danger text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />

          <div className="space-y-1">
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-[#A30015] hover:text-white transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-6" isLoading={loading}>
            Entrar
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[rgb(161,161,170)]">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-[#A30015] hover:text-white font-bold transition-colors">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
