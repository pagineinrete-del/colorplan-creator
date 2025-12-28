import { Card } from '@/components/ui/card';
import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    completed: number;
    upcoming: number;
    highPriority: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Appuntamenti oggi',
      value: stats.total,
      icon: Calendar,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Completati',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-priority-low',
      bg: 'bg-priority-low/10',
    },
    {
      label: 'In arrivo',
      value: stats.upcoming,
      icon: Clock,
      color: 'text-priority-personal',
      bg: 'bg-priority-personal/10',
    },
    {
      label: 'Alta priorità',
      value: stats.highPriority,
      icon: AlertCircle,
      color: 'text-priority-high',
      bg: 'bg-priority-high/10',
    },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
      {cards.map((card) => (
        <Card 
          key={card.label} 
          className="p-3 flex-shrink-0 min-w-[100px]"
        >
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">{card.value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{card.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
