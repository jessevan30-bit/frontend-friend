import { 
  Salon, Employee, Client, Service, ServiceCategory, 
  Appointment, Payment, DashboardStats 
} from '@/types';

export const mockSalon: Salon = {
  id: 'salon-1',
  name: 'SalonPro Studio',
  address: '123 Avenue des Champs-Élysées, Paris',
  phone: '+33 1 23 45 67 89',
  email: 'contact@salonpro.fr',
  openingHours: '9h00 - 19h00',
  currency: 'EUR',
  timezone: 'Europe/Paris',
};

export const mockCategories: ServiceCategory[] = [
  { id: 'cat-1', name: 'Coupe', color: 'hsl(0, 0%, 0%)' },
  { id: 'cat-2', name: 'Coloration', color: 'hsl(0, 0%, 30%)' },
  { id: 'cat-3', name: 'Soin', color: 'hsl(0, 0%, 50%)' },
  { id: 'cat-4', name: 'Coiffure', color: 'hsl(0, 0%, 70%)' },
];

export const mockServices: Service[] = [
  { id: 'srv-1', salonId: 'salon-1', name: 'Coupe Homme', duration: 30, price: 25, categoryId: 'cat-1', isActive: true },
  { id: 'srv-2', salonId: 'salon-1', name: 'Coupe Femme', duration: 45, price: 45, categoryId: 'cat-1', isActive: true },
  { id: 'srv-3', salonId: 'salon-1', name: 'Coupe Enfant', duration: 20, price: 15, categoryId: 'cat-1', isActive: true },
  { id: 'srv-4', salonId: 'salon-1', name: 'Coloration complète', duration: 90, price: 80, categoryId: 'cat-2', isActive: true },
  { id: 'srv-5', salonId: 'salon-1', name: 'Mèches', duration: 120, price: 100, categoryId: 'cat-2', isActive: true },
  { id: 'srv-6', salonId: 'salon-1', name: 'Balayage', duration: 150, price: 120, categoryId: 'cat-2', isActive: true },
  { id: 'srv-7', salonId: 'salon-1', name: 'Soin profond', duration: 30, price: 35, categoryId: 'cat-3', isActive: true },
  { id: 'srv-8', salonId: 'salon-1', name: 'Brushing', duration: 30, price: 30, categoryId: 'cat-4', isActive: true },
  { id: 'srv-9', salonId: 'salon-1', name: 'Chignon', duration: 60, price: 60, categoryId: 'cat-4', isActive: true },
];

export const mockEmployees: Employee[] = [
  { 
    id: 'emp-1', 
    salonId: 'salon-1', 
    firstName: 'Marie', 
    lastName: 'Dupont', 
    email: 'marie@salonpro.fr', 
    phone: '+33 6 12 34 56 78',
    role: 'admin',
    color: 'hsl(0, 0%, 20%)',
    isActive: true
  },
  { 
    id: 'emp-2', 
    salonId: 'salon-1', 
    firstName: 'Lucas', 
    lastName: 'Martin', 
    email: 'lucas@salonpro.fr', 
    phone: '+33 6 23 45 67 89',
    role: 'coiffeur',
    color: 'hsl(0, 0%, 40%)',
    isActive: true
  },
  { 
    id: 'emp-3', 
    salonId: 'salon-1', 
    firstName: 'Sophie', 
    lastName: 'Bernard', 
    email: 'sophie@salonpro.fr', 
    phone: '+33 6 34 56 78 90',
    role: 'coiffeur',
    color: 'hsl(0, 0%, 60%)',
    isActive: true
  },
  { 
    id: 'emp-4', 
    salonId: 'salon-1', 
    firstName: 'Emma', 
    lastName: 'Petit', 
    email: 'emma@salonpro.fr', 
    phone: '+33 6 45 67 89 01',
    role: 'receptionniste',
    color: 'hsl(0, 0%, 80%)',
    isActive: true
  },
];

export const mockClients: Client[] = [
  { id: 'cli-1', salonId: 'salon-1', firstName: 'Camille', lastName: 'Leroy', email: 'camille@email.com', phone: '+33 6 11 22 33 44', createdAt: '2024-01-15', lastVisit: '2026-01-28' },
  { id: 'cli-2', salonId: 'salon-1', firstName: 'Thomas', lastName: 'Moreau', email: 'thomas@email.com', phone: '+33 6 22 33 44 55', createdAt: '2024-02-20', lastVisit: '2026-01-25' },
  { id: 'cli-3', salonId: 'salon-1', firstName: 'Julie', lastName: 'Girard', email: 'julie@email.com', phone: '+33 6 33 44 55 66', createdAt: '2024-03-10', lastVisit: '2026-01-20' },
  { id: 'cli-4', salonId: 'salon-1', firstName: 'Nicolas', lastName: 'Roux', email: 'nicolas@email.com', phone: '+33 6 44 55 66 77', createdAt: '2024-04-05', lastVisit: '2026-01-15' },
  { id: 'cli-5', salonId: 'salon-1', firstName: 'Laura', lastName: 'Fournier', email: 'laura@email.com', phone: '+33 6 55 66 77 88', createdAt: '2024-05-12', lastVisit: '2026-01-10' },
  { id: 'cli-6', salonId: 'salon-1', firstName: 'Antoine', lastName: 'Vincent', email: 'antoine@email.com', phone: '+33 6 66 77 88 99', createdAt: '2024-06-18', lastVisit: '2026-01-05' },
  { id: 'cli-7', salonId: 'salon-1', firstName: 'Léa', lastName: 'Mercier', email: 'lea@email.com', phone: '+33 6 77 88 99 00', createdAt: '2024-07-22', lastVisit: '2026-01-02' },
  { id: 'cli-8', salonId: 'salon-1', firstName: 'Maxime', lastName: 'Blanc', email: 'maxime@email.com', phone: '+33 6 88 99 00 11', createdAt: '2025-01-08', lastVisit: '2026-01-28' },
];

export const mockAppointments: Appointment[] = [
  { id: 'apt-1', salonId: 'salon-1', clientId: 'cli-1', employeeId: 'emp-2', serviceId: 'srv-2', date: '2026-01-30', startTime: '09:00', endTime: '09:45', status: 'confirmed', createdAt: '2026-01-28' },
  { id: 'apt-2', salonId: 'salon-1', clientId: 'cli-2', employeeId: 'emp-3', serviceId: 'srv-1', date: '2026-01-30', startTime: '10:00', endTime: '10:30', status: 'confirmed', createdAt: '2026-01-27' },
  { id: 'apt-3', salonId: 'salon-1', clientId: 'cli-3', employeeId: 'emp-2', serviceId: 'srv-4', date: '2026-01-30', startTime: '11:00', endTime: '12:30', status: 'pending', createdAt: '2026-01-29' },
  { id: 'apt-4', salonId: 'salon-1', clientId: 'cli-4', employeeId: 'emp-3', serviceId: 'srv-8', date: '2026-01-30', startTime: '14:00', endTime: '14:30', status: 'confirmed', createdAt: '2026-01-28' },
  { id: 'apt-5', salonId: 'salon-1', clientId: 'cli-5', employeeId: 'emp-2', serviceId: 'srv-5', date: '2026-01-30', startTime: '15:00', endTime: '17:00', status: 'pending', createdAt: '2026-01-29' },
  { id: 'apt-6', salonId: 'salon-1', clientId: 'cli-6', employeeId: 'emp-3', serviceId: 'srv-7', date: '2026-01-30', startTime: '17:00', endTime: '17:30', status: 'confirmed', createdAt: '2026-01-28' },
  { id: 'apt-7', salonId: 'salon-1', clientId: 'cli-7', employeeId: 'emp-2', serviceId: 'srv-9', date: '2026-01-31', startTime: '10:00', endTime: '11:00', status: 'confirmed', createdAt: '2026-01-29' },
  { id: 'apt-8', salonId: 'salon-1', clientId: 'cli-8', employeeId: 'emp-3', serviceId: 'srv-2', date: '2026-01-31', startTime: '14:00', endTime: '14:45', status: 'pending', createdAt: '2026-01-30' },
];

export const mockPayments: Payment[] = [
  { id: 'pay-1', salonId: 'salon-1', appointmentId: 'apt-1', clientId: 'cli-1', amount: 45, method: 'card', status: 'completed', createdAt: '2026-01-28' },
  { id: 'pay-2', salonId: 'salon-1', appointmentId: 'apt-2', clientId: 'cli-2', amount: 25, method: 'cash', status: 'completed', createdAt: '2026-01-28' },
  { id: 'pay-3', salonId: 'salon-1', clientId: 'cli-3', amount: 80, method: 'card', status: 'completed', createdAt: '2026-01-27' },
  { id: 'pay-4', salonId: 'salon-1', clientId: 'cli-4', amount: 30, method: 'mobile', status: 'completed', createdAt: '2026-01-27' },
  { id: 'pay-5', salonId: 'salon-1', clientId: 'cli-5', amount: 100, method: 'card', status: 'completed', createdAt: '2026-01-26' },
];

export const mockDashboardStats: DashboardStats = {
  todayAppointments: 6,
  todayRevenue: 380,
  weeklyRevenue: 2450,
  monthlyRevenue: 12800,
  totalClients: 156,
  newClientsThisMonth: 12,
};

// Helpers
export const getClientById = (id: string) => mockClients.find(c => c.id === id);
export const getEmployeeById = (id: string) => mockEmployees.find(e => e.id === id);
export const getServiceById = (id: string) => mockServices.find(s => s.id === id);
export const getCategoryById = (id: string) => mockCategories.find(c => c.id === id);
