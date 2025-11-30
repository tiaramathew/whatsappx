import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'connecting' | 'open' | 'close';
  showText?: boolean;
  className?: string;
}

const statusConfig = {
  connected: {
    label: 'Connected',
    color: 'bg-green-500',
    pulse: true,
  },
  open: {
    label: 'Connected',
    color: 'bg-green-500',
    pulse: true,
  },
  disconnected: {
    label: 'Disconnected',
    color: 'bg-red-500',
    pulse: false,
  },
  close: {
    label: 'Disconnected',
    color: 'bg-red-500',
    pulse: false,
  },
  connecting: {
    label: 'Connecting',
    color: 'bg-yellow-500',
    pulse: true,
  },
};

export function StatusIndicator({ status, showText = false, className }: StatusIndicatorProps) {
  const config = statusConfig[status] || statusConfig.disconnected;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className={cn('h-2 w-2 rounded-full', config.color)} />
        {config.pulse && (
          <div className={cn('absolute inset-0 h-2 w-2 rounded-full animate-ping opacity-75', config.color)} />
        )}
      </div>
      {showText && <span className="text-sm text-muted-foreground">{config.label}</span>}
    </div>
  );
}
