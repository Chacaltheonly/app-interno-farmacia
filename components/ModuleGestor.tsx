
import React, { useState } from 'react';
import { User, AppConfig } from '../types';
import { Settings2, MapPin, Navigation, Save, Loader2, ShieldCheck, Info } from 'lucide-react';

interface ModuleGestorProps {
  currentUser: User;
  users: User[];
  appConfig: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
}

const ModuleGestor: React.FC<ModuleGestorProps> = ({ 
  users, 
  appConfig,
  onUpdateConfig
}) => {
  const [config, setConfig] = useState<AppConfig>(appConfig);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const handleCaptureCurrentLocation = () => {
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setConfig(prev => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }));
        setLoadingLoc(false);
      },
      (err) => {
        alert("Erro ao capturar localização. Verifique as permissões.");
        setLoadingLoc(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSave = () => {
    onUpdateConfig(config);
    alert("Configurações da unidade salvas com sucesso!");
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" /> Gestão Operacional
        </h2>
        <p className="text-slate-500 text-sm">Configurações de geofencing e equipe.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
            <Settings2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Parâmetros de Localização</h3>
            <p className="text-xs text-slate-500">Defina onde os colaboradores podem bater o ponto.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1">Latitude</label>
              <input 
                type="number" 
                value={config.lat}
                onChange={e => setConfig({...config, lat: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                step="any"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1">Longitude</label>
              <input 
                type="number" 
                value={config.lng}
                onChange={e => setConfig({...config, lng: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                step="any"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1">Raio Permitido (Metros)</label>
              <input 
                type="number" 
                value={config.raioMetros}
                onChange={e => setConfig({...config, raioMetros: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-1">Tolerância (Minutos)</label>
              <input 
                type="number" 
                value={config.toleranciaMinutos}
                onChange={e => setConfig({...config, toleranciaMinutos: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleCaptureCurrentLocation}
            disabled={loadingLoc}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3 px-6 rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {loadingLoc ? <Loader2 className="animate-spin" size={18} /> : <Navigation size={18} />}
            Usar minha localização atual
          </button>
          
          <button 
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-6 rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all"
          >
            <Save size={18} />
            Salvar Configuração
          </button>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
          <Info className="text-amber-600 shrink-0" size={18} />
          <p className="text-xs text-amber-700 leading-relaxed">
            <b>Dica de Calibração:</b> Clique em "Usar minha localização atual" enquanto estiver dentro da farmácia (próximo ao caixa ou balcão central) para definir o ponto zero do sistema.
          </p>
        </div>
      </div>

      {/* Listagem de Colaboradores Simplificada para o Gestor */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Resumo da Equipe</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {users.map(u => (
            <div key={u.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {u.nome.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{u.nome}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{u.cargo}</p>
                </div>
              </div>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${u.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {u.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleGestor;
