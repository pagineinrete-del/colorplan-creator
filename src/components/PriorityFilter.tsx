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
    <div className="flex items-center gap-1">
      <Button
        variant={selected === 'all' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('all')}
        className="h-7 px-2 text-xs"
      >
        All
      </Button>
      
      {priorities.map((priority) => (
        <button
          key={priority}
          onClick={() => onChange(priority)}
          className={cn(
            'h-5 w-5 rounded-full transition-all',
            colorClasses[priority],
            selected === priority && 'ring-2 ring-offset-1 ring-offset-background',
            selected === priority && priority === 'high' && 'ring-priority-high',
            selected === priority && priority === 'medium' && 'ring-priority-medium',
            selected === priority && priority === 'low' && 'ring-priority-low',
            selected === priority && priority === 'personal' && 'ring-priority-personal',
            selected === priority && priority === 'work' && 'ring-priority-work',
          )}
        />
      ))}
    </div>
  );
}
