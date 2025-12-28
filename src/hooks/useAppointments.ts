import { useState, useCallback, useMemo } from 'react';
import { Appointment, Priority, ViewType } from '@/types/appointment';
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  isWithinInterval,
  isSameDay,
  addDays,
  addWeeks,
  addMonths,
  format
} from 'date-fns';
import { it } from 'date-fns/locale';

// La tua giornata di oggi
const sampleAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Colazione',
    date: new Date(),
    time: '07:00',
    priority: 'personal',
    recurrence: 'none',
  },
  {
    id: '2',
    title: 'Lavatrice',
    date: new Date(),
    time: '07:30',
    priority: 'medium',
    recurrence: 'none',
  },
  {
    id: '3',
    title: 'Studio concentrato',
    description: 'Sessione di studio mattutina',
    date: new Date(),
    time: '07:30',
    endTime: '10:00',
    priority: 'work',
    recurrence: 'none',
  },
  {
    id: '4',
    title: 'Stendere lavatrice / riordino',
    date: new Date(),
    time: '09:30',
    priority: 'medium',
    recurrence: 'none',
  },
  {
    id: '5',
    title: 'Spuntino',
    date: new Date(),
    time: '10:30',
    priority: 'personal',
    recurrence: 'none',
  },
  {
    id: '6',
    title: 'Lettura libro',
    description: 'Tarda mattina',
    date: new Date(),
    time: '10:45',
    endTime: '12:00',
    priority: 'low',
    recurrence: 'none',
  },
  {
    id: '7',
    title: 'Pianificazione progetto',
    date: new Date(),
    time: '12:00',
    endTime: '12:30',
    priority: 'work',
    recurrence: 'none',
  },
  {
    id: '8',
    title: 'Pranzo',
    date: new Date(),
    time: '12:30',
    priority: 'personal',
    recurrence: 'none',
  },
  {
    id: '9',
    title: 'Spuntino pomeridiano',
    date: new Date(),
    time: '13:30',
    priority: 'personal',
    recurrence: 'none',
  },
  {
    id: '10',
    title: 'Allenamento',
    date: new Date(),
    time: '14:00',
    endTime: '14:25',
    priority: 'high',
    recurrence: 'none',
  },
  {
    id: '11',
    title: 'Doccia / recupero',
    date: new Date(),
    time: '14:25',
    endTime: '14:40',
    priority: 'personal',
    recurrence: 'none',
  },
  {
    id: '12',
    title: 'Pianificazione progetto (focus profondo)',
    date: new Date(),
    time: '14:40',
    endTime: '15:40',
    priority: 'high',
    recurrence: 'none',
  },
  {
    id: '13',
    title: 'Studio / ripasso',
    date: new Date(),
    time: '15:40',
    endTime: '17:30',
    priority: 'work',
    recurrence: 'none',
  },
  {
    id: '14',
    title: 'Lettura leggera o revisione',
    description: 'Sera',
    date: new Date(),
    time: '18:00',
    endTime: '19:00',
    priority: 'low',
    recurrence: 'none',
  },
  {
    id: '15',
    title: 'Cena',
    date: new Date(),
    time: '19:30',
    priority: 'personal',
    recurrence: 'none',
  },
];

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>('week');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');

  const addAppointment = useCallback((appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  }, []);

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, ...updates } : apt))
    );
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id ? { ...apt, completed: !apt.completed } : apt
      )
    );
  }, []);

  const getDateRange = useCallback((date: Date, view: ViewType) => {
    switch (view) {
      case 'day':
        return { start: startOfDay(date), end: endOfDay(date) };
      case 'week':
        return { start: startOfWeek(date, { locale: it }), end: endOfWeek(date, { locale: it }) };
      case 'month':
        return { start: startOfMonth(date), end: endOfMonth(date) };
    }
  }, []);

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    if (filterPriority !== 'all') {
      filtered = filtered.filter(apt => apt.priority === filterPriority);
    }

    return filtered.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  }, [appointments, filterPriority]);

  const todayAppointments = useMemo(() => {
    return filteredAppointments.filter(apt => isSameDay(new Date(apt.date), new Date()));
  }, [filteredAppointments]);

  const viewAppointments = useMemo(() => {
    const range = getDateRange(selectedDate, viewType);
    return filteredAppointments.filter(apt =>
      isWithinInterval(new Date(apt.date), range)
    );
  }, [filteredAppointments, selectedDate, viewType, getDateRange]);

  const getAppointmentsForDate = useCallback((date: Date) => {
    return filteredAppointments.filter(apt => isSameDay(new Date(apt.date), date));
  }, [filteredAppointments]);

  const stats = useMemo(() => {
    const today = todayAppointments;
    const completed = today.filter(apt => apt.completed).length;
    const upcoming = today.filter(apt => !apt.completed).length;
    const highPriority = today.filter(apt => apt.priority === 'high' && !apt.completed).length;

    return { total: today.length, completed, upcoming, highPriority };
  }, [todayAppointments]);

  return {
    appointments: viewAppointments,
    todayAppointments,
    allAppointments: filteredAppointments,
    selectedDate,
    setSelectedDate,
    viewType,
    setViewType,
    filterPriority,
    setFilterPriority,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    toggleComplete,
    getAppointmentsForDate,
    stats,
  };
}