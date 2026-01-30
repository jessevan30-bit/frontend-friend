import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Save, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Salon } from '@/types';
import { motion } from 'framer-motion';

// Mock data - Dans une vraie app, cela viendrait de l'API
const mockTenantData = {
  'tenant-1': {
    id: 'tenant-1',
    name: 'Salon Mireille',
    email: 'contact@salon-mireille.ga',
    phone: '+241 06 12 34 56 78',
    address: 'Avenue Léon Mba, Libreville, Gabon',
    openingHours: '8h00 - 18h00',
    currency: 'XAF',
    timezone: 'Africa/Libreville',
    logo: '',
    heroImage: '',
  },
  'tenant-2': {
    id: 'tenant-2',
    name: 'Coiffure Awa',
    email: 'contact@coiffure-awa.ga',
    phone: '+241 06 23 45 67 89',
    address: 'Boulevard Triomphal, Libreville, Gabon',
    openingHours: '9h00 - 19h00',
    currency: 'XAF',
    timezone: 'Africa/Libreville',
    logo: '',
    heroImage: '',
  },
  'tenant-3': {
    id: 'tenant-3',
    name: 'Studio Koffi',
    email: 'contact@studio-koffi.ga',
    phone: '+241 06 34 56 78 90',
    address: 'Quartier Louis, Port-Gentil, Gabon',
    openingHours: '8h00 - 18h00',
    currency: 'XAF',
    timezone: 'Africa/Libreville',
    logo: '',
    heroImage: '',
  },
  'tenant-4': {
    id: 'tenant-4',
    name: 'Salon Fatou',
    email: 'contact@salon-fatou.ga',
    phone: '+241 06 45 67 89 01',
    address: 'Avenue de la République, Libreville, Gabon',
    openingHours: '8h00 - 17h00',
    currency: 'XAF',
    timezone: 'Africa/Libreville',
    logo: '',
    heroImage: '',
  },
  'tenant-5': {
    id: 'tenant-5',
    name: 'Beauté Mba',
    email: 'contact@beaute-mba.ga',
    phone: '+241 06 56 78 90 12',
    address: 'Centre-ville, Franceville, Gabon',
    openingHours: '9h00 - 19h00',
    currency: 'XAF',
    timezone: 'Africa/Libreville',
    logo: '',
    heroImage: '',
  },
};

export default function EditTenantPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState<Partial<Salon>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    openingHours: '8h00 - 18h00',
    currency: 'XAF',
    timezone: 'Africa/Libreville',
    logo: '',
    heroImage: '',
  });

  // Charger les données du tenant
  useEffect(() => {
    if (id) {
      setIsLoadingData(true);
      // Simuler le chargement des données
      setTimeout(() => {
        const tenant = mockTenantData[id as keyof typeof mockTenantData];
        if (tenant) {
          setFormData({
            name: tenant.name,
            email: tenant.email,
            phone: tenant.phone,
            address: tenant.address,
            openingHours: tenant.openingHours,
            currency: tenant.currency,
            timezone: tenant.timezone,
            logo: tenant.logo || '',
            heroImage: tenant.heroImage || '',
          });
        } else {
          toast({
            title: "Tenant introuvable",
            description: "Le tenant demandé n'existe pas.",
            variant: "destructive",
          });
          navigate('/admin/tenants');
        }
        setIsLoadingData(false);
      }, 500);
    }
  }, [id, navigate]);

  const handleChange = (field: keyof Salon, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validation téléphone (format gabonais)
    const phoneRegex = /^\+241\s?0[6-7]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast({
        title: "Téléphone invalide",
        description: "Format attendu: +241 06 12 34 56 78",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Ici, on ferait l'appel API réel pour mettre à jour le tenant
      // const response = await api.put(`/admin/tenants/${id}`, formData);

      toast({
        title: "Tenant modifié avec succès",
        description: `Le salon "${formData.name}" a été modifié avec succès.`,
      });

      // Rediriger vers la page de détails
      navigate(`/admin/tenants/${id}`);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du tenant.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Chargement des données...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/admin/tenants/${id}`)}
            className="hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Modifier le Tenant</h1>
              <p className="text-muted-foreground text-sm">
                Modifier les informations du salon
              </p>
            </div>
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-xl p-6 space-y-6"
        >
          {/* Informations de base */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Informations de base
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nom du salon <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Salon Mireille, Coiffure Awa, Studio Koffi"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: contact@salon-mireille.ga"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Téléphone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ex: +241 06 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Format: +241 06 12 34 56 78
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Adresse <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Ex: Avenue Léon Mba, Libreville, Gabon"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openingHours" className="text-sm font-medium">
                  Heures d'ouverture
                </Label>
                <Input
                  id="openingHours"
                  placeholder="Ex: 8h00 - 18h00"
                  value={formData.openingHours}
                  onChange={(e) => handleChange('openingHours', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">
                  Devise
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleChange('currency', value)}
                >
                  <SelectTrigger id="currency" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XAF">Franc CFA (XAF)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="USD">Dollar US (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-sm font-medium">
                  Fuseau horaire
                </Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleChange('timezone', value)}
                >
                  <SelectTrigger id="timezone" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Libreville">Africa/Libreville (GMT+1)</SelectItem>
                    <SelectItem value="Africa/Douala">Africa/Douala (GMT+1)</SelectItem>
                    <SelectItem value="Africa/Abidjan">Africa/Abidjan (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Options avancées */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Options avancées (optionnel)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-sm font-medium">
                  URL du logo
                </Label>
                <Input
                  id="logo"
                  type="url"
                  placeholder="https://exemple.com/logo.png"
                  value={formData.logo || ''}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroImage" className="text-sm font-medium">
                  URL de l'image hero
                </Label>
                <Input
                  id="heroImage"
                  type="url"
                  placeholder="https://exemple.com/hero.jpg"
                  value={formData.heroImage || ''}
                  onChange={(e) => handleChange('heroImage', e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/admin/tenants/${id}`)}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px] bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Modification...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </DashboardLayout>
  );
}

