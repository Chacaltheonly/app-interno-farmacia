
import React, { useState } from 'react';
import { User } from '../types';
import { 
  LayoutDashboard, 
  Clock, 
  Palmtree, 
  BadgeDollarSign, 
  ShieldCheck, 
  BookOpen, 
  Menu, 
  X, 
  UserCircle2,
  BarChart3,
  Unlock
} from 'lucide-react';

interface LayoutProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, activeTab, setActiveTab, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'ponto', label: 'Ponto Eletrônico', icon: Clock },
    { id: 'resultados', label: 'Meus Resultados', icon: BarChart3 },
    { id: 'ferias', label: 'Minhas Férias', icon: Palmtree },
    { id: '13o', label: 'Décimo Terceiro', icon: BadgeDollarSign },
    { id: 'gestor', label: 'Painel Gestor', icon: ShieldCheck },
    { id: 'docs', label: 'Manual de Dados', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <header className="md:hidden bg-emerald-600 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="font-bold text-lg">FarmaGestão</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <aside className={`
        fixed inset-0 z-40 bg-white md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 border-r border-slate-200 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:block border-b border-slate-100">
          <h1 className="font-bold text-xl text-emerald-700">FarmaGestão</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Acesso Rápido</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-emerald-700' : 'text-slate-400'} />
              {item.label}
              {(item.id === 'gestor' || item.id === 'docs') && user.role !== 'GESTOR' && <Unlock size={12} className="ml-auto text-slate-300" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <UserCircle2 size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user.nome}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black">{user.role}</p>
            </div>
            {user.role === 'GESTOR' && (
              <button onClick={onLogout} className="text-red-400 hover:text-red-600 p-1" title="Encerrar Gestão">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
