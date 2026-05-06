'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { User, Store } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer'); // 'buyer' or 'seller'
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
    <div className="flex-1 flex items-center justify-center p-4 my-8">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-white mb-2">Crie sua conta</h1>
          <p className="text-gray-400">Junte-se à revolução do comércio digital</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                role === 'buyer' 
                  ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="font-medium">Comprar</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                role === 'seller' 
                  ? 'bg-accent/20 border-accent text-white shadow-lg shadow-accent/20' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Store className="w-6 h-6" />
              <span className="font-medium">Vender</span>
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

          <Button type="submit" variant={role === 'seller' ? 'accent' : 'primary'} className="w-full mt-6" isLoading={loading}>
            Cadastrar
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
