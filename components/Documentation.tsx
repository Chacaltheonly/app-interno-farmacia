
import React from 'react';
import { Database, LayoutTemplate, Settings, Layers, BarChart3 } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-700 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800">Manual de Arquitetura</h2>
        <p className="text-slate-500 mt-2">Como replicar este sistema usando Google Sheets e AppSheet.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
        <section>
          <h3 className="flex items-center gap-3 text-xl font-bold text-emerald-700 mb-4">
            <Database size={24} />
            1. Estrutura do Google Sheets
          </h3>
          <p className="text-slate-600 mb-4">Crie as seguintes abas principais:</p>
          
          <div className="space-y-6">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h4 className="font-bold text-slate-800">Aba: Vendas_Base</h4>
              <p className="text-xs text-slate-500 mb-2 italic">Colunas: Data, AnoMes, Colaborador_Email, Vendas_Liquidas, CMV, Cupons, Itens_Vendidos, Parceiros_Unidades</p>
              <p className="text-sm text-slate-600">Lance uma linha por dia para cada colaborador.</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-bold text-slate-800">Aba: Resultados_Consolidados</h4>
              <p className="text-sm text-slate-600">Use <code className="bg-slate-100 px-1 font-mono text-xs">QUERY</code> ou <code className="bg-slate-100 px-1 font-mono text-xs">SUMIFS</code> para consolidar por AnoMes + Colaborador.</p>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="font-bold text-slate-800">Aba: BI_Comparativo</h4>
              <p className="text-sm text-slate-600">Fórmula para busca trienal (Mês Atual vs Ano-1 vs Ano-2):</p>
              <code className="block bg-slate-900 text-emerald-400 p-3 rounded-lg text-[10px] mt-2 overflow-x-auto">
                =SUMIFS(Vendas_Base!D:D; Vendas_Base!B:B; TEXT(EDATE(TODAY();-12);"yyyy-mm"); Vendas_Base!C:C; "email@colab.com")
              </code>
            </div>
          </div>
        </section>

        <section>
          <h3 className="flex items-center gap-3 text-xl font-bold text-emerald-700 mb-4">
            <BarChart3 size={24} />
            2. Dashboard no AppSheet
          </h3>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-3">
            <li><strong>Slice "Meu Resultado":</strong> Use <code className="bg-slate-100 px-1">[Colaborador_Email] = USEREMAIL()</code> para segurança.</li>
            <li><strong>View Type Chart:</strong> Configure o tipo "Col Series" no AppSheet para comparar as colunas Atual, Ano-1 e Ano-2.</li>
            <li><strong>KPI Cards:</strong> Utilize a funcionalidade de "Dashboard View" combinando gráficos e tabelas resumidas.</li>
          </ul>
        </section>

        <section className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <h3 className="flex items-center gap-3 text-lg font-bold text-emerald-800 mb-3">
            <Layers size={20} />
            Dica do Especialista
          </h3>
          <p className="text-sm text-emerald-700 leading-relaxed">
            Sempre armazene os valores de CMV e Vendas Brutas separadamente. No AppSheet, use Virtual Columns para calcular o lucro bruto e margem em tempo real. Isso evita "congelar" erros de arredondamento no Google Sheets.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Documentation;
