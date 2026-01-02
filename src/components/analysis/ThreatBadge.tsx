import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Shield } from 'lucide-react';

interface ThreatBadgeProps {
  level: 'clean' | 'low' | 'medium' | 'high' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const threatConfig = {
  clean: {
    label: 'Clean',
    icon: CheckCircle,
    className: 'threat-clean',
  },
  low: {
    label: 'Low Risk',
    icon: Shield,
    className: 'threat-low',
  },
  medium: {
    label: 'Medium Risk',
    icon: AlertCircle,
    className: 'threat-medium',
  },
  high: {
    label: 'High Risk',
    icon: AlertTriangle,
    className: 'threat-high',
  },
  critical: {
    label: 'Critical',
    icon: XCircle,
    className: 'threat-critical',
  },
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function ThreatBadge({ level, size = 'md', showIcon = true }: ThreatBadgeProps) {
  const config = threatConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        config.className,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}