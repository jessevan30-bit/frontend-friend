import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Service } from '@/types';
import { ServiceCategory } from '@/types';
import { Clock, Banknote, Scissors, Pencil, Trash2, ArrowRight, MoreHorizontal, Eye, User, UserCircle, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AkomaSymbol } from '@/components/african-symbols/AfricanSymbols';
import { getServiceImage } from '@/lib/unsplash';

interface ServiceCardProps {
  service: Service;
  category?: ServiceCategory | null;
  variant?: 'admin' | 'public';
  index?: number;
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
  onReserve?: (service: Service) => void;
  onPublishChange?: (service: Service, isPublished: boolean) => void;
  className?: string;
}

export function ServiceCard({
  service,
  category,
  variant = 'admin',
  index = 0,
  onEdit,
  onDelete,
  onReserve,
  onPublishChange,
  className,
}: ServiceCardProps) {
  const isAdmin = variant === 'admin';
  const isPublic = variant === 'public';
  const serviceImage = service.image || getServiceImage(service.id, 800, 600);

  const cardContent = (
    <div
      className={cn(
        "bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 group",
        isAdmin && "hover:shadow-lg hover:-translate-y-1",
        isPublic && "hover:shadow-xl hover:-translate-y-2",
        className
      )}
    >
      {/* Image du service */}
      <div className="relative h-48 overflow-hidden bg-secondary">
        <motion.img
          src={serviceImage}
          alt={service.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
        {isPublic && (
          <div className="absolute top-3 right-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <AkomaSymbol size={20} animated={true} color="yellow" />
            </motion.div>
          </div>
        )}
        {/* Badges catégorie et type de client sur l'image */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 flex-wrap">
          <span
            className="px-2 py-0.5 text-xs font-medium rounded-full shadow-md backdrop-blur-sm"
            style={{
              backgroundColor: category?.color || 'hsl(var(--muted))',
              color: 'white',
            }}
          >
            {category?.name || 'Sans catégorie'}
          </span>
          {service.target && service.target !== 'unisex' && (
            <span
              className={cn(
                "px-2 py-0.5 text-xs font-medium rounded-full shadow-md backdrop-blur-sm flex items-center gap-1",
                service.target === 'homme' && "bg-blue-600 text-white",
                service.target === 'femme' && "bg-pink-600 text-white",
                service.target === 'enfant' && "bg-yellow-600 text-white"
              )}
            >
              {service.target === 'homme' && <><User className="w-3 h-3" /> Homme</>}
              {service.target === 'femme' && <><UserCircle className="w-3 h-3" /> Femme</>}
              {service.target === 'enfant' && <><Baby className="w-3 h-3" /> Enfant</>}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
      {/* Header avec catégorie et actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Nom du service */}
          <h3
            className={cn(
              "font-bold group-hover:text-primary transition-colors",
              isAdmin && "text-lg",
              isPublic && "text-xl mb-2"
            )}
          >
            {service.name}
          </h3>

          {/* Description */}
          {service.description && (
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {service.description}
            </p>
          )}
        </div>

        {/* Menu actions pour admin */}
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Informations durée et prix */}
      <div
        className={cn(
          "flex items-center gap-6 mb-4",
          isPublic && "justify-between"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 transition-transform",
            isAdmin && "group-hover:translate-x-1",
            isPublic && "text-muted-foreground"
          )}
        >
          <div
            className={cn(
              "p-1.5 rounded-lg",
              isAdmin && "bg-secondary",
              isPublic && "bg-primary/10"
            )}
          >
            <Clock
              className={cn(
                "w-4 h-4",
                isAdmin && "text-muted-foreground",
                isPublic && "text-primary"
              )}
            />
          </div>
          <span className={cn(isAdmin && "font-mono", isPublic && "text-sm")}>
            {service.duration} min
          </span>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 transition-transform",
            isAdmin && "group-hover:translate-x-1 delay-75",
            isPublic && "text-primary font-bold text-xl"
          )}
        >
          <div
            className={cn(
              "p-1.5 rounded-lg",
              isAdmin && "bg-accent/30",
              isPublic && "bg-primary/10"
            )}
          >
            <Banknote
              className={cn(
                "w-4 h-4",
                isAdmin && "text-accent-foreground",
                isPublic && "text-primary"
              )}
            />
          </div>
          <span className={cn(isAdmin && "font-bold text-lg text-primary", isPublic && "text-xl")}>
            {service.price} FCFA
          </span>
        </div>
      </div>

      {/* Statut actif/inactif et publication pour admin */}
      {isAdmin && (
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "inline-block px-3 py-1 text-xs font-medium rounded-full",
              service.isActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {service.isActive ? '● Actif' : '○ Inactif'}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id={`publish-${service.id}`}
              checked={service.isPublished}
              onCheckedChange={(isPublished) => onPublishChange?.(service, isPublished)}
              aria-label="Publier le service"
            />
            <Label htmlFor={`publish-${service.id}`} className="text-sm">
              Publié
            </Label>
          </div>
        </div>
      )}
      </div>
      {/* Actions footer */}
      <div
        className={cn(
          "px-5 pb-5 pt-4 border-t border-border",
          isAdmin && "flex gap-2",
          isPublic && "space-y-2"
        )}
      >
        {isAdmin ? (
          <>
            <Link to={`/services/${service.id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 hover:scale-105 transition-transform"
              >
                <Eye className="w-3 h-3" />
                Détails
              </Button>
            </Link>
            <Link to={`/services/${service.id}/edit`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 hover:scale-105 transition-transform"
              >
                <Pencil className="w-3 h-3" />
                Modifier
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-transform hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              onClick={() => onDelete?.(service)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </>
        ) : (
          <>
            <Link to={`/public/services/${service.id}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full gap-2" variant="outline">
                  <Eye className="w-4 h-4" />
                  Voir les détails
                </Button>
              </motion.div>
            </Link>
            <Link to="/public/booking" state={{ serviceId: service.id }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full gap-2">
                  Réserver ce service
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
          </>
        )}
      </div>
    </div>
  );

  // Pour le public, on peut wrapper dans AnimatedCard si nécessaire
  if (isPublic) {
    return cardContent;
  }

  // Pour l'admin, on ajoute l'animation fade-in
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {cardContent}
    </div>
  );
}

