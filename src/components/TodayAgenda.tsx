import { Appointment } from '@/types/appointment';
import { Card } from '@/components/ui/card';
import { AppointmentCard } from './AppointmentCard';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface TodayAgendaProps {
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TodayAgenda({
  appointments,
  onAppointmentClick,
  onToggleComplete,
  onDelete,
}: TodayAgendaProps) {
  const now = new Date();

  return (
    <Card className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Agenda di oggi</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {format(now, "EEEE d MMMM", { locale: it })}
          </p>
        </div>
        <div className="text-3xl font-bold text-primary">
          {format(now, 'HH:mm')}
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nessun appuntamento per oggi</p>
            <p className="text-sm text-muted-foreground mt-1">Goditi la giornata libera! 🌟</p>
          </div>
        ) : (
          appointments.map((apt, index) => (
            <div
              key={apt.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AppointmentCard
                appointment={apt}
                onEdit={onAppointmentClick}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                compact
              />
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
