import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Phone,
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  ClipboardCheck,
  Settings2,
  Trash2,
} from 'lucide-react';
import { PlatformConfig, GeneratedClientAccount } from '../types';
import { soundFX } from '../utils/audio';

interface ClientGeneratorPanelProps {
  platformConfig: PlatformConfig;
  onOpenConfigModal?: () => void;
}

const BRAZILIAN_FIRST_NAMES = [
  'Lucas', 'Gabriel', 'Matheus', 'Felipe', 'Rodrigo', 'Guilherme', 'Rafael', 'Bruno',
  'Gustavo', 'Leonardo', 'Thiago', 'Vinicius', 'Eduardo', 'Marcelo', 'Caio', 'Danilo',
  'Mariana', 'Camila', 'Beatriz', 'Juliana', 'Larissa', 'Bruna', 'Fernanda', 'Amanda',
  'Leticia', 'Carolina', 'Jessica', 'Natalia', 'Vanessa', 'Renata', 'Aline', 'Patricia',
];

const BRAZILIAN_LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
  'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade',
  'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos',
];

const BRAZILIAN_DDDS = ['11', '19', '21', '27', '31', '41', '48', '51', '61', '62', '71', '81', '85', '91', '98'];

const generateRandomBrazilPhone = (): string => {
  const ddd = BRAZILIAN_DDDS[Math.floor(Math.random() * BRAZILIAN_DDDS.length)];
  const part1 = `9${Math.floor(Math.random() * 9000 + 1000)}`;
  const part2 = `${Math.floor(Math.random() * 9000 + 1000)}`;
  return `(${ddd}) ${part1}-${part2}`;
};

const generateRandomName = (): string => {
  const first = BRAZILIAN_FIRST_NAMES[Math.floor(Math.random() * BRAZILIAN_FIRST_NAMES.length)];
  const last1 = BRAZILIAN_LAST_NAMES[Math.floor(Math.random() * BRAZILIAN_LAST_NAMES.length)];
  const last2 = BRAZILIAN_LAST_NAMES[Math.floor(Math.random() * BRAZILIAN_LAST_NAMES.length)];
  return Math.random() > 0.4 ? `${first} ${last1} ${last2}` : `${first} ${last1}`;
};

const DEFAULT_PRESET_PASSWORD = 'Vip@2026';

export const ClientGeneratorPanel: React.FC<ClientGeneratorPanelProps> = ({
  platformConfig,
  onOpenConfigModal,
}) => {
  // Pre-saved base password that can be configured or used directly
  const [savedPassword, setSavedPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('bonus_client_saved_password') || DEFAULT_PRESET_PASSWORD;
    } catch {
      return DEFAULT_PRESET_PASSWORD;
    }
  });

  // Current displayed client
  const [currentAccount, setCurrentAccount] = useState<GeneratedClientAccount>(() => {
    return {
      id: `acc-${Date.now()}`,
      name: 'Gabriel Silva Santos',
      phone: '(11) 98412-5530',
      password: DEFAULT_PRESET_PASSWORD,
      createdAt: 'Agora mesmo',
    };
  });

  // History of generated accounts
  const [accountHistory, setAccountHistory] = useState<GeneratedClientAccount[]>(() => {
    try {
      const saved = localStorage.getItem('bonus_generated_accounts_log');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI helpers
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState(savedPassword);
  const [showHistory, setShowHistory] = useState(false);

  // Sync saved password to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bonus_client_saved_password', savedPassword);
    } catch (e) {
      console.warn(e);
    }
  }, [savedPassword]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bonus_generated_accounts_log', JSON.stringify(accountHistory.slice(0, 20)));
    } catch (e) {
      console.warn(e);
    }
  }, [accountHistory]);

  const handleGenerateNew = () => {
    soundFX.playCoin();
    const newAccount: GeneratedClientAccount = {
      id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: generateRandomName(),
      phone: generateRandomBrazilPhone(),
      password: savedPassword,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentAccount(newAccount);
    setAccountHistory((prev) => [newAccount, ...prev.slice(0, 19)]);
  };

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    soundFX.playClick();
    setCopiedField(fieldKey);
    setTimeout(() => {
      setCopiedField((curr) => (curr === fieldKey ? null : curr));
    }, 2000);
  };

  const handleCopyAll = () => {
    const fullText = `Nome: ${currentAccount.name}\nTelefone: ${currentAccount.phone}\nSenha: ${currentAccount.password}\nPlataforma: ${platformConfig.targetUrl}`;
    handleCopy(fullText, 'all');
  };

  const handleSavePasswordChange = () => {
    if (!tempPassword.trim()) return;
    setSavedPassword(tempPassword.trim());
    setCurrentAccount((prev) => ({ ...prev, password: tempPassword.trim() }));
    setIsEditingPassword(false);
    soundFX.playClick();
  };

  const handleClearHistory = () => {
    setAccountHistory([]);
    soundFX.playClick();
  };

  return (
    <div className="relative rounded-3xl bg-slate-900/95 border border-slate-800 p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              Gerador de Acesso do Cliente
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                Brasil +55
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Nome + Telefone BR + Senha salva para entrar no link cadastrado
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleGenerateNew}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            title="Gerar novos dados de cliente"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gerar Novo</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={`p-1.5 rounded-lg text-xs border transition-colors ${
              showHistory
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Ver histórico de cadastros gerados"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: 3 Fields (Nome, Telefone, Senha) */}
      <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        
        {/* Field 1: Nome do Cliente */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <UserCheck className="w-3 h-3 text-cyan-400" />
              Nome do Cliente
            </span>
            <span className="text-[10px] text-slate-500 font-mono">BR</span>
          </div>

          <div className="flex items-center justify-between gap-1.5">
            <span className="text-xs font-bold text-white truncate select-all">
              {currentAccount.name}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(currentAccount.name, 'name')}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title="Copiar Nome"
            >
              {copiedField === 'name' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Field 2: Telefone Brasil (+55) */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <Phone className="w-3 h-3 text-emerald-400" />
              Telefone Brasil
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">+55</span>
          </div>

          <div className="flex items-center justify-between gap-1.5">
            <span className="text-xs font-mono font-bold text-white tracking-wide truncate select-all">
              {currentAccount.phone}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(currentAccount.phone, 'phone')}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title="Copiar Telefone"
            >
              {copiedField === 'phone' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Field 3: Senha já Salva */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <KeyRound className="w-3 h-3 text-amber-400" />
              Senha Salva Padrão
            </span>
            <button
              type="button"
              onClick={() => setIsEditingPassword(!isEditingPassword)}
              className="text-[10px] text-slate-500 hover:text-amber-300 flex items-center gap-0.5"
              title="Personalizar senha padrão salva"
            >
              <Settings2 className="w-2.5 h-2.5" />
              {isEditingPassword ? 'Fechar' : 'Editar'}
            </button>
          </div>

          {isEditingPassword ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                className="w-full px-2 py-0.5 bg-slate-900 border border-amber-500/50 rounded text-xs text-white font-mono focus:outline-none"
                placeholder="Nova senha"
              />
              <button
                type="button"
                onClick={handleSavePasswordChange}
                className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded"
              >
                Salvar
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-mono font-bold text-amber-300 truncate select-all">
                {showPassword ? currentAccount.password : '••••••••'}
              </span>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-300"
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(currentAccount.password, 'password')}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Copiar Senha"
                >
                  {copiedField === 'password' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Action Bar: Direct Link to Platform + Copy All Credentials */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyAll}
            className={`w-full sm:w-auto px-3 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
              copiedField === 'all'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
            }`}
          >
            {copiedField === 'all' ? (
              <>
                <ClipboardCheck className="w-3.5 h-3.5 text-white" />
                <span>Dados Copiados com Sucesso!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copiar Nome + Telefone + Senha</span>
              </>
            )}
          </button>
        </div>

        {/* Enter Platform Link */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <a
            href={platformConfig.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer truncate max-w-full"
            title={`Abrir ${platformConfig.targetUrl} em nova aba para colar dados`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="truncate">Entrar na Plataforma Cadastrada</span>
          </a>
        </div>
      </div>

      {/* Collapsible History of Generated Logins */}
      {showHistory && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Últimos Acessos Gerados ({accountHistory.length})
            </span>
            {accountHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-[10px] text-slate-500 hover:text-rose-400 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Limpar Histórico
              </button>
            )}
          </div>

          {accountHistory.length === 0 ? (
            <p className="text-[11px] text-slate-500 py-1 italic">
              Clique em &quot;Gerar Novo&quot; para registrar novos acessos de clientes.
            </p>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-850">
              {accountHistory.map((acc) => (
                <div
                  key={acc.id}
                  className="pt-1.5 first:pt-0 flex items-center justify-between text-[11px] text-slate-300"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-semibold text-white truncate">{acc.name}</span>
                    <span className="font-mono text-emerald-400 shrink-0">{acc.phone}</span>
                    <span className="font-mono text-amber-400 shrink-0">Senha: {acc.password}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const text = `Nome: ${acc.name}\nTelefone: ${acc.phone}\nSenha: ${acc.password}`;
                      handleCopy(text, acc.id);
                    }}
                    className="p-1 text-slate-400 hover:text-white shrink-0"
                    title="Copiar dados deste cliente"
                  >
                    {copiedField === acc.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
