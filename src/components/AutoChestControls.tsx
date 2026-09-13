import React from 'react';
import {
  Sparkles,
  RotateCcw,
  Zap,
  CheckCircle2,
  Gift,
  Clock,
  Flame,
  Award,
} from 'lucide-react';
import { ChestTier } from '../types';
import { soundFX } from '../utils/audio';

interface AutoChestControlsProps {
  autoChestEnabled: boolean;
  onToggleAutoChest: () => void;
  cycle: number;
  onManualRefreshChests: () => void;
  chests: ChestTier[];
  totalGuests: number;
  readyToOpenCount: number;
}

export const AutoChestControls: React.FC<AutoChestControlsProps> = ({
  autoChestEnabled,
  onToggleAutoChest,
  cycle,
  onManualRefreshChests,
  chests,
  totalGuests,
  readyToOpenCount,
}) => {
  const openedCount = chests.filter((c) => c.opened).length;
  const allOpened = openedCount === chests.length;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left: Info & Cycle */}
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Sistema Automático de Baús & Bônus
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold font-mono">
              Ciclo #{cycle}
            </span>
            {autoChestEnabled ? (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Auto-Atualização Ativada
              </span>
            ) : (
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                Manual
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {autoChestEnabled
              ? 'Baús são abertos automaticamente ao atingir a meta e novos ciclos são gerados sem interrupção.'
              : 'Ative para abrir e renovar baús automaticamente assim que os clientes entrarem.'}
          </p>
        </div>
      </div>

      {/* Right: Controls (Toggle + Manual Refresh) */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
        {/* Toggle Auto Chest */}
        <button
          type="button"
          onClick={() => {
            soundFX.playClick();
            onToggleAutoChest();
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
            autoChestEnabled
              ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
          }`}
        >
          <div
            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
              autoChestEnabled
                ? 'bg-emerald-400 border-emerald-300'
                : 'bg-slate-600 border-slate-500'
            }`}
          >
            {autoChestEnabled && <CheckCircle2 className="w-2.5 h-2.5 text-slate-950" />}
          </div>
          <span>{autoChestEnabled ? 'Auto Baús: Ligado' : 'Ligar Auto Baús'}</span>
        </button>

        {/* Manual Refresh Chests Button */}
        <button
          type="button"
          onClick={() => {
            soundFX.playCoin();
            onManualRefreshChests();
          }}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          title="Reiniciar e atualizar baús para um novo ciclo de bônus"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Atualizar Baús Agora</span>
        </button>
      </div>
    </div>
  );
};
