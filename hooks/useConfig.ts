
import { useState, useEffect } from 'react';
import { AppConfig } from '../types';

const STORAGE_KEY = 'APP_CONFIG';

const DEFAULT_CONFIG: AppConfig = {
  lat: -28.94988183509923,
  lng: -49.4987754,
  raioMetros: 50,
  toleranciaMinutos: 10
};

export const useConfig = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar config:", e);
      }
    }
  }, []);

  const updateConfig = (newConfig: AppConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    setConfig(newConfig);
  };

  return { config, updateConfig };
};
