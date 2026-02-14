
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { useResultsData } from '../hooks/useResultsData';
import { resultsAgg } from '../domain/resultsAgg';
import { Trophy, Medal, Package, TrendingUp, Filter, Loader2, BarChart4, User as UserIcon, RefreshCw } from 'lucide-react';

interface ModuleResultadosProps {
  user: User;
  users: User[];
}

const ModuleResultados: React.FC<ModuleResultadosProps> = ({ user, users }) => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState('ALL');
  const [selectedColab, setSelectedColab] = useState(user.nome);
  const [refreshKey, setRefreshKey] = useState(0);

  // O refreshKey força o hook a recarregar quando o usuário clica no botão de refresh
  const { data, loading, error } = useResultsData(year, month, category);

  const sellers = useMemo(() => resultsAgg.aggregateBySeller(data), [data]);

  const topSellersGeral = useMemo(() => [...sellers].sort((a, b) => b.totalGeral - a.totalGeral).slice(0, 5), [sellers]);
  const topSellersParceiro = useMemo(() => [...sellers].sort((a, b) => b.totalParceiro - a.totalParceiro).slice(0, 5), [sellers]);

  const report = useMemo(() => {
    const s = sellers.find(x => x.nome === selectedColab);
    const p = data.filter(r => r.colaborador === selectedColab);
    const topP = resultsAgg.aggregateByProduct(p).sort((a, b) => b.valorTotal - a.valorTotal).slice(0, 10);
    return { stats: s, topProducts: topP };
  }, [sellers, selectedColab, data]);

  const handleRefresh = () => {
    // Simplesmente altera o estado para forçar o componente a remontar ou re-executar lógica se necessário
    // No caso, o useResultsData já reage a mudanças de parâmetros.
    window.location.reload(); // Forma mais bruta de garantir sincronia total com o Sheets
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 animate-pulse">
      <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Acessando Planilha...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart4 className="text-emerald-600" /> BI Farma
          </h2>
          <p className="text-slate-500 text-sm">Dados oficiais do Google Sheets</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={handleRefresh}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors shadow-sm"
            title="Sincronizar Planilha"
          >
            <RefreshCw size={20} />
          </button>
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold shadow-sm outline-none">
            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold shadow-sm outline-none">
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {data.length === 0 && !loading ? (
        <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} />
          </div>
          <h3 className="font-bold text-slate-800">Sem dados neste período</h3>
          <p className="text-slate-400 text-sm mt-1">Carregue as vendas no Painel Gestor para ver os resultados.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RankingCard title="Vendas Parceiros" icon={<Medal className="text-emerald-500" />} data={topSellersParceiro} metric="parceiro" />
            <RankingCard title="Vendas Gerais" icon={<Trophy className="text-amber-500" />} data={topSellersGeral} metric="geral" />
          </div>

          <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <UserIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg tracking-tight">Relatório Individual</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Performance por Colaborador</p>
                </div>
              </div>
              <select value={selectedColab} onChange={e => setSelectedColab(e.target.value)} className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none ring-0">
                {sellers.map(s => <option key={s.nome} value={s.nome}>{s.nome}</option>)}
              </select>
            </div>
            {report.stats ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatItem label="Venda Total" value={`R$ ${report.stats.totalGeral.toLocaleString()}`} sub={`Ranking Geral #${report.stats.rankGeral}`} />
                  <StatItem label="Venda Parceiro" value={`R$ ${report.stats.totalParceiro.toLocaleString()}`} sub={`Ranking Parc. #${report.stats.rankParceiro}`} highlight />
                  <StatItem label="Ticket Médio" value={`R$ ${report.stats.ticketMedio.toFixed(2)}`} sub={`${report.stats.vendasContagem} Cupons`} />
                  <StatItem label="Volume Itens" value={report.stats.itensContagem.toString()} sub="Produtos Vendidos" />
                </div>
                <div className="border-t border-slate-50 pt-8">
                  <h4 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">Mix de Produtos (Top 10)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                    {report.topProducts.map((p, i) => (
                      <div key={i} className="flex justify-between items-center text-sm py-3 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-300 font-black italic w-4">{i+1}</span>
                          <span className="font-bold text-slate-700 truncate max-w-[180px]">{p.nome}</span>
                        </div>
                        <span className="font-black text-slate-900">R$ {p.valorTotal.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : <p className="text-center text-slate-400 py-10 italic">Nenhum dado individual disponível.</p>}
          </section>
        </>
      )}
    </div>
  );
};

const RankingCard = ({ title, icon, data, metric }: any) => (
  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
    <div className="p-6 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon} <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <TrendingUp size={16} className="text-slate-300" />
    </div>
    <div className="divide-y divide-slate-50 flex-1">
      {data.map((item: any, i: number) => (
        <div key={i} className={`p-5 flex justify-between items-center transition-colors hover:bg-slate-50 ${i === 0 ? 'bg-emerald-50/20' : ''}`}>
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
              i === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {i+1}
            </div>
            <span className="font-bold text-slate-700">{item.nome}</span>
          </div>
          <div className="text-right">
             <p className={`font-black ${i === 0 ? 'text-emerald-700 text-lg' : 'text-slate-900'}`}>
               R$ {(metric === 'geral' ? item.totalGeral : item.totalParceiro).toLocaleString()}
             </p>
             <p className="text-[10px] font-bold text-slate-300 uppercase">{item.vendasContagem} vendas</p>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <div className="p-10 text-center text-slate-300 text-sm italic">Nenhum ranking disponível.</div>
      )}
    </div>
  </div>
);

const StatItem = ({ label, value, sub, highlight }: any) => (
  <div className={`p-6 rounded-3xl border transition-all ${highlight ? 'bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-100' : 'bg-white border-slate-100'}`}>
    <p className={`text-[9px] font-black uppercase mb-1 tracking-widest ${highlight ? 'text-emerald-200' : 'text-slate-400'}`}>{label}</p>
    <p className={`text-2xl font-black mb-1 ${highlight ? 'text-white' : 'text-slate-800'}`}>{value}</p>
    <p className={`text-[10px] font-bold ${highlight ? 'text-emerald-100' : 'text-slate-500'}`}>{sub}</p>
  </div>
);

export default ModuleResultados;
