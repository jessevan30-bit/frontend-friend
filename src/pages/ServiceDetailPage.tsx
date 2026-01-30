import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Banknote, Scissors, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { mockServices, mockCategories, getCategoryById, getServiceById } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { AfricanStarSymbol } from '@/components/african-symbols/AfricanSymbols';
import { getServiceImage } from '@/lib/unsplash';
import { motion } from 'framer-motion';

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const service = id ? getServiceById(id) : null;
  const category = service ? getCategoryById(service.categoryId) : null;

  if (!service) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <XCircle className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Service introuvable</h2>
          <p className="text-muted-foreground">Le service demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/services')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux services
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header avec bouton retour */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/services')}
            className="hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
              Détails du service
            </h1>
            <p className="text-muted-foreground mt-1">Informations complètes sur le service</p>
          </div>
        </div>

        {/* Image principale du service */}
        <div className="relative h-96 rounded-xl overflow-hidden bg-secondary group">
          <motion.img
            src={service.image || getServiceImage(service.id, 1920, 800)}
            alt={service.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
          <div className="absolute inset-0 pattern-gabon opacity-10" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-4 py-2 text-sm font-medium rounded-full shadow-lg backdrop-blur-sm"
                style={{
                  backgroundColor: category?.color || 'hsl(var(--muted))',
                  color: 'white',
                }}
              >
                {category?.name || 'Sans catégorie'}
              </span>
              <div
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full backdrop-blur-sm",
                  service.isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                {service.isActive ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Actif
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Inactif
                  </span>
                )}
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">{service.name}</h2>
            {service.description && (
              <p className="text-lg text-white/90 max-w-3xl mt-2 drop-shadow-md">{service.description}</p>
            )}
          </div>
        </div>

        {/* Carte principale */}
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          {/* En-tête avec actions */}
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <h3 className="text-2xl font-bold">Informations détaillées</h3>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => navigate(`/services/${service.id}/edit`)}
              >
                <Pencil className="w-4 h-4" />
                Modifier
              </Button>
              <Button variant="outline" className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AfricanStarSymbol size={20} animated={true} color="gradient" />
                Informations principales
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Durée</p>
                    <p className="text-lg font-semibold">{service.duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Banknote className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prix</p>
                    <p className="text-lg font-semibold text-primary">{service.price} FCFA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AfricanStarSymbol size={20} animated={true} color="gradient" />
                Informations supplémentaires
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">ID du service</p>
                  <p className="font-mono text-sm">{service.id}</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">ID du salon</p>
                  <p className="font-mono text-sm">{service.salonId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques (à venir) */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground">Rendez-vous</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">0 FCFA</p>
                <p className="text-sm text-muted-foreground">Revenus</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground">Clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

