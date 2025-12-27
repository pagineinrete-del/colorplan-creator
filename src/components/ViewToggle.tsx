import { ViewType } from '@/types/appointment';
import { Button } from '@/components/ui/button';
import { CalendarDays, CalendarRange, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  selected: ViewType;
  onChange: (view: ViewType) => void;
}

export function ViewToggle({ selected, onChange }: ViewToggleProps) {
  const views: { value: ViewType; label: string; icon: React.ReactNode }[] = [
    { value: 'day', label: 'Oggi', icon: <CalendarDays className="h-4 w-4" /> },
    { value: 'week', label: 'Settimana', icon: <CalendarRange className="h-4 w-4" /> },
    { value: 'month', label: 'Mese', icon: <Calendar className="h-4 w-4" /> },
  ];

  return (
    <div className="inline-flex rounded-lg border bg-card p-1 shadow-sm">
      {views.map((view) => (
        <Button
          key={view.value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(view.value)}
          className={cn(
            'h-8 px-3 gap-2 rounded-md transition-all',
            selected === view.value && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
          )}
        >
          {view.icon}
          <span className="hidden sm:inline">{view.label}</span>
        </Button>
      ))}
    </div>
  );
}
