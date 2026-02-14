
import { SheetRowVenda, SellerAggregation, ProductAggregation } from '../types';

export const resultsAgg = {
  aggregateBySeller(rows: SheetRowVenda[]): SellerAggregation[] {
    const stats: Record<string, SellerAggregation> = {};
    rows.forEach(row => {
      if (!stats[row.colaborador]) {
        stats[row.colaborador] = {
          nome: row.colaborador,
          totalGeral: 0,
          totalParceiro: 0,
          vendasContagem: 0,
          itensContagem: 0,
          ticketMedio: 0
        };
      }
      const s = stats[row.colaborador];
      s.totalGeral += row.valor_total;
      if (row.categoria === 'PARCEIRO') s.totalParceiro += row.valor_total;
      s.itensContagem += row.quantidade;
      s.vendasContagem += 1;
    });

    const list = Object.values(stats);
    list.forEach(s => s.ticketMedio = s.totalGeral / s.vendasContagem);

    // Rankings
    const listGeral = [...list].sort((a, b) => b.totalGeral - a.totalGeral);
    const listParceiro = [...list].sort((a, b) => b.totalParceiro - a.totalParceiro);

    return list.map(s => ({
      ...s,
      rankGeral: listGeral.findIndex(x => x.nome === s.nome) + 1,
      rankParceiro: listParceiro.findIndex(x => x.nome === s.nome) + 1
    }));
  },

  aggregateByProduct(rows: SheetRowVenda[]): ProductAggregation[] {
    const stats: Record<string, ProductAggregation> = {};
    rows.forEach(row => {
      const id = `${row.sku}`;
      if (!stats[id]) {
        stats[id] = {
          sku: row.sku,
          nome: row.produto,
          categoria: row.categoria,
          quantidadeTotal: 0,
          valorTotal: 0
        };
      }
      stats[id].quantidadeTotal += row.quantidade;
      stats[id].valorTotal += row.valor_total;
    });
    return Object.values(stats);
  }
};
