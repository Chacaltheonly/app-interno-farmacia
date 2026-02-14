
import React from 'react';
import { User } from '../types';
import { BadgeDollarSign, TrendingUp, Calculator, PiggyBank } from 'lucide-react';

interface Module13Props {
  user: User;
}

const Module13: React.FC<Module13Props> = ({ user }) => {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const valorProporcional = (user.salario / 12) * currentMonth;
  const valorAnual = user.salario;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Décimo Terceiro</h2>
        <p className="text-slate-500">Acompanhe a projeção anual do seu benefício.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <PiggyBank size={28} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Projeção Acumulada</p>
                <p className="text-4xl font-bold text-slate-800">R$ {valorProporcional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 border-t border-slate-100 pt-6">
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Base Salarial</p>
                <p className="font-bold text-slate-700">R$ {user.salario.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Meses no Ano</p>
                <p className="font-bold text-slate-700">{currentMonth} de 12</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[280px]">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calculator size={16} className="text-emerald-600" />
              Memória de Cálculo
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Salário / 12</span>
                <span className="font-medium">R$ {(user.salario / 12).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Multiplicador (meses)</span>
                <span className="font-medium">x {currentMonth}</span>
              </div>
              <div className="border-t border-slate-200 my-2"></div>
              <div className="flex justify-between font-bold text-emerald-600">
                <span>Total Bruto</span>
                <span>R$ {valorProporcional.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">* Valores brutos sujeitos a encargos na folha final.</p>
            </div>
          </div>
        </div>
        
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-50"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Projeção 2ª Parcela</h4>
            <p className="text-sm text-slate-500 mt-1">Estimativa de quitação em Dezembro: <span className="font-bold text-slate-700">R$ {valorAnual.toLocaleString()}</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
            <BadgeDollarSign size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Antecipação</h4>
            <p className="text-sm text-slate-500 mt-1">Consulte o RH para solicitar a 1ª parcela junto às férias.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module13;
