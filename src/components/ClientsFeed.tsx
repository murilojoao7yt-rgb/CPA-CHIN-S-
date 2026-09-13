import React from 'react';
import { Users, UserCheck, Zap, ArrowUpRight, Play, Pause, MapPin, Sparkles, Clock } from 'lucide-react';
import { GuestLead } from '../types';

interface ClientsFeedProps {
  leads: GuestLead[];
  onGenerateBatch: () => void;
  isAutoTrafficRunning: boolean;
  onToggleAutoTraffic: () => void;
  totalGuests: number;
}

export const ClientsFeed: React.FC<ClientsFeedProps> = ({
  leads,
  onGenerateBatch,
  isAutoTrafficRunning,
  onToggleAutoTraffic,
  totalGuests,
}) => {
  const getStatusBadge = (status: GuestLead['status']) => {
    switch (status) {
      case 'ativou_bonus':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Cadastrado & Bônus Ativo
          </span>
        );
      case 'cadastrado':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Cadastro Concluído
          </span>
        );
      case 'visitou':
      default:
        return (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            Acessou Link
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
      {/* Header & Controls */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Users className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Clientes Entrando na Plataforma
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Registro em tempo real dos convidados que acessaram e se cadastraram via seu link de indicação
            </p>
          </div>

          {/* Generator Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleAutoTraffic}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isAutoTrafficRunning
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
              }`}
              title="Ativa ou pausa a geração contínua de visitantes entrando"
            >
              {isAutoTrafficRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  Pausar Tráfego
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  Tráfego Automático
                </>
              )}
            </button>

            <button
              onClick={onGenerateBatch}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transform active:scale-95 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              +5 Novos Clientes
            </button>
          </div>
        </div>

        {/* Live Counter Pill */}
        <div className="my-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white">Fluxo de Indicações Ativo</span>
          </div>
          <div className="font-mono text-emerald-400 font-bold">
            {totalGuests} clientes contabilizados
          </div>
        </div>

        {/* Leads Feed List */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                lead.isRecent
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/30 animate-in fade-in slide-in-from-top-2 duration-300'
                  : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-950'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={lead.avatar}
                  alt={lead.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {lead.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      via {lead.origin}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {lead.city}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-slate-500">
                      <Clock className="w-2.5 h-2.5" />
                      {lead.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                {getStatusBadge(lead.status)}
                <span className="text-[10px] font-mono text-amber-400 font-semibold">
                  + 1 Ponto de Baú
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Insight */}
      <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          A cada novo cliente cadastrado, você avança no desbloqueio do próximo Baú.
        </span>
      </div>
    </div>
  );
};
