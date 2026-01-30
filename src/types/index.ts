// Types pour l'application SalonPro

export interface Salon {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  currency: string;
  timezone: string;
  logo?: string;
}

export type EmployeeRole = 'admin' | 'coiffeur' | 'receptionniste';

export interface Employee {
  id: string;
  salonId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  avatar?: string;
  color: string;
  isActive: boolean;
}

export interface Client {
  id: string;
  salonId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferences?: string;
  notes?: string;
  createdAt: string;
  lastVisit?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  color: string;
}

export interface Service {
  id: string;
  salonId: string;
  name: string;
  description?: string;
  duration: number; // en minutes
  price: number;
  categoryId: string;
  isActive: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  salonId: string;
  clientId: string;
  employeeId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'online';
export type PaymentStatus = 'pending' | 'completed' | 'refunded';

export interface Payment {
  id: string;
  salonId: string;
  appointmentId?: string;
  clientId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export interface Product {
  id: string;
  salonId: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
}

export interface DashboardStats {
  todayAppointments: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalClients: number;
  newClientsThisMonth: number;
}
