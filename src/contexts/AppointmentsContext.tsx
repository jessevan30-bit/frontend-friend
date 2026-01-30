import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Appointment, Client, Payment, PaymentMethod } from '@/types';
import { mockAppointments, mockClients, mockSalon, getServiceById } from '@/data/mockData';

interface AppointmentsContextType {
  appointments: Appointment[];
  clients: Client[];
  payments: Payment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'endTime' | 'status'>) => Appointment;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'salonId'>) => Client;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'status'>) => Payment;
  getClientByEmail: (email: string) => Client | undefined;
  getClientById: (id: string) => Client | undefined;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status'], updateData?: Partial<Appointment>) => void;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [payments, setPayments] = useState<Payment[]>([]);

  const addClient = useCallback((clientData: Omit<Client, 'id' | 'createdAt' | 'salonId'>): Client => {
    // Vérifier si le client existe déjà par email
    const existingClient = clients.find(c => c.email.toLowerCase() === clientData.email.toLowerCase());
    if (existingClient) {
      return existingClient;
    }

    // Créer un nouveau client
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      salonId: mockSalon.id,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setClients(prev => [...prev, newClient]);
    return newClient;
  }, [clients]);

  const getClientByEmail = useCallback((email: string): Client | undefined => {
    return clients.find(c => c.email.toLowerCase() === email.toLowerCase());
  }, [clients]);

  const getClientById = useCallback((id: string): Client | undefined => {
    return clients.find(c => c.id === id);
  }, [clients]);

  const addAppointment = useCallback((
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'endTime' | 'status'>
  ): Appointment => {
    const service = getServiceById(appointmentData.serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    // Calculer l'heure de fin
    const [hours, minutes] = appointmentData.startTime.split(':').map(Number);
    const startDate = new Date(`${appointmentData.date}T${appointmentData.startTime}`);
    const endDate = new Date(startDate.getTime() + service.duration * 60000);
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      endTime,
      status: 'pending', // Les réservations depuis le site public sont en attente
      source: appointmentData.source || 'website', // Source par défaut
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  }, []);

  const updateAppointmentStatus = useCallback((
    appointmentId: string,
    status: Appointment['status'],
    updateData?: Partial<Appointment>
  ) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status, ...updateData } : apt
      )
    );
  }, []);

  const addPayment = useCallback((
    paymentData: Omit<Payment, 'id' | 'createdAt' | 'status'>
  ): Payment => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      status: paymentData.method === 'cash_on_arrival' ? 'pending' : 'completed',
      createdAt: new Date().toISOString(),
    };

    setPayments(prev => [...prev, newPayment]);
    
    // Mettre à jour le statut de la réservation si le paiement est complété
    if (newPayment.status === 'completed' && paymentData.appointmentId) {
      updateAppointmentStatus(paymentData.appointmentId, 'confirmed');
    }

    return newPayment;
  }, [updateAppointmentStatus]);

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        clients,
        payments,
        addAppointment,
        addClient,
        addPayment,
        getClientByEmail,
        getClientById,
        updateAppointmentStatus,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
}

