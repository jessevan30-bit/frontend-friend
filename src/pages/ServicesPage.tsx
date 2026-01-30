import { useState } from 'react';
import { Plus, Scissors, Users, User, UserCircle, Baby } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockServices as initialServices, mockCategories, getCategoryById } from '@/data/mockData';
import { ServiceCard } from '@/components/services';
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
import { cn } from '@/lib/utils';
import { Service } from '@/types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePublishChange = (service: Service, isPublished: boolean) => {
    setServices(services.map(s => s.id === service.id ? { ...s, isPublished } : s));
  };

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.categoryId === selectedCategory;
    const matchesTarget = selectedTarget === 'all' || (s.target === selectedTarget && s.target !== 'unisex');
    return matchesCategory && matchesTarget;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-fade-in-left">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
              Services
            </h1>
            <p className="text-muted-foreground mt-1">{services.length} services disponibles</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-md hover:shadow-glow-primary transition-all duration-300 hover:scale-105">
                <Plus className="w-4 h-4" />
                Nouveau service
              </Button>
            </DialogTrigger>
            <DialogContent className="border border-border rounded-xl animate-scale-in">
              <DialogHeader>
                <DialogTitle>Ajouter un service</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du service</Label>
                  <Input id="name" placeholder="Ex: Coupe Homme, Tresses Africaines" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type de client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                        <SelectItem value="enfant">Enfant</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée (minutes)</Label>
                    <Input id="duration" type="number" placeholder="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (FCFA)</Label>
                    <Input id="price" type="number" placeholder="25" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Input id="description" placeholder="Décrivez le service en détail..." />
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

        {/* Filtres compacts */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          {/* Filtre par catégorie */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Scissors className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-xs font-medium">Catégorie</Label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="h-7 text-xs px-2"
              >
                Toutes
              </Button>
              {mockCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="h-7 text-xs px-2"
                  style={
                    selectedCategory === category.id
                      ? {
                          backgroundColor: category.color,
                          color: 'white',
                          borderColor: category.color,
                        }
                      : undefined
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Filtre par type de client */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <Label className="text-xs font-medium">Type de client</Label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={selectedTarget === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTarget('all')}
                className="h-7 text-xs px-2"
              >
                Tous
              </Button>
              <Button
                variant={selectedTarget === 'homme' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTarget('homme')}
                className={cn(
                  "h-7 text-xs px-2",
                  selectedTarget === 'homme' && "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                )}
              >
                <User className="w-3 h-3 mr-1" />
                Homme
              </Button>
              <Button
                variant={selectedTarget === 'femme' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTarget('femme')}
                className={cn(
                  "h-7 text-xs px-2",
                  selectedTarget === 'femme' && "bg-pink-600 hover:bg-pink-700 text-white border-pink-600"
                )}
              >
                <UserCircle className="w-3 h-3 mr-1" />
                Femme
              </Button>
              <Button
                variant={selectedTarget === 'enfant' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTarget('enfant')}
                className={cn(
                  "h-7 text-xs px-2",
                  selectedTarget === 'enfant' && "bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600"
                )}
              >
                <Baby className="w-3 h-3 mr-1" />
                Enfant
              </Button>
            </div>
          </div>

          {/* Résumé des filtres actifs */}
          {(selectedCategory !== 'all' || selectedTarget !== 'all') && (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTarget('all');
                }}
                className="h-6 text-xs px-2"
              >
                Réinitialiser
              </Button>
            </div>
          )}
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service, index) => {
            const category = getCategoryById(service.categoryId);
            
            return (
              <ServiceCard
                key={service.id}
                service={service}
                category={category}
                variant="admin"
                index={index}
                onPublishChange={handlePublishChange}
                onEdit={(service) => {
                  // TODO: Implémenter l'édition
                  console.log('Éditer service:', service);
                }}
                onDelete={(service) => {
                  // TODO: Implémenter la suppression
                  console.log('Supprimer service:', service);
                }}
              />
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
