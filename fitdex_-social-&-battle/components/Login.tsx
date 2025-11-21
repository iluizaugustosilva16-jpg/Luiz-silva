
import React, { useState } from 'react';
import { Dumbbell, Mail, Lock, ArrowRight, Loader2, User as UserIcon, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isRegistering) {
      if (!name || !email || !password) {
        setError('Preencha todos os campos.');
        setLoading(false);
        return;
      }
      const result = authService.register(name, email, password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'Erro ao criar conta.');
      }
    } else {
      if (!email || !password) {
        setError('Preencha e-mail e senha.');
        setLoading(false);
        return;
      }
      const result = authService.login(email, password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'Erro ao entrar.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background CSS Gradient (Matches the abstract blue/purple look) */}
      <div className="absolute inset-0 z-0 bg-[#1e1b4b] overflow-hidden">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-[#2e1065] to-black"></div>
          
          {/* Abstract Geometric Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-60">
              {/* Large blurred glow spots */}
              <div className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen"></div>
              <div className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] bg-purple-600/30 blur-[100px] rounded-full mix-blend-screen"></div>
              
              {/* Diagonal Beams simulating the stripes */}
              <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 transform translate-y-[20%] blur-xl"></div>
              <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 transform translate-y-[35%] blur-xl"></div>
              <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 transform translate-y-[50%] blur-xl"></div>
          </div>
      </div>
      
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-900/50 transform rotate-3 border border-white/10">
            <Dumbbell size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-2 drop-shadow-lg">FITDEX</h1>
          <p className="text-gray-200 text-sm font-medium max-w-xs mx-auto leading-relaxed drop-shadow-md opacity-90">
            Entretenimento, conexão e evolução<br />
            Bem-vindo ao seu novo app fitness.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm flex items-center backdrop-blur-md">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          {isRegistering && (
            <div className="space-y-1 animate-slide-up">
              <label className="text-xs font-bold text-gray-300 uppercase ml-1 drop-shadow-md">Nome</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <UserIcon size={20} />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all backdrop-blur-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase ml-1 drop-shadow-md">E-mail</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@fitdex.com"
                className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase ml-1 drop-shadow-md">Senha</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/30 active:scale-95 transition-all flex items-center justify-center mt-6 hover:brightness-110 border border-white/10"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <span>{isRegistering ? 'Criar Conta' : 'Entrar'}</span>
                <ArrowRight size={20} className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-8 text-center">
            <p className="text-sm text-gray-300">
                {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                <button 
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                  }}
                  className="text-white font-bold hover:underline ml-2 drop-shadow-md"
                >
                    {isRegistering ? 'Entrar' : 'Cadastre-se'}
                </button>
            </p>
        </div>
      </div>

      {/* Footer Version */}
      <div className="absolute bottom-6 text-[10px] text-gray-500 opacity-60">
        FITDEX v0.0.1
      </div>
    </div>
  );
};

export default Login;
