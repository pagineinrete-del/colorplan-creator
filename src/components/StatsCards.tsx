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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card 
          key={card.label} 
          className="p-4 transition-all hover:shadow-md animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
