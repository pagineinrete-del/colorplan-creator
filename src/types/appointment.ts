export type Priority = 'high' | 'medium' | 'low' | 'personal' | 'work';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  endTime?: string;
  priority: Priority;
  recurrence: RecurrenceType;
  reminder?: boolean;
  completed?: boolean;
}

export type ViewType = 'day' | 'week' | 'month';

export const priorityConfig: Record<Priority, { label: string; color: string; bgColor: string; icon: string }> = {
  high: {
    label: 'Alta priorità',
    color: 'priority-high',
    bgColor: 'priority-high-bg',
    icon: '🔴',
  },
  medium: {
    label: 'Media priorità',
    color: 'priority-medium',
    bgColor: 'priority-medium-bg',
    icon: '🟠',
  },
  low: {
    label: 'Bassa priorità',
    color: 'priority-low',
    bgColor: 'priority-low-bg',
    icon: '🟢',
  },
  personal: {
    label: 'Personale',
    color: 'priority-personal',
    bgColor: 'priority-personal-bg',
    icon: '🔵',
  },
  work: {
    label: 'Lavoro / Studio',
    color: 'priority-work',
    bgColor: 'priority-work-bg',
    icon: '🟣',
  },
};
