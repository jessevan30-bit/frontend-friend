import { Clock, User, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment, AppointmentStatus } from '@/types';
import { getClientById, getEmployeeById, getServiceById } from '@/data/mockData';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
}

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-secondary text-secondary-foreground' },
  confirmed: { label: 'Confirmé', className: 'bg-primary text-primary-foreground' },
  in_progress: { label: 'En cours', className: 'bg-accent text-accent-foreground border-2 border-border' },
  completed: { label: 'Terminé', className: 'bg-muted text-muted-foreground' },
  cancelled: { label: 'Annulé', className: 'bg-destructive text-destructive-foreground' },
  no_show: { label: 'Absent', className: 'bg-destructive/20 text-destructive' },
};

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const client = getClientById(appointment.clientId);
  const employee = getEmployeeById(appointment.employeeId);
  const service = getServiceById(appointment.serviceId);
  const status = statusConfig[appointment.status];

  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-card border-2 border-border p-4 cursor-pointer transition-all hover:shadow-sm hover:-translate-y-0.5",
        onClick && "hover:border-primary"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono font-bold">
              {appointment.startTime} - {appointment.endTime}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium truncate">
              {client ? `${client.firstName} ${client.lastName}` : 'Client inconnu'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Scissors className="w-4 h-4" />
            <span className="truncate">{service?.name || 'Service inconnu'}</span>
            <span className="mx-1">•</span>
            <span className="truncate">{employee?.firstName || 'Employé inconnu'}</span>
          </div>
        </div>

        <div className={cn("px-3 py-1 text-xs font-medium uppercase tracking-wide", status.className)}>
          {status.label}
        </div>
      </div>
    </div>
  );
}
