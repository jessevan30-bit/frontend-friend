import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { mockAppointments, mockEmployees, getClientById, getServiceById } from '@/data/mockData';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AppointmentStatus } from '@/types';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];

const statusColors: Record<AppointmentStatus, string> = {
  pending: 'bg-secondary border-secondary-foreground/20',
  confirmed: 'bg-primary text-primary-foreground',
  in_progress: 'bg-accent border-2 border-border',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/20 text-destructive',
  no_show: 'bg-destructive/10 text-destructive',
};

export default function AppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-01-30'));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  const formattedDate = currentDate.toISOString().split('T')[0];
  const todayAppointments = mockAppointments.filter(apt => apt.date === formattedDate);
  
  const coiffeurs = mockEmployees.filter(e => e.role === 'coiffeur');
  const displayedEmployees = selectedEmployee === 'all' 
    ? coiffeurs 
    : coiffeurs.filter(e => e.id === selectedEmployee);

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const getAppointmentForSlot = (employeeId: string, time: string) => {
    return todayAppointments.find(apt => 
      apt.employeeId === employeeId && 
      apt.startTime === time
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Rendez-vous</h1>
            <p className="text-muted-foreground">Planification et gestion des RDV</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouveau RDV
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-border">
              <DialogHeader>
                <DialogTitle>Nouveau rendez-vous</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cli-1">Camille Leroy</SelectItem>
                      <SelectItem value="cli-2">Thomas Moreau</SelectItem>
                      <SelectItem value="cli-3">Julie Girard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="srv-1">Coupe Homme - 25€</SelectItem>
                      <SelectItem value="srv-2">Coupe Femme - 45€</SelectItem>
                      <SelectItem value="srv-4">Coloration - 80€</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Coiffeur</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un coiffeur" />
                    </SelectTrigger>
                    <SelectContent>
                      {coiffeurs.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" defaultValue={formattedDate} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Heure</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Créer le RDV</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Date navigation */}
        <div className="flex items-center justify-between bg-card border-2 border-border p-4">
          <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <p className="text-xl font-bold">
              {currentDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {todayAppointments.length} rendez-vous
            </p>
          </div>
          
          <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Employee filter */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedEmployee === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedEmployee('all')}
          >
            Tous les coiffeurs
          </Button>
          {coiffeurs.map(emp => (
            <Button 
              key={emp.id}
              variant={selectedEmployee === emp.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedEmployee(emp.id)}
            >
              {emp.firstName}
            </Button>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="grid gap-2" style={{ gridTemplateColumns: `80px repeat(${displayedEmployees.length}, 1fr)` }}>
              <div className="p-2 font-medium text-muted-foreground text-sm">Heure</div>
              {displayedEmployees.map(emp => (
                <div 
                  key={emp.id} 
                  className="p-3 bg-card border-2 border-border text-center"
                >
                  <div 
                    className="w-10 h-10 mx-auto mb-2 flex items-center justify-center font-bold text-primary-foreground"
                    style={{ backgroundColor: emp.color }}
                  >
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <p className="font-medium">{emp.firstName}</p>
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="mt-2 space-y-1">
              {timeSlots.map(time => (
                <div 
                  key={time}
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `80px repeat(${displayedEmployees.length}, 1fr)` }}
                >
                  <div className="p-2 text-sm font-mono text-muted-foreground flex items-center">
                    {time}
                  </div>
                  {displayedEmployees.map(emp => {
                    const appointment = getAppointmentForSlot(emp.id, time);
                    const client = appointment ? getClientById(appointment.clientId) : null;
                    const service = appointment ? getServiceById(appointment.serviceId) : null;
                    
                    return (
                      <div 
                        key={`${emp.id}-${time}`}
                        className={cn(
                          "min-h-[60px] border-2 border-border p-2 transition-all cursor-pointer",
                          appointment 
                            ? statusColors[appointment.status]
                            : "bg-card hover:bg-accent"
                        )}
                      >
                        {appointment && client && service && (
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-1 font-medium">
                              <User className="w-3 h-3" />
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="flex items-center gap-1 opacity-80">
                              <Clock className="w-3 h-3" />
                              {service.name}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
