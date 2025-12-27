import { Priority, priorityConfig } from '@/types/appointment';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function PriorityBadge({ 
  priority, 
  size = 'md', 
  showLabel = false,
  className 
}: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div 
        className={cn(
          'rounded-full flex-shrink-0',
          sizeClasses[size],
          `bg-${config.color}`
        )} 
      />
      {showLabel && (
        <span className="text-sm text-muted-foreground">{config.label}</span>
      )}
    </div>
  );
}

interface PriorityDotProps {
  priority: Priority;
  className?: string;
}

export function PriorityDot({ priority, className }: PriorityDotProps) {
  const colorClasses: Record<Priority, string> = {
    high: 'bg-priority-high',
    medium: 'bg-priority-medium',
    low: 'bg-priority-low',
    personal: 'bg-priority-personal',
    work: 'bg-priority-work',
  };

  return (
    <div 
      className={cn(
        'h-2.5 w-2.5 rounded-full flex-shrink-0',
        colorClasses[priority],
        className
      )} 
    />
  );
}
