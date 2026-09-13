import React from 'react';
import { Lock, Unlock, CheckCircle2, Sparkles, Users, Gift } from 'lucide-react';
import { ChestTier } from '../types';
import { ChestVisual } from './ChestVisual';
import { soundFX } from '../utils/audio';

interface ChestCardProps {
  tier: ChestTier;
  totalGuests: number;
  onOpenChest: (tier: ChestTier) => void;
}

export const ChestCard: React.FC<ChestCardProps> = ({
  tier,
  totalGuests,
  onOpenChest,
}) => {
  const isUnlocked = totalGuests >= tier.minGuests;
  const isOpened = tier.opened;
  const progressPercent = Math.min(100, Math.round((totalGuests / tier.minGuests) * 100));
  const guestsRemaining = Math.max(0, tier.minGuests - totalGuests);

  const handleActionClick = () => {
    if (isUnlocked && !isOpened) {
      soundFX.playClick();
      onOpenChest(tier);
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isOpened
          ? 'bg-slate-900/60 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
          : isUnlocked
          ? `bg-gradient-to-b from-slate-900 to-slate-950 ${tier.borderGlow} border-2 ring-2 ring-amber-400/20 shadow-xl hover:-translate-y-1`
          : 'bg-slate-900/50 border-slate-800/80 opacity-90'
      }`}
    >
      {/* Background radial glow */}
      {isUnlocked && !isOpened && (
        <div
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{ backgroundColor: tier.accentColor }}
        />
      )}

      {/* Top Bar: Level & Status Tag */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            Nível {tier.level}
          </span>

          {isOpened ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Resgatado
            </span>
          ) : isUnlocked ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/50 px-2.5 py-0.5 rounded-full animate-pulse shadow-sm shadow-amber-500/30">
              <Unlock className="w-3 h-3" /> Liberado!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3 text-slate-500" /> Bloqueado
            </span>
          )}
        </div>

        {/* Chest Illustration */}
        <div className="flex justify-center py-2">
          <ChestVisual
            tier={tier}
            isOpen={isOpened}
            isUnlocked={isUnlocked}
            size="md"
          />
        </div>

        {/* Title & Description */}
        <div className="text-center mt-2">
          <h3 className="text-base font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
            {tier.name}
            {isUnlocked && !isOpened && (
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {tier.description}
          </p>
        </div>

        {/* Reward Value Display */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
            {isOpened ? 'Valor Conquistado' : 'Prêmio Estimado'}
          </span>
          {isOpened && tier.earnedAmount !== null ? (
            <div className="text-xl font-black text-emerald-400 font-mono tracking-tight mt-0.5">
              + R$ {tier.earnedAmount.toFixed(2).replace('.', ',')}
            </div>
          ) : (
            <div className="text-lg font-bold text-amber-400 font-mono tracking-tight mt-0.5">
              R$ {tier.rewardMin} ~ R$ {tier.rewardMax}
            </div>
          )}
          <span className="text-[10px] text-slate-400 inline-block mt-0.5">
            {tier.bonusPerk}
          </span>
        </div>
      </div>

      {/* Progress towards unlocking */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        {!isOpened && (
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" /> Clientes
              </span>
              <span className="font-mono font-semibold text-slate-200">
                {totalGuests} / {tier.minGuests}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isUnlocked ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-slate-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {isOpened ? (
          <div className="w-full py-2.5 rounded-xl bg-slate-800/50 text-emerald-400 border border-emerald-800/30 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Saldo creditado na carteira
          </div>
        ) : isUnlocked ? (
          <button
            onClick={handleActionClick}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transform active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Gift className="w-4 h-4 animate-bounce" />
            Abrir Baú Agora!
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-xl bg-slate-800/70 text-slate-400 text-xs text-center border border-slate-700/50 font-medium flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-500" />
            Faltam {guestsRemaining} {guestsRemaining === 1 ? 'cliente' : 'clientes'}
          </div>
        )}
      </div>
    </div>
  );
};
