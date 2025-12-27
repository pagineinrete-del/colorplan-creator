import { useMemo } from 'react';
import { Appointment, ViewType } from '@/types/appointment';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppointmentCard } from './AppointmentCard';
import { PriorityDot } from './PriorityBadge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
} from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  viewType: ViewType;
  onDateSelect: (date: Date) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  getAppointmentsForDate: (date: Date) => Appointment[];
}

export function CalendarView({
  appointments,
  selectedDate,
  viewType,
  onDateSelect,
  onNavigate,
  onAppointmentClick,
  onToggleComplete,
  onDelete,
  getAppointmentsForDate,
}: CalendarViewProps) {
  const days = useMemo(() => {
    if (viewType === 'day') {
      return [selectedDate];
    }
    if (viewType === 'week') {
      const start = startOfWeek(selectedDate, { locale: it });
      const end = endOfWeek(selectedDate, { locale: it });
      return eachDayOfInterval({ start, end });
    }
    // Month view
    const start = startOfWeek(startOfMonth(selectedDate), { locale: it });
    const end = endOfWeek(endOfMonth(selectedDate), { locale: it });
    return eachDayOfInterval({ start, end });
  }, [selectedDate, viewType]);

  const title = useMemo(() => {
    if (viewType === 'day') {
      return format(selectedDate, "EEEE d MMMM yyyy", { locale: it });
    }
    if (viewType === 'week') {
      const start = startOfWeek(selectedDate, { locale: it });
      const end = endOfWeek(selectedDate, { locale: it });
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'd', { locale: it })} - ${format(end, 'd MMMM yyyy', { locale: it })}`;
      }
      return `${format(start, 'd MMM', { locale: it })} - ${format(end, 'd MMM yyyy', { locale: it })}`;
    }
    return format(selectedDate, 'MMMM yyyy', { locale: it });
  }, [selectedDate, viewType]);

  if (viewType === 'day') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('prev')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold capitalize">{title}</h2>
          <Button variant="ghost" size="icon" onClick={() => onNavigate('next')}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {appointments.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Nessun appuntamento per questa giornata</p>
            </Card>
          ) : (
            appointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onEdit={onAppointmentClick}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => onNavigate('prev')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold capitalize">{title}</h2>
        <Button variant="ghost" size="icon" onClick={() => onNavigate('next')}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1">
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={cn(
        'grid grid-cols-7 gap-1',
        viewType === 'week' ? 'auto-rows-[120px]' : 'auto-rows-[100px]'
      )}>
        {days.map((day) => {
          const dayAppointments = getAppointmentsForDate(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isSelected = isSameDay(day, selectedDate);

          return (
            <Card
              key={day.toISOString()}
              className={cn(
                'p-2 cursor-pointer transition-all hover:shadow-md overflow-hidden',
                !isCurrentMonth && 'opacity-40',
                isSelected && 'ring-2 ring-primary',
                isToday(day) && 'bg-primary/5'
              )}
              onClick={() => onDateSelect(day)}
            >
              <div className={cn(
                'text-sm font-medium mb-1',
                isToday(day) && 'text-primary'
              )}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1 overflow-hidden">
                {dayAppointments.slice(0, viewType === 'week' ? 3 : 2).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-1 text-xs truncate cursor-pointer hover:bg-accent rounded px-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick?.(apt);
                    }}
                  >
                    <PriorityDot priority={apt.priority} className="h-1.5 w-1.5" />
                    <span className="truncate">{apt.title}</span>
                  </div>
                ))}
                {dayAppointments.length > (viewType === 'week' ? 3 : 2) && (
                  <div className="text-xs text-muted-foreground px-1">
                    +{dayAppointments.length - (viewType === 'week' ? 3 : 2)} altri
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
