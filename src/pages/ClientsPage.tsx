import { useState } from 'react';
import { Search, Plus, Phone, Mail, Calendar, MoreHorizontal, Users, Clock, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { AkomaSymbol, AfricanStarSymbol } from '@/components/african-symbols/AfricanSymbols';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockEmployees, mockServices, mockSalon } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];

export default function ClientsPage() {
  const { clients, addAppointment } = useAppointments();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    serviceId: '',
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    notes: '',
    source: 'website' as 'website' | 'whatsapp' | 'phone' | 'walk_in',
  });

  const coiffeurs = mockEmployees.filter(e => e.role === 'coiffeur');

  const filteredClients = clients.filter(client => 
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-fade-in-left">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg relative">
                <Users className="w-6 h-6 text-primary" />
                <div className="absolute -top-1 -right-1">
                  <AkomaSymbol size={14} animated={true} color="green" />
                </div>
              </div>
              Clients
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <AfricanStarSymbol size={16} animated={true} color="yellow" />
              {clients.length} clients enregistrés
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-md hover:shadow-glow-primary transition-all duration-300 hover:scale-105">
                <Plus className="w-4 h-4" />
                Nouveau client
              </Button>
            </DialogTrigger>
            <DialogContent className="border border-border rounded-xl animate-scale-in">
              <DialogHeader>
                <DialogTitle>Ajouter un client</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" placeholder="Prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" placeholder="Nom" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="+33 6 XX XX XX XX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Input id="notes" placeholder="Préférences, allergies..." />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="shadow-md hover:shadow-glow-primary">Enregistrer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative animate-fade-in">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un client..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl border-border focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Client list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client, index) => (
            <div 
              key={client.id}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-gabon flex items-center justify-center font-bold text-lg rounded-full shadow-md group-hover:shadow-glow group-hover:scale-110 transition-all duration-300 relative">
                    <span className="z-10">{client.firstName[0]}{client.lastName[0]}</span>
                    <div className="absolute -top-1 -right-1 opacity-80">
                      <AfricanStarSymbol size={12} animated={true} color="yellow" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">{client.firstName} {client.lastName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Client depuis {new Date(client.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground group-hover:translate-x-1 transition-transform">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group-hover:translate-x-1 transition-transform delay-75">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
                {client.lastVisit && (
                  <div className="flex items-center gap-2 text-muted-foreground group-hover:translate-x-1 transition-transform delay-100">
                    <Calendar className="w-4 h-4" />
                    <span>Dernière visite: {new Date(client.lastVisit).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                <Link to={`/clients/${client.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full hover:scale-105 transition-transform">
                  Voir profil
                </Button>
                </Link>
                <Button 
                  size="sm" 
                  className="flex-1 hover:scale-105 transition-transform shadow-sm hover:shadow-glow-primary"
                  onClick={() => {
                    setSelectedClientId(client.id);
                    setIsAppointmentDialogOpen(true);
                  }}
                >
                  Nouveau RDV
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-xl animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Aucun client trouvé</p>
          </div>
        )}

        {/* Dialog pour créer un rendez-vous */}
        <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
          <DialogContent className="border border-border rounded-xl animate-scale-in max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau rendez-vous</DialogTitle>
            </DialogHeader>
            
            {/* Option WhatsApp */}
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <div>
                    <span className="text-sm font-medium text-green-900 dark:text-green-100 block">Réserver via WhatsApp</span>
                    <span className="text-xs text-green-700 dark:text-green-300">Échangez avec le client puis créez le RDV</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                  onClick={() => {
                    const client = clients.find(c => c.id === selectedClientId);
                    if (!client) return;
                    
                    const salonPhone = mockSalon.phone || '+241 06 12 34 56 78';
                    const phoneNumber = salonPhone.replace(/\s/g, '').replace(/\+/g, '');
                    const message = encodeURIComponent(
                      `Bonjour ${client.firstName},\n\n` +
                      `Je vous contacte concernant une réservation au ${mockSalon.name}.\n\n` +
                      `Pouvez-vous me confirmer vos disponibilités ?\n\n` +
                      `Merci !`
                    );
                    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                    
                    // Marquer comme réservation WhatsApp pour le formulaire
                    setAppointmentForm(prev => ({ ...prev, source: 'whatsapp' as const }));
                    
                    toast({
                      title: "WhatsApp ouvert",
                      description: "Après votre échange avec le client, remplissez le formulaire ci-dessous pour créer le rendez-vous.",
                    });
                  }}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Ouvrir WhatsApp
                </Button>
              </div>
              {appointmentForm.source === 'whatsapp' && (
                <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                    <MessageCircle className="w-3 h-3" />
                    <span>Ce rendez-vous sera marqué comme réservé via WhatsApp</span>
                  </div>
                </div>
              )}
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedClientId || !appointmentForm.serviceId || !appointmentForm.employeeId || !appointmentForm.date || !appointmentForm.startTime) {
                  toast({
                    title: "Erreur",
                    description: "Veuillez remplir tous les champs obligatoires.",
                    variant: "destructive",
                  });
                  return;
                }

                try {
                  const newAppointment = addAppointment({
                    clientId: selectedClientId,
                    serviceId: appointmentForm.serviceId,
                    employeeId: appointmentForm.employeeId,
                    salonId: mockSalon.id,
                    date: appointmentForm.date,
                    startTime: appointmentForm.startTime,
                    notes: appointmentForm.notes || undefined,
                    source: appointmentForm.source,
                  });

                  toast({
                    title: "Rendez-vous créé",
                    description: "Le rendez-vous a été créé avec succès.",
                  });

                  setIsAppointmentDialogOpen(false);
                  setAppointmentForm({
                    serviceId: '',
                    employeeId: '',
                    date: new Date().toISOString().split('T')[0],
                    startTime: '',
                    notes: '',
                    source: 'website',
                  });
                  setSelectedClientId(null);
                  
                  // Rediriger vers la page des rendez-vous
                  navigate('/appointments');
                } catch (error) {
                  toast({
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la création du rendez-vous.",
                    variant: "destructive",
                  });
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Client</Label>
                <Input 
                  value={selectedClientId ? clients.find(c => c.id === selectedClientId)?.firstName + ' ' + clients.find(c => c.id === selectedClientId)?.lastName : ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>Service *</Label>
                <Select 
                  value={appointmentForm.serviceId}
                  onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, serviceId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockServices.filter(s => s.isActive).map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - {service.price.toLocaleString()} FCFA ({service.duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Coiffeur *</Label>
                <Select 
                  value={appointmentForm.employeeId}
                  onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, employeeId: value }))}
                >
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
                  <Label htmlFor="appointment-date">Date *</Label>
                  <Input 
                    id="appointment-date" 
                    type="date" 
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment-time">Heure *</Label>
                  <Select 
                    value={appointmentForm.startTime}
                    onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, startTime: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment-notes">Notes (optionnel)</Label>
                <Input 
                  id="appointment-notes" 
                  placeholder="Préférences, allergies, demandes spéciales..."
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAppointmentDialogOpen(false);
                    setAppointmentForm({
                      serviceId: '',
                      employeeId: '',
                      date: new Date().toISOString().split('T')[0],
                      startTime: '',
                      notes: '',
                      source: 'website',
                    });
                    setSelectedClientId(null);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" className="shadow-md hover:shadow-glow-primary">
                  Créer le RDV
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
