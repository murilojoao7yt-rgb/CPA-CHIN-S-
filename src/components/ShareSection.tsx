import React, { useState } from 'react';
import {
  Copy,
  Check,
  Send,
  QrCode,
  FileText,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { PlatformConfig } from '../types';
import { soundFX } from '../utils/audio';

interface ShareSectionProps {
  platformConfig: PlatformConfig;
  referralLink: string;
  onOpenConfigModal: () => void;
  onSimulateGuest: (origin: string) => void;
}

export const TELEGRAM_OFFICIAL_LINK = 'https://t.me/CPACHINES26';

export const ShareSection: React.FC<ShareSectionProps> = ({
  platformConfig,
  referralLink,
  onOpenConfigModal,
  onSimulateGuest,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);
  const [showQr, setShowQr] = useState(false);

  // Link to be shared is strictly the Telegram link
  const activeTelegramLink = TELEGRAM_OFFICIAL_LINK;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeTelegramLink);
    soundFX.playCoin();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenTelegram = () => {
    soundFX.playClick();
    window.open(activeTelegramLink, '_blank', 'noopener,noreferrer');
    onSimulateGuest('Telegram');
  };

  const handleShareTelegramDirect = () => {
    soundFX.playClick();
    const text = encodeURIComponent(
      `🔥 *CPA CHINÊS 2026* - Acesso Liberado!\n\nEntre no canal oficial do Telegram para desbloquear bônus exclusivos e resgate seus Baús VIP:\n👉 ${activeTelegramLink}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(activeTelegramLink)}&text=${text}`, '_blank');
    onSimulateGuest('Telegram');
  };

  // Pre-made high-converting scripts specifically for Telegram
  const scripts = [
    {
      title: 'Canal Oficial Telegram (Fixado / Comunicado)',
      badge: 'Canal VIP',
      content: `🔥 *CPA CHINÊS 2026 - ACESSO EXCLUSIVO LIBERADO!* 🔥\n\nEntre no canal oficial e resgate seus bônus instantâneos nos Baús de Bônus.\n\n👇 *Acesse o Telegram Oficial agora:*\n${activeTelegramLink}\n\n(Vagas VIP liberadas com prioridade de saque via PIX!)`,
    },
    {
      title: 'Mensagem para Grupos no Telegram',
      badge: 'Grupos & Chats',
      content: `⚡ *OPORTUNIDADE CPA CHINÊS 2026* ⚡\n\nLiberado o acesso oficial do CPA CHINÊS 2026 com bônus e premiações nos baús para novos membros.\n\n🔗 *Entre pelo link oficial do Telegram:* ${activeTelegramLink}`,
    },
    {
      title: 'Chamada Rápida / Direct no Telegram',
      badge: 'Mensagem Direta',
      content: `Opa! Segue o link oficial do CPA CHINÊS 2026 que você pediu para ativar seus bônus e sacar via PIX: ${activeTelegramLink}`,
    },
  ];

  const handleCopyScript = (scriptText: string, index: number) => {
    navigator.clipboard.writeText(scriptText);
    soundFX.playCoin();
    setCopiedScriptIndex(index);
    setTimeout(() => setCopiedScriptIndex(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background Telegram Ambient Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <Send className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap">
              Link de Divulgação Oficial TELEGRAM
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold font-mono">
                @CPACHINES26
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Divulgue exclusivamente através do canal oficial do Telegram para atrair membros e desbloquear seus baús de bônus!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenTelegram}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/20 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Abrir no Telegram
          </button>
        </div>
      </div>

      {/* Main Telegram Link Box */}
      <div className="mt-6 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Link Oficial de Divulgação no Telegram:
            </label>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
              Canal Verificado
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="flex-1 bg-slate-950 border border-sky-600/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-sky-300 font-mono font-bold flex items-center justify-between overflow-x-auto select-all shadow-inner">
              <span className="truncate flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400 shrink-0" />
                {activeTelegramLink}
              </span>
            </div>

            <button
              onClick={handleCopyLink}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenTelegram}
              className="px-4 py-3 rounded-2xl bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-700/60 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Abrir canal no Telegram"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Acessar</span>
            </button>

            <button
              onClick={() => setShowQr(!showQr)}
              className="px-3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Mostrar QR Code do Telegram"
            >
              <QrCode className="w-4 h-4 text-sky-400" />
              <span className="sm:hidden">QR Code</span>
            </button>
          </div>
        </div>

        {/* QR Code expansion */}
        {showQr && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center flex flex-col items-center gap-3 animate-in fade-in duration-200">
            <p className="text-xs text-slate-400">
              Escaneie com a câmera do celular para entrar diretamente no canal Telegram:
            </p>
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(activeTelegramLink)}`}
                alt="QR Code Telegram CPA CHINES 2026"
                className="w-36 h-36"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[11px] text-sky-400 font-mono font-semibold">
              {activeTelegramLink}
            </span>
          </div>
        )}

        {/* 1-Click Telegram Action Buttons */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-slate-400 block mb-2.5">
            Ações Rápidas de Divulgação no Telegram:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleShareTelegramDirect}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Compartilhar Direto no Telegram</span>
            </button>

            <button
              onClick={handleOpenTelegram}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-sky-300 border border-sky-800/60 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-sky-400" />
              <span>Entrar no Canal Oficial @CPACHINES26</span>
            </button>
          </div>
        </div>

        {/* Ready-to-use Copywriting Scripts exclusively for Telegram */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Modelos Prontos de Mensagens para Telegram (Copie e Cole)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scripts.map((script, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{script.title}</span>
                    <span className="text-[10px] text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-800/60 font-semibold">
                      {script.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-4 font-mono leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-850">
                    {script.content}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyScript(script.content, idx)}
                  className={`mt-3 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    copiedScriptIndex === idx
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700'
                  }`}
                >
                  {copiedScriptIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto Telegram</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
