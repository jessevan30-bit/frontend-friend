import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { mockSalon } from '@/data/mockData';
import { Building, Clock, Globe, CreditCard, Bell, Shield, Palette, RotateCcw } from 'lucide-react';
import { BrandingFooter } from '@/components/branding';
import { useTenantTheme } from '@/contexts/TenantThemeContext';
import { ColorPicker } from '@/components/theme/ColorPicker';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { theme, updateTheme, resetTheme } = useTenantTheme();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Thème enregistré",
        description: "Vos préférences de thème ont été enregistrées et appliquées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
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
              <Input 
                id="salonName" 
                defaultValue={mockSalon.name}
                placeholder="Ex: Salon Mireille, Coiffure Awa, Studio Koffi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone" 
                defaultValue={mockSalon.phone}
                placeholder="Ex: +241 06 12 34 56 78"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={mockSalon.email}
                placeholder="Ex: contact@salon-mireille.ga"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input 
                id="address" 
                defaultValue={mockSalon.address}
                placeholder="Ex: Avenue Léon Mba, Libreville, Gabon"
              />
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
              <Input defaultValue="XAF (FCFA)" disabled placeholder="Franc CFA (XAF)" />
            </div>
            <div className="space-y-2">
              <Label>Fuseau horaire</Label>
              <Input defaultValue="Africa/Libreville" disabled placeholder="Africa/Libreville (GMT+1)" />
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

        {/* Theme Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border-2 border-border p-6 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5" />
              <div>
                <h2 className="text-lg font-bold">Personnalisation du thème</h2>
                <p className="text-sm text-muted-foreground">
                  Personnalisez les couleurs de votre site public
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetTheme}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorPicker
              label="Couleur principale"
              value={theme.primaryColor || '15 70% 45%'}
              onChange={(color) => updateTheme({ primaryColor: color })}
              description="Couleur principale utilisée pour les boutons et éléments importants"
            />
            
            <ColorPicker
              label="Couleur secondaire"
              value={theme.secondaryColor || '35 35% 92%'}
              onChange={(color) => updateTheme({ secondaryColor: color })}
              description="Couleur secondaire pour les arrière-plans et éléments secondaires"
            />
            
            <ColorPicker
              label="Couleur d'accent"
              value={theme.accentColor || '42 85% 55%'}
              onChange={(color) => updateTheme({ accentColor: color })}
              description="Couleur d'accent pour les éléments mis en évidence"
            />
            
            <ColorPicker
              label="Couleur de fond"
              value={theme.backgroundColor || '35 30% 97%'}
              onChange={(color) => updateTheme({ backgroundColor: color })}
              description="Couleur de fond principale du site"
            />
            
            <ColorPicker
              label="Couleur du texte"
              value={theme.textColor || '25 40% 15%'}
              onChange={(color) => updateTheme({ textColor: color })}
              description="Couleur principale du texte"
            />
            
            <ColorPicker
              label="Couleur des boutons"
              value={theme.buttonColor || '15 70% 45%'}
              onChange={(color) => updateTheme({ buttonColor: color })}
              description="Couleur des boutons principaux"
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Aperçu du thème</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-border"
                  style={{ backgroundColor: `hsl(${theme.primaryColor || '15 70% 45%'})` }}
                />
                <div
                  className="w-16 h-16 rounded-lg border-2 border-border"
                  style={{ backgroundColor: `hsl(${theme.secondaryColor || '35 35% 92%'})` }}
                />
                <div
                  className="w-16 h-16 rounded-lg border-2 border-border"
                  style={{ backgroundColor: `hsl(${theme.accentColor || '42 85% 55%'})` }}
                />
                <div
                  className="w-16 h-16 rounded-lg border-2 border-border"
                  style={{ backgroundColor: `hsl(${theme.backgroundColor || '35 30% 97%'})` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Les modifications sont appliquées en temps réel. Visitez votre site public pour voir les changements.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <div className="bg-card border-2 border-border p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Shield className="w-5 h-5" />
            <h2 className="text-lg font-bold">Sécurité</h2>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" asChild>
              <Link to="/settings/change-password">Changer le mot de passe</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/settings/sessions">Gérer les sessions actives</Link>
            </Button>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Annuler</Button>
          <Button 
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>

        {/* Branding */}
        <div className="mt-12 pt-8 border-t border-border">
          <BrandingFooter variant="admin" />
        </div>
      </div>
    </DashboardLayout>
  );
}
