'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

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
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-400">Faça login para acessar sua conta</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
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
              <Link href="/forgot-password" className="text-xs text-primary hover:text-primary-hover transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-6" isLoading={loading}>
            Entrar
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
