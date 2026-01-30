import { PublicLayout } from '@/components/layout/PublicLayout';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/button';
import { Scissors, ArrowRight, Filter, Users, User, UserCircle, Baby } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { mockServices, mockCategories, getCategoryById } from '@/data/mockData';
import { AfricanStarSymbol } from '@/components/african-symbols/AfricanSymbols';
import { AnimatedSection, StaggerGrid, StaggerItem, HeroSection } from '@/components/public';
import { ServiceCard } from '@/components/services';
import { getPageHeroImage } from '@/lib/unsplash';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ServicesPage() {
  const { salon } = useTenant();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  // Image unique pour la page services - Tresses et coiffures traditionnelles
  const heroImage = salon.heroImage || getPageHeroImage('services', 1920, 1080);

  const filteredServices = mockServices.filter(s => {
    if (!s.isActive || !s.isPublished) return false;
    const matchesCategory = selectedCategory === 'all' || s.categoryId === selectedCategory;
    const matchesTarget = selectedTarget === 'all' || s.target === selectedTarget;
    return matchesCategory && matchesTarget;
  });

  return (
    <PublicLayout>
      {/* Hero Section avec image */}
      <HeroSection
        backgroundImage={heroImage}
        title={
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AfricanStarSymbol size={40} animated={true} color="yellow" />
            </motion.div>
            <span>Nos Services</span>
          </div>
        }
        description="Découvrez notre gamme complète de services de coiffure"
        decorativeElements={
          <motion.div
            className="absolute top-8 right-8 opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <AfricanStarSymbol size={60} animated={true} color="gradient" />
          </motion.div>
        }
      />

      {/* Filtres compacts avec animation */}
      <AnimatedSection variant="fadeInDown">
        <section className="py-4 bg-background border-b border-border sticky top-20 z-40 backdrop-blur-sm bg-background/95 shadow-sm">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              {/* Filtre par catégorie */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">Catégorie</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                      className="h-7 text-xs px-2"
                    >
                      Toutes
                    </Button>
                  </motion.div>
                  {mockCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
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
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Filtre par type de client */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">Type de client</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedTarget === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTarget('all')}
                      className="h-7 text-xs px-2"
                    >
                      Tous
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
                  </motion.div>
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
          </div>
        </section>
      </AnimatedSection>

      {/* Liste des services avec stagger animation */}
      <section className="py-8 lg:py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {filteredServices.length > 0 ? (
            <StaggerGrid columns={3}>
              {filteredServices.map((service, index) => {
                const category = getCategoryById(service.categoryId);
                return (
                  <StaggerItem key={service.id}>
                    <div className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <ServiceCard
                        service={service}
                        category={category}
                        variant="public"
                        index={index}
                        className="hover:shadow-xl"
                      />
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          ) : (
            <AnimatedSection variant="scaleIn" className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <Scissors className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Aucun service disponible dans cette catégorie</p>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* CTA avec animation */}
      <AnimatedSection variant="fadeInUp">
        <section className="py-8 lg:py-12 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-8 text-center space-y-4">
            <h2 className="text-3xl font-bold">Vous avez des questions ?</h2>
            <p className="text-muted-foreground">
              Contactez-nous pour plus d'informations sur nos services
            </p>
            <Link to="/public/contact">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="gap-2">
                  Nous contacter
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </PublicLayout>
  );
}
