import { PublicLayout } from '@/components/layout/PublicLayout';
import { useTenant } from '@/contexts/TenantContext';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Phone, Mail, Scissors, CheckCircle2, ArrowRight, Banknote, Smartphone, CreditCard, Wallet, MessageCircle, Sparkles, Star, Heart } from 'lucide-react';
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
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <Star className="w-8 h-8 text-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <Heart className="w-8 h-8 text-pink-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
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
        {/* Layout en grille pour desktop */}
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Colonne principale : Formulaire */}
            <div className="lg:col-span-2 space-y-8">
              {/* Indicateur de progression */}
              <div className="bg-card border border-border rounded-xl p-4 lg:p-6 shadow-sm">
                <div className="flex items-center justify-between relative">
                  {/* Ligne de fond */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-secondary -z-0 mx-4" />

                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: step === s ? 1.2 : 1,
                          backgroundColor: step >= s ? "hsl(var(--primary))" : "hsl(var(--secondary))"
                        }}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-300",
                          step >= s ? "text-primary-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                      </motion.div>
                      <span className={cn(
                        "text-xs font-medium absolute -bottom-6 w-max transition-colors duration-300",
                        step >= s ? "text-primary" : "text-muted-foreground hidden lg:block"
                      )}>
                        {s === 1 && "Infos"}
                        {s === 2 && "Service"}
                        {s === 3 && "Date"}
                        {s === 4 && "Paiement"}
                      </span>
                    </div>
                  ))}

                  {/* Ligne de progression active */}
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-0 mx-4 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: (step - 1) / 3 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ right: 0 }}
                  />
                </div>
                <div className="h-4 lg:hidden" /> {/* Espacement pour mobile labels */}
              </div>

              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-sm space-y-6">
                {/* Étape 1 : Informations personnelles */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Vos informations</h2>
                        <p className="text-sm text-muted-foreground">Pour vous contacter au sujet de votre RDV</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                          placeholder="Ex: Awa, Fatou"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                          placeholder="Ex: Diallo, Traoré"
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="Ex: mon.email@exemple.com"
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          placeholder="Ex: +241 06 12 34 56"
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!canProceedToStep2}
                        className="gap-2 px-8"
                        size="lg"
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
                    <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Service & Coiffeur</h2>
                        <p className="text-sm text-muted-foreground">Choisissez votre prestation et votre expert</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Service souhaité *</Label>
                        <Select
                          value={formData.serviceId}
                          onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                        >
                          <SelectTrigger className="h-12 border-primary/20 focus:border-primary">
                            <SelectValue placeholder="Sélectionner un service..." />
                          </SelectTrigger>
                          <SelectContent>
                            {mockServices.filter(s => s.isActive).map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                <div className="flex items-center justify-between w-full gap-2">
                                  <span>{service.name}</span>
                                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{service.price} FCFA</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedService && (
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-4 items-start">
                          <img
                            src={selectedService.image || getServiceImage(selectedService.id, 100, 100)}
                            alt={selectedService.name}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-semibold text-primary">{selectedService.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{selectedService.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs font-medium">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedService.duration} min</span>
                              <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> {selectedService.price} FCFA</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label>Coiffeur préféré *</Label>
                      <Select
                        value={formData.employeeId}
                        onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Choisir un coiffeur..." />
                        </SelectTrigger>
                        <SelectContent>
                          {coiffeurs.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                                  {emp.firstName[0]}
                                </div>
                                {emp.firstName} {emp.lastName}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between pt-6 border-t border-border mt-8">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} size="lg">
                        Précédent
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!canProceedToStep3}
                        className="gap-2"
                        size="lg"
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
                    <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Date & Heure</h2>
                        <p className="text-sm text-muted-foreground">Quand souhaitez-vous venir ?</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal h-12",
                                !formData.date && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {formData.date ? format(formData.date, 'dd MMMM yyyy') : "Choisir une date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={formData.date}
                              onSelect={(date) => setFormData({ ...formData, date: date })}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="rounded-md border shadow-lg"
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
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Choisir une heure" />
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
                      <Label htmlFor="notes">Notes pour le coiffeur (optionnel)</Label>
                      <Input
                        id="notes"
                        placeholder="Ex: Cheveux crépus, allergies..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div className="flex justify-between pt-6 border-t border-border mt-8">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} size="lg">
                        Précédent
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canProceedToStep4 || isSubmitting}
                        className="gap-2 min-w-[200px]"
                        size="lg"
                      >
                        {isSubmitting ? 'Validation...' : 'Continuer vers le paiement'}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Étape 4 : Paiement */}
                {step === 4 && createdAppointment && selectedService && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Paiement</h2>
                        <p className="text-sm text-muted-foreground">Sécurisez votre rendez-vous</p>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Total à payer</h3>
                        <span className="text-2xl font-bold text-primary">{selectedService.price} FCFA</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Le paiement sécurise votre créneau. Annulation gratuite jusqu'à 24h avant.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Moyen de paiement *</Label>

                      {/* Airtel Money */}
                      <div
                        className={cn(
                          "relative overflow-hidden border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md",
                          formData.paymentMethod === 'airtel_money'
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'airtel_money' })}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                            formData.paymentMethod === 'airtel_money' ? "border-primary bg-primary" : "border-muted-foreground"
                          )}>
                            {formData.paymentMethod === 'airtel_money' && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                            <Smartphone className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">Airtel Money</p>
                            <p className="text-sm text-muted-foreground">Paiement mobile instantané</p>
                          </div>
                        </div>

                        {formData.paymentMethod === 'airtel_money' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t border-border/50 pl-8"
                          >
                            <Label htmlFor="airtelMoneyNumber">Votre numéro Airtel Money</Label>
                            <Input
                              id="airtelMoneyNumber"
                              type="tel"
                              placeholder="06 00 00 00"
                              value={formData.airtelMoneyNumber}
                              onChange={(e) => setFormData({ ...formData, airtelMoneyNumber: e.target.value })}
                              className="mt-2 bg-white"
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* Cash */}
                      <div
                        className={cn(
                          "border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md",
                          formData.paymentMethod === 'cash_on_arrival'
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'cash_on_arrival' })}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                            formData.paymentMethod === 'cash_on_arrival' ? "border-primary bg-primary" : "border-muted-foreground"
                          )}>
                            {formData.paymentMethod === 'cash_on_arrival' && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                            <Banknote className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">Paiement sur place</p>
                            <p className="text-sm text-muted-foreground">Espèces ou carte au salon</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t border-border mt-8">
                      <Button type="button" variant="outline" onClick={() => setStep(3)} size="lg">
                        Précédent
                      </Button>
                      <Button
                        type="button"
                        onClick={handlePayment}
                        disabled={!canSubmitPayment || isSubmitting}
                        className="gap-2 min-w-[220px]"
                        size="lg"
                      >
                        {isSubmitting
                          ? (formData.paymentMethod === 'airtel_money' ? 'Envoi demande...' : 'Confirmation...')
                          : 'Confirmer la réservation'
                        }
                        {!isSubmitting && <CheckCircle2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Colonne latérale : Résumé permanent (Visible sur toutes les étapes) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Carte du service sélectionné */}
                {selectedService ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl overflow-hidden shadow-lg"
                  >
                    <div className="h-32 bg-secondary relative overflow-hidden">
                      <img
                        src={selectedService.image || getServiceImage(selectedService.id, 400, 200)}
                        alt={selectedService.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-4 text-white">
                        <p className="text-xs font-medium opacity-80">Service sélectionné</p>
                        <h3 className="font-bold text-lg leading-tight">{selectedService.name}</h3>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-border">
                        <div>
                          <p className="text-sm text-muted-foreground">Prix</p>
                          <p className="font-bold text-xl text-primary">{selectedService.price} FCFA</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Durée</p>
                          <p className="font-bold">{selectedService.duration} min</p>
                        </div>
                      </div>

                      {/* Récapitulatif dynamique des choix */}
                      <div className="space-y-3">
                        {formData.date && (
                          <div className="flex items-center gap-3 text-sm animate-fade-in">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{format(formData.date, 'EEEE d MMMM yyyy')}</span>
                          </div>
                        )}
                        {formData.time && (
                          <div className="flex items-center gap-3 text-sm animate-fade-in">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>à {formData.time}</span>
                          </div>
                        )}
                        {formData.employeeId && (
                          <div className="flex items-center gap-3 text-sm animate-fade-in">
                            <User className="w-4 h-4 text-primary" />
                            <span>avec {coiffeurs.find(c => c.id === formData.employeeId)?.firstName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Scissors className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Aucun service</h3>
                    <p className="text-sm text-muted-foreground">
                      Veuillez sélectionner un service pour voir le récapitulatif ici.
                    </p>
                  </div>
                )}

                {/* Carte aide / contact rapide */}
                <div className="bg-secondary/30 border border-secondary rounded-xl p-5">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Besoin d'aide ?
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Appelez-nous directement si vous ne trouvez pas de créneau qui vous convient.
                  </p>
                  <a href="tel:+24100000000" className="text-sm font-medium text-primary hover:underline">
                    +241 00 00 00 00
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </PublicLayout >
  );
}

