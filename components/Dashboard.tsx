
import React from 'react';
import { User } from '../types';
import { Clock, Palmtree, BadgeDollarSign, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  user: User;
  setTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setTab }) => {
  const stats = [
    { label: 'Saldo Férias', value: '12 dias', icon: Palmtree, color: 'text-orange-600', bg: 'bg-orange-50', tab: 'ferias' },
    { label: 'Projeção 13º', value: `R$ ${(user.salario * 0.8).toLocaleString()}`, icon: BadgeDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', tab: '13o' },
    { label: 'Ponto Hoje', value: 'Pendente', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', tab: 'ponto' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Olá, {user.nome.split(' ')[0]} 👋</h2>
        <p className="text-slate-500">Bem-vindo ao sistema de gestão modular da farmácia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <button
            key={i}
            onClick={() => setTab(stat.tab)}
            className="flex flex-col p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <span className="text-sm font-medium text-slate-400">{stat.label}</span>
            <span className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Comunicados Internos</h3>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
              <p className="text-sm font-semibold text-emerald-800">Atualização do Raio de Ponto</p>
              <p className="text-xs text-emerald-700 mt-1">Agora o raio permitido é de 50 metros exatos da farmácia.</p>
            </div>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-sm font-semibold text-blue-800">Solicitação de Férias</p>
              <p className="text-xs text-blue-700 mt-1">Lembre-se de solicitar com 30 dias de antecedência pelo módulo.</p>
            </div>
          </div>
        </div>

        {user.role === 'GESTOR' && (
          <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                <ShieldCheck size={20} />
                Painel do Gestor
              </h3>
              <p className="text-emerald-100 text-sm mb-6">Você tem acesso total aos dados de provisionamento e aprovações de pessoal.</p>
              <button 
                onClick={() => setTab('gestor')}
                className="bg-white text-emerald-900 px-6 py-2 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors"
              >
                Acessar Gestão
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <ShieldCheck size={200} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
