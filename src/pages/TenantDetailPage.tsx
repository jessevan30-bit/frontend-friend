import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Globe, 
  CreditCard,
  Users,
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/hooks/use-toast';
import { Salon } from '@/types';

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
    status: 'active',
    plan: 'Premium',
    createdAt: '2024-01-15',
    clientsCount: 156,
    appointmentsCount: 45,
    revenue: 12800,
    monthlyRevenue: 45000,
    growth: 12.5,
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
    status: 'active',
    plan: 'Standard',
    createdAt: '2024-02-20',
    clientsCount: 89,
    appointmentsCount: 32,
    revenue: 7800,
    monthlyRevenue: 32000,
    growth: 8.3,
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
    status: 'active',
    plan: 'Premium',
    createdAt: '2024-03-10',
    clientsCount: 124,
    appointmentsCount: 38,
    revenue: 10200,
    monthlyRevenue: 41000,
    growth: 15.2,
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
    status: 'suspended',
    plan: 'Basic',
    createdAt: '2024-04-05',
    clientsCount: 45,
    appointmentsCount: 12,
    revenue: 2100,
    monthlyRevenue: 8500,
    growth: -5.2,
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
    status: 'active',
    plan: 'Standard',
    createdAt: '2024-05-12',
    clientsCount: 67,
    appointmentsCount: 25,
    revenue: 4500,
    monthlyRevenue: 18000,
    growth: 6.7,
  },
};

const statusConfig = {
  active: { 
    label: 'Actif', 
    icon: CheckCircle2,
    className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' 
  },
  suspended: { 
    label: 'Suspendu', 
    icon: AlertCircle,
    className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20' 
  },
  inactive: { 
    label: 'Inactif', 
    icon: XCircle,
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20' 
  },
};

const planConfig = {
  Basic: { 
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    price: '5 000 FCFA/mois'
  },
  Standard: { 
    className: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    price: '15 000 FCFA/mois'
  },
  Premium: { 
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    price: '30 000 FCFA/mois'
  },
};

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectTenant } = useAdmin();
  const [isDeleting, setIsDeleting] = useState(false);

  const tenant = id ? mockTenantData[id as keyof typeof mockTenantData] : null;

  if (!tenant) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Building2 className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Tenant introuvable</h2>
          <p className="text-muted-foreground">Le tenant demandé n'existe pas.</p>
          <Button onClick={() => navigate('/admin/tenants')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const StatusIcon = statusConfig[tenant.status as keyof typeof statusConfig].icon;

  const handleExploreDashboard = () => {
    const salon: Salon = {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      openingHours: tenant.openingHours,
      currency: tenant.currency,
      timezone: tenant.timezone,
    };
    
    selectTenant(salon);
    toast({
      title: "Tenant sélectionné",
      description: `Vous explorez maintenant le dashboard de ${salon.name}`,
    });
    navigate('/admin');
  };

  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le tenant "${tenant.name}" ? Cette action est irréversible.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Tenant supprimé",
        description: `Le tenant "${tenant.name}" a été supprimé avec succès.`,
      });
      
      navigate('/admin/tenants');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/admin/tenants')}
              className="hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{tenant.name}</h1>
                <p className="text-muted-foreground text-sm">
                  Détails du tenant
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleExploreDashboard}
              className="gap-2 bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground"
            >
              <ArrowRight className="w-4 h-4" />
              Explorer le dashboard
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/admin/tenants/${id}/edit`} className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Statuts et plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Badge 
            className={cn(
              "px-3 py-1.5 text-sm font-medium border flex items-center gap-2",
              statusConfig[tenant.status as keyof typeof statusConfig].className
            )}
          >
            <StatusIcon className="w-4 h-4" />
            {statusConfig[tenant.status as keyof typeof statusConfig].label}
          </Badge>
          <Badge 
            className={cn(
              "px-3 py-1.5 text-sm font-medium border",
              planConfig[tenant.plan as keyof typeof planConfig].className
            )}
          >
            {tenant.plan} - {planConfig[tenant.plan as keyof typeof planConfig].price}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Créé le {new Date(tenant.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <p className="text-2xl font-bold">{tenant.clientsCount}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rendez-vous
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <p className="text-2xl font-bold">{tenant.appointmentsCount}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Revenus (mois)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <p className="text-2xl font-bold">{tenant.monthlyRevenue.toLocaleString()} FCFA</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Croissance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className={cn(
                    "w-5 h-5",
                    tenant.growth >= 0 ? "text-green-600" : "text-red-600"
                  )} />
                  <p className={cn(
                    "text-2xl font-bold",
                    tenant.growth >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {tenant.growth >= 0 ? '+' : ''}{tenant.growth}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Informations de contact
                </CardTitle>
                <CardDescription>
                  Coordonnées et informations du salon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{tenant.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                    <p className="text-sm">{tenant.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                    <p className="text-sm">{tenant.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Paramètres et préférences du salon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Heures d'ouverture</p>
                    <p className="text-sm">{tenant.openingHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Devise</p>
                    <p className="text-sm">{tenant.currency} (Franc CFA)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Fuseau horaire</p>
                    <p className="text-sm">{tenant.timezone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

