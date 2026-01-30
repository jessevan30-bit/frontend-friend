import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { getServiceById, getCategoryById, mockCategories } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { AfricanStarSymbol } from '@/components/african-symbols/AfricanSymbols';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { getServiceImage } from '@/lib/unsplash';

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const service = id ? getServiceById(id) : null;

  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    duration: service?.duration || 30,
    price: service?.price || 0,
    categoryId: service?.categoryId || '',
    isActive: service?.isActive ?? true,
    image: service?.image || getServiceImage(service?.id || '', 800, 600),
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!service) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <X className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Service introuvable</h2>
          <p className="text-muted-foreground">Le service demandé n'existe pas.</p>
          <Button onClick={() => navigate('/services')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux services
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const selectedCategory = getCategoryById(formData.categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulation d'enregistrement
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Service modifié !",
      description: "Les modifications ont été enregistrées avec succès.",
    });

    setIsSaving(false);
    navigate(`/services/${service.id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/services/${service.id}`)}
            className="hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <AfricanStarSymbol size={24} animated={true} color="gradient" />
              </div>
              Modifier le service
            </h1>
            <p className="text-muted-foreground mt-1">Modifiez les informations du service</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations de base */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-bold">Informations de base</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du service *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Ex: Coupe Homme, Tresses Africaines, Coloration"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Décrivez le service en détail..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (FCFA) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image du service */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-bold">Image du service</h2>
                
                <div className="space-y-4">
                  <div className="relative h-64 rounded-lg overflow-hidden bg-secondary border border-border">
                    <img
                      src={formData.image}
                      alt={formData.name || 'Service'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">URL de l'image</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({ ...formData, image: getServiceImage(service.id, 800, 600) })}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Générer
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Laissez vide pour utiliser une image par défaut
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              {/* Statut */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-bold">Statut</h2>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Service actif</Label>
                    <p className="text-sm text-muted-foreground">
                      Le service sera visible pour les clients
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>

                {selectedCategory && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Catégorie sélectionnée</p>
                    <span
                      className="inline-block px-3 py-1 text-sm font-medium rounded-full"
                      style={{
                        backgroundColor: selectedCategory.color,
                        color: 'white',
                      }}
                    >
                      {selectedCategory.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Aperçu */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-bold">Aperçu</h2>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durée:</span>
                    <span className="font-semibold">{formData.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prix:</span>
                    <span className="font-semibold text-primary">{formData.price} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut:</span>
                    <span className={cn(
                      "font-semibold",
                      formData.isActive ? "text-green-500" : "text-muted-foreground"
                    )}>
                      {formData.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/services/${service.id}`)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

