
import React, { useState } from 'react';
import { User, FeriasRequest } from '../types';
import { Palmtree, Calendar, Send, Info, CheckCircle, Clock, XCircle } from 'lucide-react';

interface ModuleFeriasProps {
  user: User;
  requests: FeriasRequest[];
  onAdd: (req: FeriasRequest) => void;
}

const ModuleFerias: React.FC<ModuleFeriasProps> = ({ user, requests, onAdd }) => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Lógica simples de cálculo de férias adquiridas
  const admissao = new Date(user.dataAdmissao);
  const hoje = new Date();
  const diffTime = Math.abs(hoje.getTime() - admissao.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const mesesTrabalhados = Math.floor(diffDays / 30);
  const diasAdquiridos = mesesTrabalhados * 2.5; // 30 dias por ano = 2.5 por mês

  const userRequests = requests.filter(r => r.userId === user.id);
  const diasGozados = userRequests
    .filter(r => r.status === 'Aprovado')
    .reduce((acc, r) => {
      const start = new Date(r.dataInicio);
      const end = new Date(r.dataFim);
      return acc + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);

  const saldo = diasAdquiridos - diasGozados;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataInicio || !dataFim) return;

    const newRequest: FeriasRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.nome,
      dataInicio,
      dataFim,
      status: 'Pendente',
      dataSolicitacao: new Date().toLocaleDateString('pt-BR')
    };

    onAdd(newRequest);
    setDataInicio('');
    setDataFim('');
    alert('Solicitação enviada com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <span className="text-slate-400 text-xs font-bold uppercase mb-2">Dias Adquiridos</span>
          <span className="text-3xl font-bold text-slate-800">{Math.floor(diasAdquiridos)}</span>
          <p className="text-[10px] text-slate-400 mt-1">Desde admissão em {user.dataAdmissao}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
          <span className="text-slate-400 text-xs font-bold uppercase mb-2">Dias Gozados</span>
          <span className="text-3xl font-bold text-blue-600">{diasGozados}</span>
          <p className="text-[10px] text-slate-400 mt-1">Férias já usufruídas</p>
        </div>
        <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg flex flex-col items-center text-white">
          <span className="text-emerald-100 text-xs font-bold uppercase mb-2">Saldo Atual</span>
          <span className="text-3xl font-bold">{Math.floor(saldo)}</span>
          <p className="text-[10px] text-emerald-200 mt-1">Disponíveis para solicitação</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-emerald-600" />
            Solicitar Férias
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início</label>
              <input 
                type="date" 
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Retorno</label>
              <input 
                type="date" 
                value={dataFim}
                onChange={e => setDataFim(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                required
              />
            </div>
            <div className="p-4 bg-orange-50 rounded-xl flex gap-3">
              <Info className="text-orange-500 shrink-0" size={20} />
              <p className="text-xs text-orange-700">As solicitações serão analisadas pela gerência conforme a escala de plantão.</p>
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Enviar Solicitação
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Histórico de Solicitações</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {userRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Nenhuma solicitação encontrada.</div>
            ) : (
              userRequests.map(req => (
                <div key={req.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(req.dataInicio).toLocaleDateString('pt-BR')} até {new Date(req.dataFim).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-slate-400">Solicitado em: {req.dataSolicitacao}</p>
                  </div>
                  <div>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'Negado' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status === 'Aprovado' ? <CheckCircle size={14} /> : 
                       req.status === 'Negado' ? <XCircle size={14} /> : 
                       <Clock size={14} />}
                      {req.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleFerias;
