import React from 'react';
import {
  Zap,
  Play,
  Pause,
  Gauge,
  Send,
  Sparkles,
  TrendingUp,
  Activity,
  Plus,
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export type TrafficSpeed = 'normal' | 'fast' | 'turbo';

interface AutoTrafficPanelProps {
  isRunning: boolean;
  onToggleRunning: () => void;
  speed: TrafficSpeed;
  onChangeSpeed: (speed: TrafficSpeed) => void;
  onInjectBatch: (count: number) => void;
  totalGenerated: number;
  sessionGenerated: number;
}

export const AutoTrafficPanel: React.FC<AutoTrafficPanelProps> = ({
  isRunning,
  onToggleRunning,
  speed,
  onChangeSpeed,
  onInjectBatch,
  totalGenerated,
  sessionGenerated,
}) => {
  const speedDelays = {
    normal: '3s',
    fast: '1.5s',
    turbo: '0.8s',
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div
        className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          isRunning ? 'bg-emerald-500/15 opacity-100' : 'bg-slate-700/10 opacity-40'
        }`}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Info & Live Pulse Indicator */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`p-2 rounded-xl border flex items-center justify-center transition-colors ${
                isRunning
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Activity
                className={`w-5 h-5 ${isRunning ? 'animate-pulse text-emerald-400' : 'text-slate-500'}`}
              />
            </span>

            <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              Tráfego Automático
              <span
                className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                  isRunning
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                  }`}
                />
                {isRunning ? 'Ativo em Tempo Real' : 'Pausado'}
              </span>
            </h3>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-medium">
              <Send className="w-3 h-3 text-sky-400" />
              Via Telegram @CPACHINES26
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-xl">
            Gera fluxo contínuo de clientes entrando pelo seu link para avançar nas metas e destravar automaticamente os baús de bônus.
          </p>
        </div>

        {/* Right: Master Switch & Speed Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Speed Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onChangeSpeed('normal');
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                speed === 'normal'
                  ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="1 cliente a cada 3 segundos"
            >
              Normal (3s)
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onChangeSpeed('fast');
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                speed === 'fast'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="1 cliente a cada 1.5 segundo"
            >
              2x Rápido
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onChangeSpeed('turbo');
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                speed === 'turbo'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
              title="1 cliente a cada 0.8 segundo"
            >
              <Zap className="w-3 h-3" />
              Turbo 5x
            </button>
          </div>

          {/* Master Toggle Button */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onToggleRunning();
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Pausar Tráfego</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Ativar Tráfego</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Bar: Instant Injections & Live Counters */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Instant Batch Injections */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Injetar Lote Imediato:
          </span>
          <button
            type="button"
            onClick={() => onInjectBatch(5)}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
          >
            <Plus className="w-3 h-3 text-emerald-400" />
            +5 Clientes
          </button>
          <button
            type="button"
            onClick={() => onInjectBatch(15)}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            +15 Clientes
          </button>
          <button
            type="button"
            onClick={() => onInjectBatch(30)}
            className="px-3 py-1 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-xs font-black transition-all cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            +30 Clientes (Explosão)
          </button>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 self-end sm:self-auto">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Nesta Sessão: <strong className="text-cyan-300">{sessionGenerated}</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Total Geral: <strong className="text-emerald-300">{totalGenerated}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
