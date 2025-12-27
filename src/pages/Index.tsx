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
import { Plus, Calendar, Sparkles } from 'lucide-react';
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
        <title>ColorPlan - Organizza il tuo tempo, a colpo d'occhio</title>
        <meta name="description" content="ColorPlan è un'app di gestione appuntamenti con priorità a colori. Organizza attività giornaliere, settimanali e mensili in modo semplice e intuitivo." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Calendar className="h-8 w-8 text-primary" />
                  <Sparkles className="h-3 w-3 text-priority-medium absolute -top-0.5 -right-0.5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">ColorPlan</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Organizza il tuo tempo, a colpo d'occhio
                  </p>
                </div>
              </div>

              <Button onClick={() => setIsFormOpen(true)} className="gap-2 shadow-md">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nuovo appuntamento</span>
                <span className="sm:hidden">Nuovo</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Stats */}
          <section className="animate-fade-in">
            <StatsCards stats={stats} />
          </section>

          {/* Controls */}
          <section className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-fade-in" style={{ animationDelay: '100ms' }}>
            <ViewToggle selected={viewType} onChange={setViewType} />
            <PriorityFilter selected={filterPriority} onChange={setFilterPriority} />
          </section>

          {/* Main Grid */}
          <section className="grid lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
            {/* Calendar Area */}
            <div className="lg:col-span-2">
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
            </div>

            {/* Sidebar - Today's Agenda */}
            <div className="lg:col-span-1">
              <TodayAgenda
                appointments={todayAppointments}
                onAppointmentClick={handleAppointmentClick}
                onToggleComplete={toggleComplete}
                onDelete={deleteAppointment}
              />
            </div>
          </section>
        </main>

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
