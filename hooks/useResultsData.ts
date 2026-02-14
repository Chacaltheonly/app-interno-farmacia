
import { useState, useEffect } from 'react';
import { SheetRowVenda } from '../types';
import { sheetsApi } from '../services/sheetsApi';

export const useResultsData = (year: number, month: number, category: string) => {
  const [data, setData] = useState<SheetRowVenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    sheetsApi.fetchVendas(year, month, category)
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [year, month, category]);

  return { data, loading, error };
};
