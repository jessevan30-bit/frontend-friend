import { Calendar, Euro, Users, TrendingUp, Clock, UserPlus } from 'lucide-react';
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
        {/* Hero section */}
        <div className="relative h-48 lg:h-64 border-2 border-border overflow-hidden">
          <img 
            src={heroImage} 
            alt="Salon" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <div className="text-center text-background">
              <h1 className="text-3xl lg:text-4xl font-bold">Bienvenue !</h1>
              <p className="text-lg mt-2 opacity-90">Gérez votre salon en toute simplicité</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="RDV aujourd'hui"
            value={mockDashboardStats.todayAppointments}
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatCard
            title="CA aujourd'hui"
            value={`${mockDashboardStats.todayRevenue}€`}
            icon={<Euro className="w-5 h-5" />}
          />
          <StatCard
            title="CA semaine"
            value={`${mockDashboardStats.weeklyRevenue}€`}
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="CA mois"
            value={`${mockDashboardStats.monthlyRevenue.toLocaleString()}€`}
            icon={<Euro className="w-5 h-5" />}
          />
          <StatCard
            title="Total clients"
            value={mockDashboardStats.totalClients}
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            title="Nouveaux clients"
            value={mockDashboardStats.newClientsThisMonth}
            subtitle="ce mois"
            icon={<UserPlus className="w-5 h-5" />}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's appointments */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Rendez-vous du jour
              </h2>
              <span className="text-sm text-muted-foreground font-mono">
                {todayAppointments.length} RDV
              </span>
            </div>
            
            <div className="space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments.map(apt => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))
              ) : (
                <div className="bg-card border-2 border-border p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun rendez-vous aujourd'hui</p>
                </div>
              )}
            </div>
          </div>

          {/* Employee activity */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Équipe active</h2>
            
            <div className="space-y-3">
              {mockEmployees.filter(e => e.role !== 'receptionniste').map(employee => {
                const employeeAppointments = todayAppointments.filter(apt => apt.employeeId === employee.id);
                
                return (
                  <div 
                    key={employee.id}
                    className="bg-card border-2 border-border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 flex items-center justify-center font-bold text-primary-foreground"
                        style={{ backgroundColor: employee.color }}
                      >
                        {employee.firstName[0]}{employee.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                        <p className="text-sm text-muted-foreground capitalize">{employee.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{employeeAppointments.length}</p>
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
