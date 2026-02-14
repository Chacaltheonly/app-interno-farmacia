
import { User, AppConfig, VendaRecord } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@farmacia.com',
    cargo: 'Farmacêutico',
    salario: 4500,
    dataAdmissao: '2023-01-15',
    role: 'COLABORADOR',
    // Fix: Added missing 'ativo' property required by User interface
    ativo: true,
    inicioJornada: '08:00',
    inicioAlmoco: '12:00',
    retornoAlmoco: '13:00',
    fimJornada: '17:00'
  },
  {
    id: '2',
    nome: 'Maria Souza',
    email: 'maria@farmacia.com',
    cargo: 'Gerente Adm',
    salario: 6000,
    dataAdmissao: '2022-06-10',
    role: 'GESTOR',
    // Fix: Added missing 'ativo' property required by User interface
    ativo: true,
    inicioJornada: '09:00',
    inicioAlmoco: '13:00',
    retornoAlmoco: '14:00',
    fimJornada: '18:00'
  }
];

// Fix: Corrected property names to match AppConfig interface and added missing tolerance property
export const CONFIG: AppConfig = {
  lat: -23.5505,
  lng: -46.6333,
  raioMetros: 50,
  toleranciaMinutos: 15
};

const generateMockSales = (): VendaRecord[] => {
  const sales: VendaRecord[] = [];
  const emails = ['joao@farmacia.com', 'maria@farmacia.com'];
  const now = new Date();
  
  for (let yearOffset = 0; yearOffset < 3; yearOffset++) {
    for (let month = 0; month < 12; month++) {
      const year = now.getFullYear() - yearOffset;
      const monthStr = (month + 1).toString().padStart(2, '0');
      const anoMes = `${year}-${monthStr}`;
      
      emails.forEach(email => {
        const factor = 1 - (yearOffset * 0.1);
        sales.push({
          data: `${year}-${monthStr}-15`,
          anoMes,
          colaboradorEmail: email,
          vendasLiquidas: (45000 + Math.random() * 10000) * factor,
          cmv: (15000 + Math.random() * 5000) * factor,
          cupons: Math.floor((800 + Math.random() * 200) * factor),
          itensVendidos: Math.floor((2500 + Math.random() * 500) * factor),
          parceirosUnidades: Math.floor((150 + Math.random() * 50) * factor)
        });
      });
    }
  }
  return sales;
};

export const MOCK_SALES = generateMockSales();
