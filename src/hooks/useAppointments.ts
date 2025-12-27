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

// Sample data for demonstration
const sampleAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Meeting con il team',
    description: 'Discussione progetto Q1',
    date: new Date(),
    time: '09:00',
    endTime: '10:00',
    priority: 'high',
    recurrence: 'weekly',
    reminder: true,
  },
  {
    id: '2',
    title: 'Pranzo con Marco',
    date: new Date(),
    time: '12:30',
    endTime: '13:30',
    priority: 'personal',
    recurrence: 'none',
  },
  {
    id: '3',
    title: 'Review codice',
    description: 'Pull request #42',
    date: new Date(),
    time: '15:00',
    endTime: '16:00',
    priority: 'work',
    recurrence: 'none',
    reminder: true,
  },
  {
    id: '4',
    title: 'Palestra',
    date: addDays(new Date(), 1),
    time: '18:00',
    endTime: '19:30',
    priority: 'low',
    recurrence: 'daily',
  },
  {
    id: '5',
    title: 'Call cliente',
    description: 'Presentazione nuovo prodotto',
    date: addDays(new Date(), 2),
    time: '11:00',
    endTime: '12:00',
    priority: 'high',
    recurrence: 'none',
    reminder: true,
  },
  {
    id: '6',
    title: 'Dentista',
    date: addDays(new Date(), 3),
    time: '16:00',
    endTime: '17:00',
    priority: 'medium',
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
