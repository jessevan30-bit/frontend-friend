import { PublicLayout } from '@/components/layout/PublicLayout';
import { useTenant } from '@/contexts/TenantContext';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Phone, Mail, Scissors, CheckCircle2, ArrowRight, Banknote, Smartphone, CreditCard, Wallet, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockServices, mockEmployees, getServiceById, mockSalon } from '@/data/mockData';
import { HeroSection } from '@/components/public/HeroSection';
import { getPageHeroImage, getServiceImage } from '@/lib/unsplash';
import { motion } from 'framer-motion';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AfricanStarSymbol, AkomaSymbol, SankofaSymbol } from '@/components/african-symbols/AfricanSymbols';
import { toast } from '@/hooks/use-toast';

export default function BookingPage() {
  const { salon } = useTenant();
  const { addAppointment, addClient, addPayment, getClientByEmail } = useAppointments();
  const location = useLocation();
  const navigate = useNavigate();
  const preSelectedServiceId = location.state?.serviceId;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceId: preSelectedServiceId || '',
    employeeId: '',
    date: undefined as Date | undefined,
    time: '',
    notes: '',
    paymentMethod: '' as 'airtel_money' | 'cash_on_arrival' | '',
    airtelMoneyNumber: '',
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);

  const coiffeurs = mockEmployees.filter(e => e.role === 'coiffeur');
  const selectedService = formData.serviceId ? getServiceById(formData.serviceId) : null;

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Vérifier si le client existe déjà
      let client = getClientByEmail(formData.email);
      
      // Si le client n'existe pas, le créer
      if (!client) {
        client = addClient({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes || undefined,
        });
      }

      // Créer la réservation (sans paiement pour l'instant)
      const dateString = formData.date ? format(formData.date, 'yyyy-MM-dd') : '';
      
      const appointment = addAppointment({
        salonId: mockSalon.id,
        clientId: client.id,
        employeeId: formData.employeeId,
        serviceId: formData.serviceId,
        date: dateString,
        startTime: formData.time,
        notes: formData.notes || undefined,
        source: 'website', // Source de la réservation
      });

      setCreatedAppointment(appointment);

      // Simulation d'un délai pour l'UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitting(false);
      setStep(4); // Passer à l'étape de paiement
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre réservation. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!createdAppointment || !selectedService) return;

    setIsSubmitting(true);

    try {
      // Simulation du paiement Airtel Money
      if (formData.paymentMethod === 'airtel_money') {
        // Simulation d'un délai pour le paiement mobile
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: "Paiement Airtel Money en cours...",
          description: "Veuillez confirmer le paiement sur votre téléphone.",
        });

        // Simulation de la confirmation du paiement
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Créer le paiement
      if (createdAppointment && selectedService) {
        addPayment({
          salonId: mockSalon.id,
          appointmentId: createdAppointment.id,
          clientId: createdAppointment.clientId,
          amount: selectedService.price,
          method: formData.paymentMethod as 'airtel_money' | 'cash_on_arrival',
        });
      }

      toast({
        title: "Paiement confirmé !",
        description: formData.paymentMethod === 'airtel_money' 
          ? "Votre paiement Airtel Money a été confirmé."
          : "Vous paierez à votre arrivée au salon.",
      });

      setIsSubmitting(false);
      setStep(5); // Passer à la confirmation finale
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = formData.firstName && formData.lastName && formData.email && formData.phone;
  const canProceedToStep3 = canProceedToStep2 && formData.serviceId && formData.employeeId;
  const canProceedToStep4 = canProceedToStep3 && formData.date && formData.time;
  const canSubmitPayment = canProceedToStep4 && formData.paymentMethod && 
    (formData.paymentMethod === 'cash_on_arrival' || (formData.paymentMethod === 'airtel_money' && formData.airtelMoneyNumber));

  if (step === 5) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center py-20">
          <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center space-y-6 animate-scale-in">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <AfricanStarSymbol size={32} animated={true} color="gradient" />
              <AkomaSymbol size={32} animated={true} color="green" />
              <SankofaSymbol size={32} animated={true} color="blue" />
            </div>
            <h2 className="text-3xl font-bold">Réservation confirmée !</h2>
            <p className="text-muted-foreground">
              {formData.paymentMethod === 'airtel_money' 
                ? "Votre paiement Airtel Money a été confirmé. Votre rendez-vous est confirmé."
                : "Votre réservation est confirmée. Vous paierez à votre arrivée au salon."
              }
            </p>
            <div className="space-y-2 text-sm bg-secondary/50 rounded-lg p-4 w-full">
              <p><strong>Service :</strong> {selectedService?.name}</p>
              <p><strong>Date :</strong> {formData.date && format(formData.date, 'dd MMMM yyyy')}</p>
              <p><strong>Heure :</strong> {formData.time}</p>
              <p><strong>Montant :</strong> {selectedService?.price} FCFA</p>
              <p><strong>Paiement :</strong> {
                formData.paymentMethod === 'airtel_money' 
                  ? `Airtel Money (${formData.airtelMoneyNumber})`
                  : 'À l\'arrivée au salon'
              }</p>
              {createdAppointment && (
                <p className="mt-2 pt-2 border-t border-border">
                  <strong>Référence :</strong> {createdAppointment.id}
                </p>
              )}
            </div>
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/public/services'} 
                className="flex-1"
              >
                Voir autres services
              </Button>
              <Button 
                onClick={() => window.location.href = '/public'} 
                className="flex-1"
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Image unique pour la page réservation - Style afro moderne
  const heroImage = getPageHeroImage('booking', 1920, 1080);

  return (
    <PublicLayout>
      {/* Hero Section avec image */}
      <HeroSection
        backgroundImage={heroImage}
        title={
          <div className="flex items-center justify-center gap-3">
            <Calendar className="w-10 h-10" />
            <span>Réserver un rendez-vous</span>
          </div>
        }
        description="Remplissez le formulaire ci-dessous pour réserver votre créneau"
        decorativeElements={
          <motion.div
            className="absolute top-8 right-8 opacity-30"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Calendar className="w-16 h-16 text-white/30" />
          </motion.div>
        }
      />

      {/* Formulaire de réservation */}
      <section className="py-8 lg:py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Indicateur de progression */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                    step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div className={cn(
                      "flex-1 h-1 mx-2 transition-all",
                      step > s ? "bg-primary" : "bg-secondary"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Informations</span>
              <span>Service</span>
              <span>Date & Heure</span>
              <span>Paiement</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-6">
            {/* Étape 1 : Informations personnelles */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">Vos informations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      placeholder="Ex: Awa, Fatou, Koffi, Mireille"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      placeholder="Ex: Diallo, Traoré, Mba, Nguema"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="Ex: awa.diallo@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="Ex: +241 06 12 34 56 78"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="gap-2"
                  >
                    Suivant
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Étape 2 : Service et coiffeur */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Scissors className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">Service et coiffeur</h2>
                </div>
                <div className="space-y-2">
                  <Label>Service *</Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockServices.filter(s => s.isActive).map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.price} FCFA ({service.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedService && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-secondary/50 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image du service */}
                      <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden bg-secondary">
                        <motion.img
                          src={selectedService.image || getServiceImage(selectedService.id, 400, 300)}
                          alt={selectedService.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      {/* Détails du service */}
                      <div className="flex-1 p-4 flex flex-col justify-center gap-2">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{selectedService.name}</h3>
                            {selectedService.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {selectedService.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{selectedService.duration} min</span>
                              </div>
                              <div className="flex items-center gap-1 font-semibold text-primary">
                                <Banknote className="w-4 h-4" />
                                <span>{selectedService.price} FCFA</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div className="space-y-2">
                  <Label>Coiffeur *</Label>
                  <Select
                    value={formData.employeeId}
                    onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un coiffeur" />
                    </SelectTrigger>
                    <SelectContent>
                      {coiffeurs.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Précédent
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedToStep3}
                    className="gap-2"
                  >
                    Suivant
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Étape 3 : Date et heure */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">Date et heure</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.date && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, 'dd MMMM yyyy') : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => setFormData({ ...formData, date: date })}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Heure *</Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) => setFormData({ ...formData, time: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Input
                    id="notes"
                    placeholder="Préférences, allergies, demandes spéciales..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Précédent
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canProceedToStep4 || isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? 'Création...' : 'Continuer vers le paiement'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Étape 4 : Paiement */}
            {step === 4 && createdAppointment && selectedService && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Wallet className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">Paiement</h2>
                </div>

                {/* Récapitulatif */}
                <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                  <h3 className="font-semibold mb-3">Récapitulatif de votre réservation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service :</span>
                      <span className="font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date :</span>
                      <span className="font-medium">{formData.date && format(formData.date, 'dd MMMM yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Heure :</span>
                      <span className="font-medium">{formData.time}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-muted-foreground">Total :</span>
                      <span className="font-bold text-lg text-primary">{selectedService.price} FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Options de paiement */}
                <div className="space-y-4">
                  <Label>Méthode de paiement *</Label>
                  
                  {/* Airtel Money */}
                  <div
                    className={cn(
                      "border-2 rounded-lg p-4 cursor-pointer transition-all",
                      formData.paymentMethod === 'airtel_money'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setFormData({ ...formData, paymentMethod: 'airtel_money' })}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        formData.paymentMethod === 'airtel_money' ? "border-primary bg-primary" : "border-border"
                      )}>
                        {formData.paymentMethod === 'airtel_money' && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <Smartphone className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold">Airtel Money</p>
                        <p className="text-sm text-muted-foreground">Paiement mobile sécurisé</p>
                      </div>
                    </div>
                    {formData.paymentMethod === 'airtel_money' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <Label htmlFor="airtelMoneyNumber">Numéro Airtel Money *</Label>
                        <Input
                          id="airtelMoneyNumber"
                          type="tel"
                          placeholder="Ex: +241 06 12 34 56 78"
                          value={formData.airtelMoneyNumber}
                          onChange={(e) => setFormData({ ...formData, airtelMoneyNumber: e.target.value })}
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Vous recevrez une demande de confirmation sur votre téléphone
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Paiement à l'arrivée */}
                  <div
                    className={cn(
                      "border-2 rounded-lg p-4 cursor-pointer transition-all",
                      formData.paymentMethod === 'cash_on_arrival'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cash_on_arrival' })}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        formData.paymentMethod === 'cash_on_arrival' ? "border-primary bg-primary" : "border-border"
                      )}>
                        {formData.paymentMethod === 'cash_on_arrival' && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <CreditCard className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-semibold">Paiement à l'arrivée</p>
                        <p className="text-sm text-muted-foreground">Vous paierez directement au salon</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(3)}>
                    Précédent
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePayment}
                    disabled={!canSubmitPayment || isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting 
                      ? (formData.paymentMethod === 'airtel_money' ? 'Traitement...' : 'Confirmation...')
                      : 'Confirmer le paiement'
                    }
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}

