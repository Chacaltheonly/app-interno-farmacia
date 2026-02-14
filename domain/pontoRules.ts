
import { PontoType } from '../types';

export const pontoRules = {
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  isWithinRadius(lat: number, lng: number, cfgLat: number, cfgLng: number, radius: number): boolean {
    return this.calculateDistance(lat, lng, cfgLat, cfgLng) <= radius;
  },

  // Fix: Corrected string literals to match PontoType definition in types.ts
  getNextAllowedTypes(lastType: PontoType | null): PontoType[] {
    if (!lastType || lastType === 'saida_final') return ['entrada'];
    switch (lastType) {
      case 'entrada': return ['saida_almoco', 'intervalo', 'saida_final'];
      case 'saida_almoco': return ['retorno_almoco'];
      case 'retorno_almoco': return ['intervalo', 'saida_final'];
      case 'intervalo': return ['retorno'];
      case 'retorno': return ['saida_almoco', 'saida_final'];
      default: return ['entrada'];
    }
  },

  checkTolerance(targetTime: string, tolerance: number): 'WAIT' | 'WARN' | 'OK' {
    const now = new Date();
    const [h, m] = targetTime.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    
    const diff = (now.getTime() - target.getTime()) / (1000 * 60);
    if (diff < -tolerance) return 'WAIT';
    if (diff > tolerance) return 'WARN';
    return 'OK';
  }
};
