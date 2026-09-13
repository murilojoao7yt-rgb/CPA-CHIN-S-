import React, { useState } from 'react';
import { X, Link2, ExternalLink, Check, Sparkles, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { PlatformConfig } from '../types';
import { soundFX } from '../utils/audio';

interface PlatformLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PlatformConfig;
  onSave: (newConfig: PlatformConfig) => void;
}

export const PlatformLinkModal: React.FC<PlatformLinkModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [targetUrl, setTargetUrl] = useState(config.targetUrl);
  const [platformName, setPlatformName] = useState(config.platformName);
  const [headline, setHeadline] = useState(config.headline);
  const [bonusAmountText, setBonusAmountText] = useState(config.bonusAmountText);
  const [welcomeMessage, setWelcomeMessage] = useState(config.welcomeMessage);
  const [autoRedirect, setAutoRedirect] = useState(config.autoRedirect);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateAndFormatUrl = (url: string): string => {
    let trimmed = url.trim();
    if (!trimmed) return '';
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = `https://${trimmed}`;
    }
    return trimmed;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formattedUrl = validateAndFormatUrl(targetUrl);
    if (!formattedUrl) {
      setError('Por favor, informe o link da plataforma que você deseja cadastrar.');
      return;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError('URL inválida. Verifique se digitou o endereço corretamente (ex: https://meusite.com/cadastro).');
      return;
    }

    const updatedConfig: PlatformConfig = {
      ...config,
      targetUrl: formattedUrl,
      platformName: platformName.trim() || 'Plataforma Oficial de Bônus',
      headline: headline.trim() || 'Cadastre-se e Ganhe Bônus Exclusivo!',
      bonusAmountText: bonusAmountText.trim() || 'Bônus de Boas-Vindas Liberado',
      welcomeMessage: welcomeMessage.trim() || 'Aproveite seu acesso exclusivo com bônus liberado.',
      autoRedirect,
      lastUpdated: new Date().toISOString(),
    };

    onSave(updatedConfig);
    soundFX.playCoin();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleTestLink = () => {
    const formatted = validateAndFormatUrl(targetUrl);
    if (formatted) {
      window.open(formatted, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Cadastrar Link da Plataforma
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Obrigatório
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Todo cliente que entrar pelo seu link de convidado será direcionado para este endereço
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Target URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Link Oficial da Plataforma (Link de Afiliado / Cadastro / Convite) *</span>
              <span className="text-[11px] text-amber-400 font-normal">O link que você mandar</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://suaplataforma.com/cadastro?ref=seu_codigo"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-slate-500 pr-24"
                required
              />
              <button
                type="button"
                onClick={handleTestLink}
                disabled={!targetUrl.trim()}
                className="absolute right-2 top-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 border border-slate-700 disabled:opacity-40 transition-colors"
                title="Testar se o link abre normalmente"
              >
                <span>Testar</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-500" />
              Insira o link completo da plataforma com seu ID de afiliado ou código de indicação.
            </p>
          </div>

          {/* Platform Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Nome de Exibição da Plataforma
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                placeholder="Ex: Plataforma VIP Bônus"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Chamada do Bônus (Destaque)
              </label>
              <input
                type="text"
                value={bonusAmountText}
                onChange={(e) => setBonusAmountText(e.target.value)}
                placeholder="Ex: Até R$ 500 de Bônus"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Headline to attract leads */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              Frase de Boas-Vindas para os Novos Clientes
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Ex: Cadastre-se e receba acesso liberado aos baús de prêmios!"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Auto Redirect Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">
                Redirecionamento Automático
              </span>
              <span className="text-[11px] text-slate-400">
                Ao abrir a página de convite, redirecionar o cliente automaticamente após 3 segundos
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoRedirect}
                onChange={(e) => setAutoRedirect(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Live Preview Box */}
          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              Como funciona o fluxo de ganhos:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
              <li>Você compartilha seu link de convidados gerado por esta ferramenta.</li>
              <li>O cliente clica, vê a página de ativação do bônus e entra no seu link cadastrado acima.</li>
              <li>A plataforma registra a entrada do cliente e desbloqueia os Baús de Bônus com dinheiro real.</li>
            </ol>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Link Salvo com Sucesso!
                </>
              ) : (
                <>
                  <span>Salvar Link da Plataforma</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
