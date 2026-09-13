export interface PlatformConfig {
  targetUrl: string;
  platformName: string;
  headline: string;
  bonusAmountText: string;
  welcomeMessage: string;
  autoRedirect: boolean;
  redirectDelaySeconds: number;
  lastUpdated: string;
}

export type ChestId = 'bronze' | 'prata' | 'ouro' | 'diamante' | 'lendario';

export interface ChestTier {
  id: ChestId;
  name: string;
  level: number;
  minGuests: number;
  rewardMin: number;
  rewardMax: number;
  unlocked: boolean;
  opened: boolean;
  earnedAmount: number | null;
  openedAt: string | null;
  accentColor: string;
  gradient: string;
  borderGlow: string;
  description: string;
  bonusPerk: string;
}

export interface GuestLead {
  id: string;
  name: string;
  avatar: string;
  origin: 'WhatsApp' | 'Telegram' | 'Instagram' | 'Facebook' | 'TikTok' | 'Link Direto';
  status: 'visitou' | 'cadastrado' | 'ativou_bonus';
  timestamp: string;
  city: string;
  rewardGenerated: number;
  isRecent?: boolean;
}

export interface WithdrawalRecord {
  id: string;
  pixKey: string;
  pixType: 'cpf' | 'email' | 'telefone' | 'aleatoria';
  amount: number;
  status: 'concluido' | 'processando';
  timestamp: string;
  txHash: string;
}

export interface GeneratedClientAccount {
  id: string;
  name: string;
  phone: string;
  password: string;
  createdAt: string;
}
