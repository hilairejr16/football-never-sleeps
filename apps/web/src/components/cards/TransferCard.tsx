import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn, formatFee, getConfidenceLabel, formatTimeAgo } from '@/lib/utils';
import type { Transfer } from '@/lib/types';

interface TransferCardProps {
  transfer: Transfer;
  className?: string;
}

const STATUS_CONFIG = {
  rumour:    { icon: AlertCircle, color: 'text-brand-gray',  bg: 'bg-brand-muted/20' },
  confirmed: { icon: CheckCircle, color: 'text-brand-gold',  bg: 'bg-brand-gold/10' },
  completed: { icon: CheckCircle, color: 'text-live',        bg: 'bg-live/10' },
  failed:    { icon: AlertCircle, color: 'text-brand-red',   bg: 'bg-brand-red/10' },
};

export default function TransferCard({ transfer, className }: TransferCardProps) {
  const { label: confLabel, color: confColor } = getConfidenceLabel(transfer.confidence);
  const statusCfg = STATUS_CONFIG[transfer.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className={cn('gr-card p-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', statusCfg.bg, statusCfg.color)}>
          <StatusIcon className="w-3.5 h-3.5" />
          {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
        </div>
        <span className={cn('text-xs font-bold', confColor)}>{confLabel}</span>
      </div>

      {/* Player */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-border flex-shrink-0">
          <Image
            src={transfer.player.photo || '/placeholder-player.png'}
            alt={transfer.player.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <Link
            href="/players"
            className="text-white font-bold hover:text-brand-gold transition-colors"
          >
            {transfer.player.name}
          </Link>
          <div className="text-brand-gray text-xs mt-0.5">
            {transfer.player.position} · {transfer.player.nationality}
          </div>
        </div>
      </div>

      {/* Transfer Arrow */}
      <div className="flex items-center justify-between bg-brand-dark rounded-xl px-4 py-3">
        {/* From */}
        <div className="flex items-center gap-2 flex-1">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src={transfer.fromTeam.logo || '/placeholder-team.png'}
              alt={transfer.fromTeam.name}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-brand-gray text-xs font-medium truncate">
            {transfer.fromTeam.shortName}
          </span>
        </div>

        {/* Arrow + Fee */}
        <div className="flex flex-col items-center gap-1 px-2">
          <ArrowRight className="w-4 h-4 text-brand-red" />
          {transfer.fee !== undefined && (
            <span className="text-brand-gold text-xs font-bold">
              {formatFee(transfer.fee)}
            </span>
          )}
        </div>

        {/* To */}
        <div className="flex items-center gap-2 justify-end flex-1">
          <span className="text-white text-xs font-semibold truncate">
            {transfer.toTeam.shortName}
          </span>
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src={transfer.toTeam.logo || '/placeholder-team.png'}
              alt={transfer.toTeam.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 text-xs text-brand-gray">
        {transfer.date && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(transfer.date)}
          </span>
        )}
        {transfer.source && (
          <span className="italic">{transfer.source}</span>
        )}
      </div>
    </div>
  );
}
