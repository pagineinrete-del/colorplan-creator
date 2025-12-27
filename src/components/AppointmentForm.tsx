import { useState } from 'react';
import { Appointment, Priority, RecurrenceType, priorityConfig } from '@/types/appointment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment | null;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdate?: (id: string, updates: Partial<Appointment>) => void;
}

const defaultFormData = {
  title: '',
  description: '',
  date: new Date(),
  time: '09:00',
  endTime: '10:00',
  priority: 'medium' as Priority,
  recurrence: 'none' as RecurrenceType,
  reminder: false,
};

export function AppointmentForm({
  open,
  onOpenChange,
  appointment,
  onSave,
  onUpdate,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState(appointment || defaultFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appointment?.id && onUpdate) {
      onUpdate(appointment.id, formData);
    } else {
      onSave(formData);
    }
    onOpenChange(false);
    setFormData(defaultFormData);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && appointment) {
      setFormData(appointment);
    } else if (!newOpen) {
      setFormData(defaultFormData);
    }
    onOpenChange(newOpen);
  };

  const priorityColors: Record<Priority, string> = {
    high: 'bg-priority-high',
    medium: 'bg-priority-medium',
    low: 'bg-priority-low',
    personal: 'bg-priority-personal',
    work: 'bg-priority-work',
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <DialogTitle className="text-xl font-semibold">
            {appointment?.id ? 'Modifica Appuntamento' : 'Nuovo Appuntamento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Aggiungi un titolo..."
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione (opzionale)</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Aggiungi una descrizione..."
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-11"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(formData.date), 'dd MMM yyyy', { locale: it })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.date)}
                    onSelect={(date) => date && setFormData({ ...formData, date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Priorità</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div className={cn('h-3 w-3 rounded-full', priorityColors[formData.priority])} />
                      {priorityConfig[formData.priority].label}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(priorityConfig) as Priority[]).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <div className="flex items-center gap-2">
                        <div className={cn('h-3 w-3 rounded-full', priorityColors[priority])} />
                        {priorityConfig[priority].label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Ora inizio</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Ora fine</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime || ''}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="pl-10 h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ripetizione</Label>
            <Select
              value={formData.recurrence}
              onValueChange={(value: RecurrenceType) => setFormData({ ...formData, recurrence: value })}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nessuna</SelectItem>
                <SelectItem value="daily">Giornaliera</SelectItem>
                <SelectItem value="weekly">Settimanale</SelectItem>
                <SelectItem value="monthly">Mensile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="reminder">Promemoria</Label>
              <p className="text-xs text-muted-foreground">Ricevi una notifica prima dell'evento</p>
            </div>
            <Switch
              id="reminder"
              checked={formData.reminder}
              onCheckedChange={(checked) => setFormData({ ...formData, reminder: checked })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" className="flex-1">
              {appointment?.id ? 'Salva modifiche' : 'Crea appuntamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
