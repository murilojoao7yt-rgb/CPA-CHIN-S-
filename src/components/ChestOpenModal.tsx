import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Check, Gift, ArrowRight } from 'lucide-react';
import { ChestTier } from '../types';
import { ChestVisual } from './ChestVisual';
import { soundFX } from '../utils/audio';

interface ChestOpenModalProps {
  isOpen: boolean;
  tier: ChestTier | null;
  onClose: () => void;
  onConfirmReward: (tierId: string, amount: number) => void;
}

export const ChestOpenModal: React.FC<ChestOpenModalProps> = ({
  isOpen,
  tier,
  onClose,
  onConfirmReward,
}) => {
  const [stage, setStage] = useState<'ready' | 'opening' | 'revealed'>('ready');
  const [rewardAmount, setRewardAmount] = useState<number>(0);

  useEffect(() => {
    if (isOpen && tier) {
      setStage('ready');
      // Generate a random reward between min and max
      const min = tier.rewardMin;
      const max = tier.rewardMax;
      const calculated = +(min + Math.random() * (max - min)).toFixed(2);
      setRewardAmount(calculated);
    }
  }, [isOpen, tier]);

  if (!isOpen || !tier) return null;

  const triggerConfetti = () => {
    // Left cannon
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.2, y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#10b981', '#f43f5e'],
    });
    // Right cannon
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.8, y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#10b981', '#f43f5e'],
    });
  };

  const handleOpenChest = () => {
    setStage('opening');
    soundFX.playChestOpen();

    setTimeout(() => {
      setStage('revealed');
      soundFX.playCoin();
      triggerConfetti();
    }, 700);
  };

  const handleCollect = () => {
    soundFX.playCoin();
    onConfirmReward(tier.id, rewardAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-center overflow-hidden">
        
        {/* Background aura */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Close Button (only before opening or after revealed) */}
        {stage !== 'opening' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Stage Content */}
        {stage === 'ready' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Baú Pronto para Abrir!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
                {tier.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Suas indicações e clientes gerados desbloquearam este baú de bônus!
              </p>
            </div>

            {/* Chest Graphic with shake */}
            <div className="py-4 flex justify-center">
              <div className="animate-bounce">
                <ChestVisual tier={tier} isOpen={false} isUnlocked={true} size="lg" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-400 block mb-1">Prêmio neste baú:</span>
              <span className="text-lg font-bold text-amber-400 font-mono">
                R$ {tier.rewardMin} a R$ {tier.rewardMax}
              </span>
            </div>

            <button
              onClick={handleOpenChest}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60 transform active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gift className="w-5 h-5" />
              Destrancar e Abrir Baú!
            </button>
          </div>
        )}

        {stage === 'opening' && (
          <div className="py-12 space-y-6">
            <div className="animate-pulse">
              <span className="text-sm font-bold text-amber-300 tracking-wider">
                DESTRANCANDO O BAÚ...
              </span>
            </div>
            <div className="flex justify-center scale-110">
              <div className="animate-spin duration-700">
                <ChestVisual tier={tier} isOpen={false} isUnlocked={true} size="lg" />
              </div>
            </div>
            <p className="text-xs text-slate-400">Contabilizando moedas de ouro...</p>
          </div>
        )}

        {stage === 'revealed' && (
          <div className="space-y-6 animate-in zoom-in-90 duration-300">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/50">
                <Sparkles className="w-3.5 h-3.5" /> Recompensa Desbloqueada!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Parabéns!
              </h2>
            </div>

            <div className="flex justify-center py-2">
              <ChestVisual tier={tier} isOpen={true} isUnlocked={true} size="lg" />
            </div>

            {/* Revealed Amount Display */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/50 shadow-lg shadow-emerald-950/50">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
                Você Ganhou:
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono tracking-tight mt-1">
                + R$ {rewardAmount.toFixed(2).replace('.', ',')}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Prêmio já disponível para resgate imediato via PIX
              </span>
            </div>

            <button
              onClick={handleCollect}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/30 transform active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              Coletar e Adicionar à Carteira
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
