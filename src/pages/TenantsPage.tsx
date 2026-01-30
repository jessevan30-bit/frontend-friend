import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Building2, Users, Calendar, CreditCard, MoreHorizontal, Eye, Edit, Trash2, Plus, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/hooks/use-toast';
import { Salon } from '@/types';

// Interface pour les données tenant étendues
interface TenantData extends Salon {
  status: string;
  plan: string;
  createdAt: string;
  clientsCount: number;
  appointmentsCount: number;
  revenue: number;
}

// Mock data pour les tenants
const mockTenants: TenantData[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

const statusConfig = {
  active: { label: 'Actif', className: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  suspended: { label: 'Suspendu', className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' },
  inactive: { label: 'Inactif', className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400' },
};

const planConfig = {
  Basic: { className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  Standard: { className: 'bg-purple-500/10 text-purple-700 dark:text-purple-400' },
  Premium: { className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
};

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectTenant } = useAdmin();
  const navigate = useNavigate();

  const handleViewTenant = (tenant: any) => {
    // Convertir le tenant en Salon pour la sélection
    const salon: Salon = {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      openingHours: tenant.openingHours || '8h00 - 18h00',
      currency: tenant.currency || 'XAF',
      timezone: tenant.timezone || 'Africa/Libreville',
    };
    
    selectTenant(salon);
    toast({
      title: "Tenant sélectionné",
      description: `Vous explorez maintenant le dashboard de ${salon.name}`,
    });
    navigate('/admin');
  };

  const filteredTenants = mockTenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = mockTenants.reduce((sum, t) => sum + t.revenue, 0);
  const activeTenants = mockTenants.filter(t => t.status === 'active').length;
  const totalClients = mockTenants.reduce((sum, t) => sum + t.clientsCount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-fade-in-left">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              Gestion des Tenants
            </h1>
            <p className="text-muted-foreground mt-1">
              Administration de tous les salons (tenants) du système
            </p>
          </div>
          
          <Link to="/admin/tenants/new">
            <Button className="gap-2 shadow-md hover:shadow-glow-primary transition-all duration-300 hover:scale-105">
              <Plus className="w-4 h-4" />
              Nouveau tenant
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total tenants</p>
                <p className="text-2xl font-bold">{mockTenants.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tenants actifs</p>
                <p className="text-2xl font-bold">{activeTenants}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total clients</p>
                <p className="text-2xl font-bold">{totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenus totaux</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative animate-fade-in">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un tenant par nom, email ou adresse..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl border-border focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Tenants list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTenants.map((tenant, index) => (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Link to={`/admin/tenants/${tenant.id}`}>
                      <h3 className="font-bold group-hover:text-primary transition-colors cursor-pointer hover:underline">
                        {tenant.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Créé le {new Date(tenant.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewTenant(tenant)}>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Explorer le dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/tenants/${tenant.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Email:</span>
                  <span className="truncate">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Téléphone:</span>
                  <span>{tenant.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Adresse:</span>
                  <span className="truncate">{tenant.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={cn("text-xs", statusConfig[tenant.status as keyof typeof statusConfig].className)}>
                  {statusConfig[tenant.status as keyof typeof statusConfig].label}
                </Badge>
                <Badge className={cn("text-xs", planConfig[tenant.plan as keyof typeof planConfig].className)}>
                  {tenant.plan}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Clients</p>
                  <p className="text-sm font-bold">{tenant.clientsCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">RDV</p>
                  <p className="text-sm font-bold">{tenant.appointmentsCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Revenus</p>
                  <p className="text-sm font-bold text-primary">{tenant.revenue.toLocaleString()} FCFA</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTenants.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-xl animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Aucun tenant trouvé</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

