
import React, { useState } from 'react';
import * as firebaseAuth from 'firebase/auth';
import * as firestoreMod from 'firebase/firestore';
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = firebaseAuth as any;
const { doc, setDoc } = firestoreMod as any;
import { auth, db } from '../firebase';
import { LogIn, Lock, Mail, Loader2, UserPlus, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Fluxo de Cadastro
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Criar documento do usuário no Firestore (inativo por padrão)
        await setDoc(doc(db, "usuarios", user.uid), {
          nome,
          email,
          cargo,
          role: 'COLABORADOR',
          ativo: false, // Aguardando aprovação do gestor
          salario: 0,
          dataAdmissao: new Date().toISOString().split('T')[0],
          inicioJornada: '08:00',
          inicioAlmoco: '12:00',
          retornoAlmoco: '13:00',
          fimJornada: '17:00'
        });
      } else {
        // Fluxo de Login
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Falha na autenticação. Verifique os dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-100">
            {isRegistering ? <UserPlus className="text-white" size={32} /> : <LogIn className="text-white" size={32} />}
          </div>
          <h1 className="text-2xl font-bold text-slate-800">FarmaGestão</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isRegistering ? 'Crie sua conta de colaborador' : 'Acesse sua conta para continuar'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nome Completo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Seu Cargo (ex: Balconista)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="E-mail"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Senha"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isRegistering ? 'Criar Conta' : 'Entrar no Sistema')}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          {isRegistering ? (
            <button 
              onClick={() => setIsRegistering(false)} 
              className="text-sm font-semibold text-slate-500 hover:text-emerald-600 flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft size={14} /> Já tenho conta
            </button>
          ) : (
            <button 
              onClick={() => setIsRegistering(true)} 
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Não tem conta? Cadastre-se
            </button>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-8 uppercase font-bold tracking-widest">
          Sistema Interno Exclusivo
        </p>
      </div>
    </div>
  );
};

export default Login;
