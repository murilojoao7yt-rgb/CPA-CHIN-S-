import React from 'react';
import { ChestTier } from '../types';

interface ChestVisualProps {
  tier: ChestTier;
  isOpen?: boolean;
  isUnlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ChestVisual: React.FC<ChestVisualProps> = ({
  tier,
  isOpen = false,
  isUnlocked = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
  }[size];

  // Palette based on chest tier
  const colorMap: Record<string, { wood: string; metal: string; glow: string; jewel: string }> = {
    bronze: {
      wood: '#78350f',
      metal: '#d97706',
      glow: '#b45309',
      jewel: '#f59e0b',
    },
    prata: {
      wood: '#334155',
      metal: '#94a3b8',
      glow: '#cbd5e1',
      jewel: '#38bdf8',
    },
    ouro: {
      wood: '#854d0e',
      metal: '#eab308',
      glow: '#fde047',
      jewel: '#ef4444',
    },
    diamante: {
      wood: '#0369a1',
      metal: '#38bdf8',
      glow: '#7dd3fc',
      jewel: '#a855f7',
    },
    lendario: {
      wood: '#581c87',
      metal: '#c084fc',
      glow: '#e879f9',
      jewel: '#ec4899',
    },
  };

  const colors = colorMap[tier.id] || colorMap.ouro;

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses} select-none`}>
      {/* Radiant glow behind if unlocked and ready */}
      {isUnlocked && !isOpen && (
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-25 filter blur-sm"
          style={{ backgroundColor: colors.metal }}
        />
      )}

      {isOpen && (
        <div
          className="absolute -top-4 inset-x-0 h-16 bg-gradient-to-t from-yellow-500/30 to-transparent blur-md pointer-events-none"
        />
      )}

      {/* Chest SVG Art */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xl transition-transform duration-300 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`glow-${tier.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`woodGrad-${tier.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.wood} />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id={`metalGrad-${tier.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.glow} />
            <stop offset="50%" stopColor={colors.metal} />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Base chest body */}
        <rect
          x="15"
          y="48"
          width="70"
          height="40"
          rx="6"
          fill={`url(#woodGrad-${tier.id})`}
          stroke={colors.metal}
          strokeWidth="2.5"
        />

        {/* Metal reinforcing bands on base */}
        <rect x="25" y="48" width="8" height="40" fill={`url(#metalGrad-${tier.id})`} />
        <rect x="67" y="48" width="8" height="40" fill={`url(#metalGrad-${tier.id})`} />
        <rect x="15" y="80" width="70" height="8" rx="2" fill={`url(#metalGrad-${tier.id})`} opacity="0.6" />

        {/* Chest Lid - Closed or Open */}
        {!isOpen ? (
          <>
            {/* Closed Lid */}
            <path
              d="M12 48 C12 28, 88 28, 88 48 Z"
              fill={`url(#woodGrad-${tier.id})`}
              stroke={colors.metal}
              strokeWidth="2.5"
            />
            {/* Lid Straps */}
            <path d="M25 48 C25 32, 33 32, 33 48 Z" fill={`url(#metalGrad-${tier.id})`} />
            <path d="M67 48 C67 32, 75 32, 75 48 Z" fill={`url(#metalGrad-${tier.id})`} />

            {/* Lock clasp in center */}
            <rect
              x="43"
              y="42"
              width="14"
              height="16"
              rx="3"
              fill={`url(#metalGrad-${tier.id})`}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Keyhole or Jewel */}
            {isUnlocked ? (
              <circle cx="50" cy="50" r="3" fill={colors.jewel} className="animate-pulse" />
            ) : (
              <circle cx="50" cy="50" r="2.5" fill="#0f172a" />
            )}
          </>
        ) : (
          <>
            {/* Open Lid tilted backwards */}
            <path
              d="M14 44 C14 18, 86 18, 86 44"
              fill="none"
              stroke={colors.metal}
              strokeWidth="3"
            />
            <path
              d="M18 42 C18 20, 82 20, 82 42 Z"
              fill={`url(#woodGrad-${tier.id})`}
              opacity="0.9"
            />

            {/* Spilling Coins & Sparkles */}
            <circle cx="35" cy="46" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="48" cy="43" r="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="62" cy="45" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="42" cy="40" r="4.5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="55" cy="38" r="4.5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />

            {/* Radiant Jewel in center */}
            <polygon
              points="50,30 55,36 50,42 45,36"
              fill={colors.jewel}
              filter="drop-shadow(0 0 4px #fff)"
            />
          </>
        )}
      </svg>
    </div>
  );
};
