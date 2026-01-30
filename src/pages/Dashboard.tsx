import { Calendar, Euro, Users, TrendingUp, Clock, UserPlus, Sparkles } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { mockDashboardStats, mockAppointments, mockEmployees } from '@/data/mockData';
import heroImage from '@/assets/hero-salon.jpg';

export default function Dashboard() {
  const todayAppointments = mockAppointments.filter(apt => apt.date === '2026-01-30');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero section with immersive design */}
        <div className="relative h-56 lg:h-72 rounded-2xl overflow-hidden group">
          <img 
            src={heroImage} 
            alt="Salon" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
          
          {/* Decorative pattern */}
          <div className="absolute inset-0 pattern-kente opacity-20" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center px-8 lg:px-12">
            <div className="text-background max-w-lg">
              <div className="flex items-center gap-2 mb-3 animate-fade-in-down">
                <Sparkles className="w-5 h-5 text-accent animate-pulse-glow" />
                <span className="text-sm font-medium uppercase tracking-widest opacity-90">Bienvenue</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-3 animate-fade-in-left">
                Votre Salon
              </h1>
              <p className="text-lg opacity-90 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                Gérez votre activité en toute simplicité avec style
              </p>
            </div>
          </div>
          
          {/* Decorative accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 gradient-sunset" />
        </div>

        {/* Stats grid with staggered animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="RDV aujourd'hui"
            value={mockDashboardStats.todayAppointments}
            icon={<Calendar className="w-5 h-5 text-primary" />}
            delay={0}
          />
          <StatCard
            title="CA aujourd'hui"
            value={`${mockDashboardStats.todayRevenue}€`}
            icon={<Euro className="w-5 h-5 text-primary" />}
            delay={50}
          />
          <StatCard
            title="CA semaine"
            value={`${mockDashboardStats.weeklyRevenue}€`}
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
            trend={{ value: 12, isPositive: true }}
            delay={100}
          />
          <StatCard
            title="CA mois"
            value={`${mockDashboardStats.monthlyRevenue.toLocaleString()}€`}
            icon={<Euro className="w-5 h-5 text-primary" />}
            delay={150}
          />
          <StatCard
            title="Total clients"
            value={mockDashboardStats.totalClients}
            icon={<Users className="w-5 h-5 text-primary" />}
            delay={200}
          />
          <StatCard
            title="Nouveaux clients"
            value={mockDashboardStats.newClientsThisMonth}
            subtitle="ce mois"
            icon={<UserPlus className="w-5 h-5 text-primary" />}
            delay={250}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's appointments */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                Rendez-vous du jour
              </h2>
              <span className="text-sm text-muted-foreground font-mono bg-secondary px-3 py-1 rounded-full">
                {todayAppointments.length} RDV
              </span>
            </div>
            
            <div className="space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((apt, index) => (
                  <div 
                    key={apt.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <AppointmentCard appointment={apt} />
                  </div>
                ))
              ) : (
                <div className="bg-card border border-border rounded-lg p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Aucun rendez-vous aujourd'hui</p>
                </div>
              )}
            </div>
          </div>

          {/* Employee activity */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Users className="w-5 h-5 text-accent-foreground" />
              </div>
              Équipe active
            </h2>
            
            <div className="space-y-3">
              {mockEmployees.filter(e => e.role !== 'receptionniste').map((employee, index) => {
                const employeeAppointments = todayAppointments.filter(apt => apt.employeeId === employee.id);
                
                return (
                  <div 
                    key={employee.id}
                    className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group animate-fade-in-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 flex items-center justify-center font-bold rounded-full shadow-md group-hover:shadow-glow transition-all duration-300 group-hover:scale-110"
                        style={{ 
                          backgroundColor: employee.color,
                          color: 'white'
                        }}
                      >
                        {employee.firstName[0]}{employee.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                        <p className="text-sm text-muted-foreground capitalize">{employee.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{employeeAppointments.length}</p>
                        <p className="text-xs text-muted-foreground">RDV</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
