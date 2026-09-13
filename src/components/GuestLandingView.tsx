import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Gift, CheckCircle2, Clock, ExternalLink, ArrowLeft } from 'lucide-react';
import { PlatformConfig } from '../types';
import { soundFX } from '../utils/audio';

interface GuestLandingViewProps {
  platformConfig: PlatformConfig;
  onClientEnter: (guestName?: string) => void;
  onBackToDashboard: () => void;
}

export const GuestLandingView: React.FC<GuestLandingViewProps> = ({
  platformConfig,
  onClientEnter,
  onBackToDashboard,
}) => {
  const [countdown, setCountdown] = useState(platformConfig.autoRedirect ? platformConfig.redirectDelaySeconds : 0);
  const [hasClicked, setHasClicked] = useState(false);
  const [visitorName, setVisitorName] = useState('');

  // Urgency timer (14:59)
  const [minutes, setMinutes] = useState(14);
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          setMinutes((m) => (m > 0 ? m - 1 : 0));
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto redirect handling if enabled
  useEffect(() => {
    if (!platformConfig.autoRedirect) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !hasClicked) {
      handleProceed();
    }
  }, [countdown, platformConfig.autoRedirect, hasClicked]);

  const handleProceed = () => {
    setHasClicked(true);
    soundFX.playCoin();

    // Register conversion in platform
    onClientEnter(visitorName.trim() || undefined);

    // Redirect to configured target URL
    setTimeout(() => {
      const url = platformConfig.targetUrl || 'https://google.com';
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Banner (Admin Preview Notice) */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            <strong>Visão do Cliente:</strong> É exatamente assim que os convidados verão a página ao clicarem no seu link!
          </span>
        </div>
        <button
          onClick={onBackToDashboard}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar ao Painel
        </button>
      </div>

      {/* Main Conversion Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-xl bg-slate-900/90 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-amber-500/10 text-center relative overflow-hidden backdrop-blur-md">
          
          {/* Subtle Ambient Light */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Special Invitation Tag */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold tracking-wide mb-4">
            <Gift className="w-4 h-4 text-amber-400" />
            Convite VIP Exclusivo
          </div>

          {/* Platform Name */}
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {platformConfig.platformName}
          </h1>

          {/* Highlight Bonus Box */}
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border border-amber-500/30 shadow-inner">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-extrabold block">
              BÔNUS ESPECIAL LIBERADO
            </span>
            <div className="text-2xl sm:text-3xl font-black text-yellow-300 font-mono tracking-tight mt-1">
              {platformConfig.bonusAmountText}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {platformConfig.headline}
            </p>
          </div>

          {/* Urgency Countdown */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-6 font-mono">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Oferta garantida pelos próximos:</span>
            <span className="font-bold text-amber-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Optional Name input for lead simulation */}
          <div className="space-y-3 mb-6">
            <input
              type="text"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="Digite seu nome (opcional)"
              className="w-full max-w-sm mx-auto px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm text-center focus:outline-none focus:border-amber-500 placeholder-slate-500"
            />
          </div>

          {/* Big CTA Button */}
          <div className="space-y-3">
            <button
              onClick={handleProceed}
              className="w-full max-w-md mx-auto py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-amber-500/40 transform hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Entrar na Plataforma & Ativar Bônus</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {platformConfig.autoRedirect && countdown > 0 && (
              <p className="text-xs text-amber-400 font-mono">
                Redirecionamento automático em {countdown} segundo{countdown !== 1 ? 's' : ''}...
              </p>
            )}

            {hasClicked && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Redirecionando você para a plataforma oficial...
              </div>
            )}
          </div>

          {/* Target link preview */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-2">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Destino Oficial Verificado:</span>
            </div>
            <span className="font-mono text-amber-300/80 truncate max-w-xs">
              {platformConfig.targetUrl}
            </span>
          </div>

          {/* Trust points */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
            <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
              🔒 Acesso 100% Seguro
            </div>
            <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
              ⚡ Ativação Imediata
            </div>
            <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
              🎁 Baú de Boas-Vindas
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900">
        Link Seguro de Afiliado & Divulgação • {platformConfig.platformName}
      </footer>
    </div>
  );
};
