import { Priority, priorityConfig } from '@/types/appointment';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PriorityFilterProps {
  selected: Priority | 'all';
  onChange: (priority: Priority | 'all') => void;
}

export function PriorityFilter({ selected, onChange }: PriorityFilterProps) {
  const priorities = Object.keys(priorityConfig) as Priority[];

  const colorClasses: Record<Priority, string> = {
    high: 'bg-priority-high',
    medium: 'bg-priority-medium',
    low: 'bg-priority-low',
    personal: 'bg-priority-personal',
    work: 'bg-priority-work',
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('all')}
        className="h-8"
      >
        Tutti
      </Button>
      
      {priorities.map((priority) => (
        <Button
          key={priority}
          variant={selected === priority ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(priority)}
          className={cn(
            'h-8 gap-2',
            selected === priority && 'ring-2 ring-offset-2',
            selected === priority && priority === 'high' && 'bg-priority-high hover:bg-priority-high/90 ring-priority-high',
            selected === priority && priority === 'medium' && 'bg-priority-medium hover:bg-priority-medium/90 ring-priority-medium',
            selected === priority && priority === 'low' && 'bg-priority-low hover:bg-priority-low/90 ring-priority-low',
            selected === priority && priority === 'personal' && 'bg-priority-personal hover:bg-priority-personal/90 ring-priority-personal',
            selected === priority && priority === 'work' && 'bg-priority-work hover:bg-priority-work/90 ring-priority-work',
          )}
        >
          <div className={cn(
            'h-2.5 w-2.5 rounded-full',
            selected !== priority && colorClasses[priority],
            selected === priority && 'bg-white'
          )} />
          <span className="hidden sm:inline">{priorityConfig[priority].label}</span>
        </Button>
      ))}
    </div>
  );
}
