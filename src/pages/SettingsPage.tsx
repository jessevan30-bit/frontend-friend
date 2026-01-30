import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { mockSalon } from '@/data/mockData';
import { Building, Clock, Globe, CreditCard, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Configuration du salon et préférences</p>
        </div>

        {/* Salon info */}
        <div className="bg-card border-2 border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Building className="w-5 h-5" />
            <h2 className="text-lg font-bold">Informations du salon</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salonName">Nom du salon</Label>
              <Input id="salonName" defaultValue={mockSalon.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" defaultValue={mockSalon.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={mockSalon.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" defaultValue={mockSalon.address} />
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="bg-card border-2 border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Clock className="w-5 h-5" />
            <h2 className="text-lg font-bold">Horaires d'ouverture</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ouverture</Label>
              <Input type="time" defaultValue="09:00" />
            </div>
            <div className="space-y-2">
              <Label>Fermeture</Label>
              <Input type="time" defaultValue="19:00" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
              <Button 
                key={day} 
                variant={i < 6 ? 'default' : 'outline'}
                size="sm"
              >
                {day}
              </Button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card border-2 border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Globe className="w-5 h-5" />
            <h2 className="text-lg font-bold">Préférences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Devise</Label>
              <Input defaultValue="EUR (€)" disabled />
            </div>
            <div className="space-y-2">
              <Label>Fuseau horaire</Label>
              <Input defaultValue="Europe/Paris" disabled />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border-2 border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Bell className="w-5 h-5" />
            <h2 className="text-lg font-bold">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Rappels de RDV par email</p>
                <p className="text-sm text-muted-foreground">Envoyer un rappel 24h avant le RDV</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Confirmations de RDV</p>
                <p className="text-sm text-muted-foreground">Envoyer un email de confirmation</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications SMS</p>
                <p className="text-sm text-muted-foreground">Activer les notifications SMS (premium)</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-card border-2 border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <CreditCard className="w-5 h-5" />
            <h2 className="text-lg font-bold">Paiements</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Paiement en ligne</p>
                <p className="text-sm text-muted-foreground">Autoriser les paiements lors de la réservation</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Acompte obligatoire</p>
                <p className="text-sm text-muted-foreground">Exiger un acompte pour les réservations</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card border-2 border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Shield className="w-5 h-5" />
            <h2 className="text-lg font-bold">Sécurité</h2>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline">Changer le mot de passe</Button>
            <Button variant="outline">Gérer les sessions actives</Button>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Annuler</Button>
          <Button>Enregistrer les modifications</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
