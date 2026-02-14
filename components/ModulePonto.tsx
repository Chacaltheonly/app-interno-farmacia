
import React, { useState } from 'react';
import { User, PontoRecord, AppConfig, PontoType } from '../types';
import { MapPin, Clock, ShieldCheck, UserCog, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';

interface ModulePontoProps {
  user: User;
  records: PontoRecord[];
  config: AppConfig;
  onAdd: (record: PontoRecord) => void;
  allUsers?: User[]; // Passado pelo App.tsx ou constante
}

const ModulePonto: React.FC<ModulePontoProps> = ({ user, records, config, onAdd, allUsers = [] }) => {
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>(user.id);
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isGestorAction = selectedUserId !== user.id;
  const targetUser = allUsers.find(u => u.id === selectedUserId) || user;

  // Haversine Formula (Distância entre dois pontos)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleRegister = async (action: PontoType) => {
    if (isGestorAction && !motivo.trim()) {
      setError("O motivo é obrigatório para registros manuais feitos pelo gestor.");
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Validação de Sequência (Anti-fraude básico)
    const userRecords = records.filter(r => r.userId === selectedUserId);
    const lastRecord = userRecords[0]; // Assumindo ordenação descendente por tempo
    
    if (lastRecord && lastRecord.action === action) {
      setError(`O último registro para ${targetUser.nome} já foi "${action.replace('_', ' ')}".`);
      setLoading(false);
      return;
    }

    // 2. Capturar Geolocalização
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const distance = calculateDistance(latitude, longitude, config.lat, config.lng);

        // 3. Validar Precisão (Accuracy > 80m é sinal ruim)
        if (accuracy > 80) {
          setError(`GPS impreciso (${Math.round(accuracy)}m). Vá para perto da porta/janela e tente novamente.`);
          setLoading(false);
          return;
        }

        // 4. Validar Raio
        if (distance > config.raioMetros) {
          setError(`Fora do raio permitido. Distância: ${Math.round(distance)}m (limite: ${config.raioMetros}m).`);
          setLoading(false);
          return;
        }

        // 5. Criar Registro
        const newRecord: PontoRecord = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          userId: targetUser.id,
          userName: targetUser.nome,
          action,
          device: navigator.userAgent,
          lat: latitude,
          lng: longitude,
          accuracy,
          distancia_metros: distance,
          localConfiguradoLat: config.lat,
          localConfiguradoLng: config.lng,
          raioMetros: config.raioMetros,
          createdByUserId: user.id,
          createdByUserName: user.nome,
          isGestorAction,
          motivo: isGestorAction ? motivo : undefined,
          status: distance <= config.raioMetros ? 'Válido' : 'Fora do Raio'
        };

        onAdd(newRecord);
        setMotivo('');
        setLoading(false);
        alert(`Ponto registrado com sucesso para ${targetUser.nome}!`);
      },
      (err) => {
        setLoading(false);
        setError("Erro ao capturar localização. Verifique se o GPS está ativado e deu permissão ao navegador.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Registro de Ponto</h2>
            <p className="text-xs text-slate-500">Validação por geolocalização ativa ({config.raioMetros}m)</p>
          </div>
        </div>

        {/* Seção de Gestor: Selecionar Colaborador */}
        {user.role === 'GESTOR' && (
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCog size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase">Modo Gestor</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Registrar para:</label>
                <select 
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value={user.id}>Mim mesmo ({user.nome})</option>
                  {allUsers.filter(u => u.id !== user.id).map(u => (
                    <option key={u.id} value={u.id}>{u.nome}</option>
                  ))}
                </select>
              </div>

              {isGestorAction && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Motivo do Ajuste Manual:</label>
                  <input 
                    type="text"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ex: Esquecimento, Falha no Celular..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700 animate-in slide-in-from-top-2">
            <AlertTriangle className="shrink-0" size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: 'entrada', label: 'Entrada' },
            { id: 'saida_almoco', label: 'Saída Almoço' },
            { id: 'retorno_almoco', label: 'Retorno Almoço' },
            { id: 'intervalo', label: 'Intervalo (15m)' },
            { id: 'retorno', label: 'Retorno Int.' },
            { id: 'saida_final', label: 'Saída Final' }
          ].map((btn) => (
            <button
              key={btn.id}
              disabled={loading}
              onClick={() => handleRegister(btn.id as PontoType)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all group active:scale-95 disabled:opacity-50"
            >
              <div className="bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                <Clock size={20} />
              </div>
              <span className="text-xs font-bold text-slate-700">{btn.label}</span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
            <Loader2 className="animate-spin" size={18} />
            Validando Geolocalização...
          </div>
        )}
      </div>

      {/* Histórico Recente do Usuário Selecionado */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Logs de {targetUser.nome}</h3>
          <MapPin size={16} className="text-slate-300" />
        </div>
        <div className="divide-y divide-slate-50">
          {records.filter(r => r.userId === selectedUserId).length === 0 ? (
            <p className="p-10 text-center text-slate-400 text-sm italic">Nenhum registro hoje.</p>
          ) : (
            records.filter(r => r.userId === selectedUserId).map(r => (
              <div key={r.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${r.isGestorAction ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">{r.action.replace('_', ' ')}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(r.timestamp).toLocaleTimeString('pt-BR')} • {Math.round(r.distancia_metros)}m de distância
                    </p>
                  </div>
                </div>
                {r.isGestorAction && (
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">Manual</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ModulePonto;
