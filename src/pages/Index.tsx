import { useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { Appointment, ViewType } from '@/types/appointment';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/StatsCards';
import { TodayAgenda } from '@/components/TodayAgenda';
import { CalendarView } from '@/components/CalendarView';
import { ViewToggle } from '@/components/ViewToggle';
import { PriorityFilter } from '@/components/PriorityFilter';
import { AppointmentForm } from '@/components/AppointmentForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Plus, Calendar } from 'lucide-react';
import { addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';
import { Helmet } from 'react-helmet';

const Index = () => {
  const {
    appointments,
    todayAppointments,
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
  } = useAppointments();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const handleNavigate = (direction: 'prev' | 'next') => {
    const modifier = direction === 'next' ? 1 : -1;
    
    switch (viewType) {
      case 'day':
        setSelectedDate(addDays(selectedDate, modifier));
        break;
      case 'week':
        setSelectedDate(addWeeks(selectedDate, modifier));
        break;
      case 'month':
        setSelectedDate(addMonths(selectedDate, modifier));
        break;
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingAppointment(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>ColorPlan - Organizza il tuo tempo</title>
        <meta name="description" content="ColorPlan è un'app di gestione appuntamenti con priorità a colori." />
      </Helmet>

      <div className="min-h-screen bg-background pb-20">
        {/* Minimal Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">ColorPlan</h1>
            </div>
            <div className="flex items-center gap-1">
              <PriorityFilter selected={filterPriority} onChange={setFilterPriority} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content - Vertical Stack */}
        <main className="px-4 py-4 space-y-4">
          {/* Stats - Compact */}
          <StatsCards stats={stats} />

          {/* View Toggle */}
          <ViewToggle selected={viewType} onChange={setViewType} />

          {/* Calendar */}
          <CalendarView
            appointments={appointments}
            selectedDate={selectedDate}
            viewType={viewType}
            onDateSelect={setSelectedDate}
            onNavigate={handleNavigate}
            onAppointmentClick={handleAppointmentClick}
            onToggleComplete={toggleComplete}
            onDelete={deleteAppointment}
            getAppointmentsForDate={getAppointmentsForDate}
          />

          {/* Today's Agenda */}
          <TodayAgenda
            appointments={todayAppointments}
            onAppointmentClick={handleAppointmentClick}
            onToggleComplete={toggleComplete}
            onDelete={deleteAppointment}
          />
        </main>

        {/* Floating Action Button */}
        <Button 
          onClick={() => setIsFormOpen(true)} 
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Appointment Form Modal */}
        <AppointmentForm
          open={isFormOpen}
          onOpenChange={handleFormClose}
          appointment={editingAppointment}
          onSave={addAppointment}
          onUpdate={updateAppointment}
        />
      </div>
    </>
  );
};

export default Index;