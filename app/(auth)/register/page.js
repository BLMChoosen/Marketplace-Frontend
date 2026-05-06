'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { User, Store, Moon } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register(name, email, password, role);
    if (!res.success) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="bm-page flex-1 flex items-center justify-center p-4 my-8 relative overflow-hidden">
      <div className="absolute inset-0 bm-grid-bg opacity-50 pointer-events-none" />

      <div className="w-full max-w-md bm-panel p-8 animate-fade-in-up relative z-10 bg-[rgb(17,17,20)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-black border border-[#A30015] text-[#A30015] mb-5 shadow-[0_0_22px_-6px_rgba(163,0,21,0.7)]">
            <Moon className="w-5 h-5 fill-[#A30015] stroke-[#A30015]" />
          </div>
          <h1 className="text-3xl font-black font-heading text-white mb-2">Junte-se à Bloodmoon</h1>
          <p className="text-[rgb(161,161,170)] text-sm">Escolha seu lado da lua</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bm-danger text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex flex-col items-center gap-2 p-4 rounded-md border transition-all ${
                role === 'buyer'
                  ? 'bg-[rgba(163,0,21,0.15)] border-[#A30015] text-white shadow-[0_0_24px_-8px_rgba(163,0,21,0.7)]'
                  : 'bg-black border-[rgba(255,255,255,0.06)] text-[rgb(161,161,170)] hover:border-[rgba(163,0,21,0.4)]'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="font-bold tracking-wide">Comprar</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`flex flex-col items-center gap-2 p-4 rounded-md border transition-all ${
                role === 'seller'
                  ? 'bg-[rgba(163,0,21,0.15)] border-[#A30015] text-white shadow-[0_0_24px_-8px_rgba(163,0,21,0.7)]'
                  : 'bg-black border-[rgba(255,255,255,0.06)] text-[rgb(161,161,170)] hover:border-[rgba(163,0,21,0.4)]'
              }`}
            >
              <Store className="w-6 h-6" />
              <span className="font-bold tracking-wide">Vender</span>
            </button>
          </div>

          <Input
            label="Nome Completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="João da Silva"
            required
          />

          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
            minLength={8}
          />

          <Button type="submit" variant="primary" className="w-full mt-6" isLoading={loading}>
            Criar conta
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[rgb(161,161,170)]">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-[#A30015] hover:text-white font-bold transition-colors">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
