
import { AppConfig, SheetRowVenda, PontoType } from '../types';

// SUBSTITUA PELA URL DO SEU WEBAPP APPS SCRIPT
const WEBAPP_URL = 'https://script.google.com/macros/s/SUA_ID_AQUI/exec';

export const sheetsApi = {
  async fetchConfig(): Promise<AppConfig> {
    const res = await fetch(`${WEBAPP_URL}?action=config`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.config;
  },

  async fetchVendas(year: number, month: number, category: string): Promise<SheetRowVenda[]> {
    const res = await fetch(`${WEBAPP_URL}?action=vendas&year=${year}&month=${month}&category=${category}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.rows;
  },

  async postPonto(payload: any): Promise<void> {
    const res = await fetch(`${WEBAPP_URL}?action=ponto`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
  },

  async batchUploadVendas(vendas: SheetRowVenda[]): Promise<void> {
    const res = await fetch(`${WEBAPP_URL}?action=batchVendas`, {
      method: 'POST',
      body: JSON.stringify({ rows: vendas })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
  }
};
