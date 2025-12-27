import { Appointment, priorityConfig } from '@/types/appointment';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PriorityDot } from './PriorityBadge';
import { Clock, Trash2, Edit, Bell, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface AppointmentCardProps {
  appointment: Appointment;
  onToggleComplete?: (id: string) => void;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export function AppointmentCard({
  appointment,
  onToggleComplete,
  onEdit,
  onDelete,
  compact = false,
}: AppointmentCardProps) {
  const priorityBgClasses: Record<string, string> = {
    high: 'border-l-priority-high bg-priority-high-bg/50',
    medium: 'border-l-priority-medium bg-priority-medium-bg/50',
    low: 'border-l-priority-low bg-priority-low-bg/50',
    personal: 'border-l-priority-personal bg-priority-personal-bg/50',
    work: 'border-l-priority-work bg-priority-work-bg/50',
  };

  if (compact) {
    return (
      <div
        className={cn(
          'group flex items-center gap-3 p-2.5 rounded-lg border-l-3 transition-all hover:shadow-sm cursor-pointer',
          priorityBgClasses[appointment.priority],
          appointment.completed && 'opacity-50'
        )}
        onClick={() => onEdit?.(appointment)}
      >
        <PriorityDot priority={appointment.priority} />
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-medium truncate',
            appointment.completed && 'line-through'
          )}>
            {appointment.title}
          </p>
          <p className="text-xs text-muted-foreground">{appointment.time}</p>
        </div>
        {appointment.reminder && (
          <Bell className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    );
  }

  return (
    <Card className={cn(
      'group overflow-hidden border-l-4 transition-all hover:shadow-md animate-fade-in',
      priorityBgClasses[appointment.priority],
      appointment.completed && 'opacity-60'
    )}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={appointment.completed}
            onCheckedChange={() => onToggleComplete?.(appointment.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn(
                'font-semibold text-foreground',
                appointment.completed && 'line-through'
              )}>
                {appointment.title}
              </h3>
              <PriorityDot priority={appointment.priority} />
            </div>
            
            {appointment.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {appointment.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {appointment.time}
                {appointment.endTime && ` - ${appointment.endTime}`}
              </span>
              
              {appointment.recurrence !== 'none' && (
                <span className="flex items-center gap-1">
                  <Repeat className="h-3.5 w-3.5" />
                  {appointment.recurrence === 'daily' && 'Giornaliero'}
                  {appointment.recurrence === 'weekly' && 'Settimanale'}
                  {appointment.recurrence === 'monthly' && 'Mensile'}
                </span>
              )}

              {appointment.reminder && (
                <span className="flex items-center gap-1">
                  <Bell className="h-3.5 w-3.5" />
                  Promemoria
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit?.(appointment)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete?.(appointment.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
