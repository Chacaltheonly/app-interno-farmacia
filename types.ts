
export type Role = 'COLABORADOR' | 'GESTOR';

export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  salario: number;
  dataAdmissao: string;
  role: Role;
  ativo: boolean;
  inicioJornada: string;
  inicioAlmoco: string;
  retornoAlmoco: string;
  fimJornada: string;
}

export type PontoType = 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'intervalo' | 'retorno' | 'saida_final';

export interface AppConfig {
  lat: number;
  lng: number;
  raioMetros: number;
  toleranciaMinutos: number;
}

export interface PontoRecord {
  id: string;
  timestamp: string; // ISO
  userId: string;
  userName: string;
  action: PontoType;
  device: string;
  lat: number;
  lng: number;
  accuracy: number;
  distancia_metros: number;
  localConfiguradoLat: number;
  localConfiguradoLng: number;
  raioMetros: number;
  createdByUserId: string;
  createdByUserName: string;
  isGestorAction: boolean;
  motivo?: string;
  status: 'Válido' | 'Fora do Raio' | 'Auditado';
}

export interface FeriasRequest {
  id: string;
  userId: string;
  userName: string;
  dataInicio: string;
  dataFim: string;
  status: 'Pendente' | 'Aprovado' | 'Negado';
  dataSolicitacao: string;
}

export interface VendaRecord {
  data: string;
  anoMes: string;
  colaboradorEmail: string;
  vendasLiquidas: number;
  cmv: number;
  cupons: number;
  itensVendidos: number;
  parceirosUnidades: number;
}

export interface SheetRowVenda {
  data: string;
  hora: string;
  colaborador: string;
  sku: string | number;
  produto: string;
  categoria: 'PARCEIRO' | 'NORMAL';
  quantidade: number;
  valor_total: number;
  valor_unit: number;
  margem?: number;
}

// Fix: Interface for seller performance metrics aggregation
export interface SellerAggregation {
  nome: string;
  totalGeral: number;
  totalParceiro: number;
  vendasContagem: number;
  itensContagem: number;
  ticketMedio: number;
  rankGeral?: number;
  rankParceiro?: number;
}

// Fix: Interface for product sales volume aggregation
export interface ProductAggregation {
  sku: string | number;
  nome: string;
  categoria: 'PARCEIRO' | 'NORMAL';
  quantidadeTotal: number;
  valorTotal: number;
}
