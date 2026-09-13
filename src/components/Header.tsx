import React from 'react';
import { Sparkles, Link2, Eye, Wallet, KeyRound, ExternalLink, Settings, ShieldCheck } from 'lucide-react';
import { PlatformConfig } from '../types';

interface HeaderProps {
  platformConfig: PlatformConfig;
  onOpenConfigModal: () => void;
  onToggleGuestPreview: () => void;
  onOpenWithdrawModal: () => void;
  totalEarnings: number;
  totalGuests: number;
  availableKeys: number;
  isPreviewMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  platformConfig,
  onOpenConfigModal,
  onToggleGuestPreview,
  onOpenWithdrawModal,
  totalEarnings,
  totalGuests,
  availableKeys,
  isPreviewMode,
}) => {
  // Extract clean hostname for quick display
  const getDisplayDomain = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return 'Link não cadastrado';
    }
  };

  const isLinkSet = Boolean(platformConfig.targetUrl && platformConfig.targetUrl.startsWith('http'));

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Active Target Platform */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
                <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                    CPA CHINÊS 2026
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                      VIP
                    </span>
                  </h1>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Destino:</span>
                  <button
                    onClick={onOpenConfigModal}
                    className="inline-flex items-center gap-1 font-mono text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
                    title="Clique para alterar o link da plataforma"
                  >
                    <span className="truncate max-w-[170px] sm:max-w-[240px]">
                      {isLinkSet ? getDisplayDomain(platformConfig.targetUrl) : 'Cadastrar link agora'}
                    </span>
                    <Settings className="w-3 h-3" />
                  </button>
                  {isLinkSet && (
                    <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                      <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> Ativo
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile View Toggle & Withdraw */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={onOpenWithdrawModal}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 bg-emerald-600 text-white shadow-sm"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Sacar</span>
              </button>

              <button
                onClick={onToggleGuestPreview}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
                  isPreviewMode
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {isPreviewMode ? 'Painel' : 'Convidado'}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center justify-around w-full md:w-auto gap-2 sm:gap-6 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-center">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
                Ganhos em Baús
              </span>
              <span className="text-base sm:text-lg font-extrabold text-amber-400 font-mono">
                R$ {totalEarnings.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="w-px h-8 bg-slate-800" />

            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
                Clientes Gerados
              </span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono">
                {totalGuests}
              </span>
            </div>

            <div className="w-px h-8 bg-slate-800" />

            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium flex items-center justify-center gap-1">
                <KeyRound className="w-3 h-3 text-cyan-400" /> Chaves
              </span>
              <span className="text-base sm:text-lg font-extrabold text-cyan-400 font-mono">
                {availableKeys}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onOpenWithdrawModal}
              disabled={totalEarnings <= 0}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                totalEarnings > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              Sacar PIX
            </button>

            <button
              onClick={onOpenConfigModal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Link2 className="w-3.5 h-3.5 text-amber-400" />
              Cadastrar Link
            </button>

            <button
              onClick={onToggleGuestPreview}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isPreviewMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-indigo-950/60 text-indigo-200 border-indigo-700/50 hover:bg-indigo-900/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {isPreviewMode ? 'Voltar ao Painel' : 'Visão do Convidado'}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
