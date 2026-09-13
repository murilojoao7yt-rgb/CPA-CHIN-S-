/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Link2,
  Users,
  Gift,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Eye,
  Wallet,
  CheckCircle2,
  Share2,
  Flame,
  HelpCircle,
  X,
  Zap,
  RotateCcw,
} from 'lucide-react';
import {
  PlatformConfig,
  ChestTier,
  GuestLead,
  WithdrawalRecord,
} from './types';
import {
  DEFAULT_PLATFORM_CONFIG,
  INITIAL_CHEST_TIERS,
  INITIAL_LEADS,
  SAMPLE_NAMES,
  SAMPLE_CITIES,
  SAMPLE_ORIGINS,
} from './utils/initialData';
import { soundFX } from './utils/audio';
import { Header } from './components/Header';
import { PlatformLinkModal } from './components/PlatformLinkModal';
import { ChestCard } from './components/ChestCard';
import { ChestOpenModal } from './components/ChestOpenModal';
import { ShareSection } from './components/ShareSection';
import { ClientsFeed } from './components/ClientsFeed';
import { GuestLandingView } from './components/GuestLandingView';
import { WithdrawModal } from './components/WithdrawModal';
import { ClientGeneratorPanel } from './components/ClientGeneratorPanel';
import { AutoChestControls } from './components/AutoChestControls';
import { AutoTrafficPanel, TrafficSpeed } from './components/AutoTrafficPanel';

export default function App() {
  // 1. Persistent Platform Link Configuration
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(() => {
    try {
      const saved = localStorage.getItem('bonus_platform_config');
      if (!saved) return DEFAULT_PLATFORM_CONFIG;
      const parsed = JSON.parse(saved);
      if (
        !parsed.platformName ||
        parsed.platformName === 'Plataforma Oficial de Prêmios & Bônus' ||
        parsed.platformName === 'Plataforma de Clientes e Baús de Bônus'
      ) {
        parsed.platformName = 'CPA CHINÊS 2026';
      }
      if (
        !parsed.targetUrl ||
        parsed.targetUrl.includes('suaplataforma.com') ||
        parsed.targetUrl.includes('plataforma.com')
      ) {
        parsed.targetUrl = 'https://t.me/CPACHINES26';
      }
      return parsed;
    } catch {
      return DEFAULT_PLATFORM_CONFIG;
    }
  });

  // 2. Persistent Chest Tiers
  const [chests, setChests] = useState<ChestTier[]>(() => {
    try {
      const saved = localStorage.getItem('bonus_platform_chests');
      return saved ? JSON.parse(saved) : INITIAL_CHEST_TIERS;
    } catch {
      return INITIAL_CHEST_TIERS;
    }
  });

  // 3. Persistent Guest Leads
  const [leads, setLeads] = useState<GuestLead[]>(() => {
    try {
      const saved = localStorage.getItem('bonus_platform_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  // 4. Persistent Withdrawals
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    try {
      const saved = localStorage.getItem('bonus_platform_withdrawals');
      if (!saved) return [];
      const parsed: WithdrawalRecord[] = JSON.parse(saved);
      // Deduplicate by ID in case previous session had duplicates
      const seen = new Set<string>();
      const sanitized: WithdrawalRecord[] = [];
      for (const item of parsed) {
        if (!item.id || seen.has(item.id)) {
          sanitized.push({
            ...item,
            id: `saque-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          });
        } else {
          seen.add(item.id);
          sanitized.push(item);
        }
      }
      return sanitized;
    } catch {
      return [];
    }
  });

  // UI States
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeChestToOpen, setActiveChestToOpen] = useState<ChestTier | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  
  // Auto Traffic Engine State
  const [isAutoTrafficRunning, setIsAutoTrafficRunning] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bonus_auto_traffic_running');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [trafficSpeed, setTrafficSpeed] = useState<TrafficSpeed>(() => {
    try {
      const saved = localStorage.getItem('bonus_traffic_speed') as TrafficSpeed;
      return saved || 'normal';
    } catch {
      return 'normal';
    }
  });

  const [sessionTrafficCount, setSessionTrafficCount] = useState(0);

  // Auto Chest Feature: Auto Open & Auto Cycle Renewal
  const [autoChestEnabled, setAutoChestEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bonus_auto_chest_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [chestCycle, setChestCycle] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bonus_chest_cycle');
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  const [previousCyclesEarnings, setPreviousCyclesEarnings] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bonus_previous_cycles_earnings');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [cycleStartGuests, setCycleStartGuests] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('bonus_cycle_start_guests');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [autoToast, setAutoToast] = useState<{
    id: string;
    message: string;
    submessage?: string;
    amount?: number;
  } | null>(null);

  // Check if opened with ?ref= or preview
  const [isPreviewMode, setIsPreviewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.has('ref') || params.has('convite');
    }
    return false;
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('bonus_platform_config', JSON.stringify(platformConfig));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [platformConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('bonus_platform_chests', JSON.stringify(chests));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [chests]);

  useEffect(() => {
    try {
      localStorage.setItem('bonus_platform_leads', JSON.stringify(leads));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('bonus_platform_withdrawals', JSON.stringify(withdrawals));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [withdrawals]);

  useEffect(() => {
    try {
      localStorage.setItem('bonus_auto_chest_enabled', JSON.stringify(autoChestEnabled));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [autoChestEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('bonus_chest_cycle', chestCycle.toString());
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [chestCycle]);

  useEffect(() => {
    try {
      localStorage.setItem('bonus_previous_cycles_earnings', previousCyclesEarnings.toString());
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [previousCyclesEarnings]);

  useEffect(() => {
    try {
      localStorage.setItem('bonus_cycle_start_guests', cycleStartGuests.toString());
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [cycleStartGuests]);

  useEffect(() => {
    try {
      localStorage.setItem('bonus_auto_traffic_running', JSON.stringify(isAutoTrafficRunning));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [isAutoTrafficRunning]);

  useEffect(() => {
    try {
      localStorage.setItem('bonus_traffic_speed', trafficSpeed);
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [trafficSpeed]);

  // Derived Metrics (persisting all-time earnings across cycles)
  const totalGuests = leads.length;

  // Total new guests counted towards unlocking chests in the active cycle
  const cycleGuests = Math.max(0, totalGuests - cycleStartGuests);

  const totalChestEarnings = useMemo(() => {
    const currentChestsEarned = chests.reduce((acc, c) => acc + (c.earnedAmount || 0), 0);
    const totalEarnedAllTime = previousCyclesEarnings + currentChestsEarned;
    const withdrawn = withdrawals.reduce((acc, w) => acc + w.amount, 0);
    return Math.max(0, totalEarnedAllTime - withdrawn);
  }, [chests, previousCyclesEarnings, withdrawals]);

  const allTimeChestEarnings = useMemo(() => {
    const currentChestsEarned = chests.reduce((acc, c) => acc + (c.earnedAmount || 0), 0);
    return previousCyclesEarnings + currentChestsEarned;
  }, [chests, previousCyclesEarnings]);

  const availableKeys = useMemo(() => {
    // 1 key for every 3 guests
    return Math.floor(totalGuests / 3);
  }, [totalGuests]);

  const readyToOpenCount = useMemo(() => {
    return chests.filter((c) => cycleGuests >= c.minGuests && !c.opened).length;
  }, [chests, cycleGuests]);

  // Referral link to share (exclusivo Telegram)
  const referralLink = 'https://t.me/CPACHINES26';

  // Helper to add a lead and trigger notifications
  const addLead = useCallback((customName?: string, origin: GuestLead['origin'] = 'WhatsApp') => {
    const randomName = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
    const randomCity = SAMPLE_CITIES[Math.floor(Math.random() * SAMPLE_CITIES.length)];
    const name = customName || randomName;

    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    ];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    const statuses: GuestLead['status'][] = ['ativou_bonus', 'cadastrado', 'visitou'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const newLead: GuestLead = {
      id: `lead-${Date.now()}-${Math.random()}`,
      name,
      avatar,
      origin,
      status,
      timestamp: 'Agora mesmo',
      city: randomCity,
      rewardGenerated: Math.floor(Math.random() * 20) + 5,
      isRecent: true,
    };

    setLeads((prev) => [newLead, ...prev.slice(0, 49)]);
    soundFX.playUnlock();
  }, []);

  // Batch inject clients
  const handleInjectTrafficBatch = (count: number) => {
    soundFX.playCoin();
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const isTelegram = Math.random() < 0.85;
        const origin = isTelegram ? 'Telegram' : 'Link Direto';
        addLead(undefined, origin);
        setSessionTrafficCount((prev) => prev + 1);
      }, i * 90);
    }
  };

  // Batch generate 5 clients (used by ClientsFeed)
  const handleGenerateBatch = () => {
    handleInjectTrafficBatch(5);
  };

  // Automated background traffic loop with speed control
  useEffect(() => {
    if (!isAutoTrafficRunning) return;

    const delayMs =
      trafficSpeed === 'turbo' ? 800 : trafficSpeed === 'fast' ? 1500 : 3000;

    const interval = setInterval(() => {
      // 85% Telegram origin matching the platform's official channel link
      const isTelegram = Math.random() < 0.85;
      const origin = isTelegram ? 'Telegram' : 'Link Direto';
      addLead(undefined, origin);
      setSessionTrafficCount((prev) => prev + 1);
    }, delayMs);

    return () => clearInterval(interval);
  }, [isAutoTrafficRunning, trafficSpeed, addLead]);

  // Open chest reward confirmation
  const handleConfirmChestReward = (tierId: string, amount: number) => {
    setChests((prev) =>
      prev.map((chest) => {
        if (chest.id === tierId) {
          return {
            ...chest,
            opened: true,
            earnedAmount: amount,
            openedAt: new Date().toLocaleDateString('pt-BR'),
          };
        }
        return chest;
      })
    );
  };

  // Refresh & cycle chests (manual or automatic)
  const handleRefreshChests = useCallback((isAutomatic = false) => {
    setChests((currentChests) => {
      const currentEarned = currentChests.reduce((acc, c) => acc + (c.earnedAmount || 0), 0);
      setPreviousCyclesEarnings((prev) => prev + currentEarned);
      setCycleStartGuests(leads.length);

      const nextCycle = chestCycle + 1;
      setChestCycle(nextCycle);

      const multiplier = 1 + (nextCycle - 1) * 0.2;
      const freshChests = INITIAL_CHEST_TIERS.map((tier) => ({
        ...tier,
        rewardMin: Math.round(tier.rewardMin * multiplier),
        rewardMax: Math.round(tier.rewardMax * multiplier),
        unlocked: false,
        opened: false,
        earnedAmount: null,
        openedAt: null,
      }));

      soundFX.playChestOpen();
      soundFX.playCoin();

      setAutoToast({
        id: `refresh-${Date.now()}`,
        message: isAutomatic
          ? `⚡ Ciclo #${nextCycle} Atualizado Automaticamente!`
          : `🔄 Novos Baús do Ciclo #${nextCycle} Iniciados!`,
        submessage: 'Saldo anterior preservado e novas recompensas liberadas.',
      });

      return freshChests;
    });
  }, [chestCycle, leads.length]);

  // Auto-open ready chests when autoChestEnabled is active
  useEffect(() => {
    if (!autoChestEnabled) return;

    const readyChest = chests.find((c) => cycleGuests >= c.minGuests && !c.opened);
    if (!readyChest) return;

    const timer = setTimeout(() => {
      const reward =
        Math.floor(Math.random() * (readyChest.rewardMax - readyChest.rewardMin + 1)) +
        readyChest.rewardMin;

      soundFX.playChestOpen();
      setTimeout(() => soundFX.playCoin(), 300);

      setChests((prev) =>
        prev.map((c) =>
          c.id === readyChest.id
            ? {
                ...c,
                opened: true,
                earnedAmount: reward,
                openedAt: new Date().toLocaleDateString('pt-BR'),
              }
            : c
        )
      );

      setAutoToast({
        id: `auto-${readyChest.id}-${Date.now()}`,
        message: `🎉 ${readyChest.name} Aberto Automaticamente!`,
        submessage: `Meta de ${readyChest.minGuests} clientes atingida`,
        amount: reward,
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [autoChestEnabled, chests, cycleGuests]);

  // Automatically renew chests to the next cycle when all 5 are opened
  useEffect(() => {
    if (!autoChestEnabled) return;

    const allOpened = chests.length > 0 && chests.every((c) => c.opened);
    if (!allOpened) return;

    const timer = setTimeout(() => {
      handleRefreshChests(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [autoChestEnabled, chests, handleRefreshChests]);

  // Auto-dismiss notification toasts
  useEffect(() => {
    if (!autoToast) return;
    const timer = setTimeout(() => {
      setAutoToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [autoToast]);

  // Withdraw PIX submission
  const handleWithdraw = useCallback((record: WithdrawalRecord) => {
    setWithdrawals((prev) => {
      if (prev.some((w) => w.id === record.id)) return prev;
      return [record, ...prev];
    });
  }, []);

  // If viewing the guest landing view
  if (isPreviewMode) {
    return (
      <GuestLandingView
        platformConfig={platformConfig}
        onClientEnter={(guestName) => {
          addLead(guestName, 'Link Direto');
        }}
        onBackToDashboard={() => setIsPreviewMode(false)}
      />
    );
  }

  const isDefaultLink = platformConfig.targetUrl.includes('suaplataforma.com');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navigation Header */}
      <Header
        platformConfig={platformConfig}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onToggleGuestPreview={() => setIsPreviewMode(true)}
        onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
        totalEarnings={totalChestEarnings}
        totalGuests={totalGuests}
        availableKeys={availableKeys}
        isPreviewMode={isPreviewMode}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Urgent Callout: Configure Target Link if still default */}
        {isDefaultLink && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Cadastre o link da plataforma que você quer divulgar!
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Para que os novos clientes entrem no seu link de indicação correto, cadastre o link oficial da sua plataforma agora.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 shrink-0 cursor-pointer"
            >
              <Link2 className="w-4 h-4" />
              Cadastrar Meu Link Agora
            </button>
          </div>
        )}

        {/* Hero Banner: Sistema de Baús de Bônus & Status */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/15 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Sistema de Geração de Clientes & Baús
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Gere Clientes para a Plataforma e Desbloqueie Baús de Bônus
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Compartilhe o link de convite oficial. Cada visitante que entra é encaminhado para a sua plataforma cadastrada (<span className="text-amber-300 font-semibold">{platformConfig.platformName}</span>), acumulando pontos e dinheiro direto nos baús de recompensas!
              </p>
            </div>

            {/* Quick Hero Cards */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[140px]">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                  Baús Prontos
                </span>
                <span className={`text-2xl sm:text-3xl font-black font-mono block mt-1 ${readyToOpenCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
                  {readyToOpenCount}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {readyToOpenCount > 0 ? 'Abra para resgatar!' : 'Atinja a meta de clientes'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[140px]">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                  Total já Ganho
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block mt-1">
                  R$ {allTimeChestEarnings.toFixed(0)}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Em {chests.filter((c) => c.opened).length} baú(s) resgatado(s)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Painel Pequeno: Gerador de Acesso do Cliente (Nome + Telefone BR + Senha Salva) */}
        <section>
          <ClientGeneratorPanel
            platformConfig={platformConfig}
            onOpenConfigModal={() => setIsConfigModalOpen(true)}
          />
        </section>

        {/* Section: Baús de Bônus (Interactive Chests) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Baús de Bônus por Convidados
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Quanto mais clientes entrarem pelo seu link, maiores as premiações em dinheiro que você destranca nos baús
              </p>
            </div>

            {readyToOpenCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-bounce self-start sm:self-auto">
                <Sparkles className="w-3.5 h-3.5" />
                {readyToOpenCount} Baú{readyToOpenCount > 1 ? 's' : ''} liberado{readyToOpenCount > 1 ? 's' : ''} para abrir!
              </span>
            )}
          </div>

          {/* Auto Chest Controls & Cycle Manager */}
          <AutoChestControls
            autoChestEnabled={autoChestEnabled}
            onToggleAutoChest={() => setAutoChestEnabled(!autoChestEnabled)}
            cycle={chestCycle}
            onManualRefreshChests={() => handleRefreshChests(false)}
            chests={chests}
            totalGuests={cycleGuests}
            readyToOpenCount={readyToOpenCount}
          />

          {/* 5 Chest Tier Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {chests.map((tier) => (
              <ChestCard
                key={tier.id}
                tier={tier}
                totalGuests={cycleGuests}
                onOpenChest={(selectedTier) => setActiveChestToOpen(selectedTier)}
              />
            ))}
          </div>

          {/* Dedicated PIX Withdrawal Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Saque Imediato de Ganhos via PIX
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                    Taxa Bancária: R$ 50,00
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Saldo disponível para retirada: <strong className="text-emerald-400 font-mono">R$ {totalChestEarnings.toFixed(2).replace('.', ',')}</strong>. Pagamento da taxa via PIX oficial para liberação imediata.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                disabled={totalChestEarnings <= 0}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Solicitar Saque PIX</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Recent Withdrawals History if any */}
          {withdrawals.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Histórico de Saques PIX Solicitados
                </span>
                <span className="text-slate-500 font-mono">{withdrawals.length} saque(s)</span>
              </div>
              <div className="divide-y divide-slate-800/80">
                {withdrawals.map((w, index) => (
                  <div key={`${w.id}-${index}`} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-mono text-slate-300">{w.pixKey}</span>
                      <span className="text-slate-500">({w.timestamp})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-400">
                        + R$ {w.amount.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Taxa R$ 50 Paga • Concluído
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Section: Central de Compartilhamento & Convidados */}
        <section>
          <ShareSection
            platformConfig={platformConfig}
            referralLink={referralLink}
            onOpenConfigModal={() => setIsConfigModalOpen(true)}
            onSimulateGuest={(origin) => addLead(undefined, origin as GuestLead['origin'])}
          />
        </section>

        {/* Section: Painel de Controle de Tráfego Automático */}
        <section>
          <AutoTrafficPanel
            isRunning={isAutoTrafficRunning}
            onToggleRunning={() => {
              soundFX.playClick();
              setIsAutoTrafficRunning(!isAutoTrafficRunning);
            }}
            speed={trafficSpeed}
            onChangeSpeed={(newSpeed) => setTrafficSpeed(newSpeed)}
            onInjectBatch={handleInjectTrafficBatch}
            totalGenerated={totalGuests}
            sessionGenerated={sessionTrafficCount}
          />
        </section>

        {/* Section: Live Incoming Clients Feed */}
        <section>
          <ClientsFeed
            leads={leads}
            onGenerateBatch={handleGenerateBatch}
            isAutoTrafficRunning={isAutoTrafficRunning}
            onToggleAutoTraffic={() => {
              soundFX.playClick();
              setIsAutoTrafficRunning(!isAutoTrafficRunning);
            }}
            totalGuests={totalGuests}
          />
        </section>

        {/* How It Works & Transparency Information */}
        <section className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Como funciona a geração de clientes e o ganho dos baús?
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="font-bold text-amber-400 block mb-1">1. Cadastre o Link</span>
              Você cadastra o link oficial da plataforma que você quiser (seu link de afiliado, cadastro ou indicação).
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="font-bold text-amber-400 block mb-1">2. Divulgue o Convite</span>
              A plataforma gera uma página de captura irresistível com bônus e contagem regressiva para atrair clientes.
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="font-bold text-amber-400 block mb-1">3. Ganhe nos Baús</span>
              Cada cliente que entra pela página abre os baús de bônus progressivos com recompensas em dinheiro real no PIX!
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            CPA CHINÊS 2026 • Conectada a {platformConfig.platformName}
          </span>
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
          >
            Cadastrar ou Alterar Link da Plataforma
          </button>
        </div>
      </footer>

      {/* Modals */}
      <PlatformLinkModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={platformConfig}
        onSave={(newConfig) => setPlatformConfig(newConfig)}
      />

      <ChestOpenModal
        isOpen={Boolean(activeChestToOpen)}
        tier={activeChestToOpen}
        onClose={() => setActiveChestToOpen(null)}
        onConfirmReward={handleConfirmChestReward}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        balance={totalChestEarnings}
        onWithdraw={handleWithdraw}
      />

      {/* Floating Auto-Chest & Update Notification Toast */}
      {autoToast && (
        <aside
          aria-live="polite"
          aria-atomic="true"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border-2 border-amber-500/80 shadow-2xl shadow-amber-500/20 text-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                  {autoToast.message}
                </h4>
                {autoToast.submessage && (
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {autoToast.submessage}
                  </p>
                )}
                {typeof autoToast.amount === 'number' && (
                  <div className="mt-1.5 font-mono font-black text-emerald-400 text-sm">
                    + R$ {autoToast.amount.toFixed(2).replace('.', ',')} creditado no saldo!
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

    </div>
  );
}
