import { PublicLayout } from '@/components/layout/PublicLayout';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/button';
import { Scissors, ArrowRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { mockServices, mockCategories, getCategoryById } from '@/data/mockData';
import { AfricanStarSymbol } from '@/components/african-symbols/AfricanSymbols';
import { AnimatedSection, StaggerGrid, StaggerItem, HeroSection } from '@/components/public';
import { ServiceCard } from '@/components/services';
import { getPageHeroImage } from '@/lib/unsplash';
import { motion } from 'framer-motion';

export default function ServicesPage() {
  const { salon } = useTenant();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Image unique pour la page services - Tresses et coiffures traditionnelles
  const heroImage = salon.heroImage || getPageHeroImage('services', 1920, 1080);

  const filteredServices = selectedCategory === 'all'
    ? mockServices.filter(s => s.isActive)
    : mockServices.filter(s => s.isActive && s.categoryId === selectedCategory);

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

      {/* Filtres par catégorie avec animation */}
      <AnimatedSection variant="fadeInDown">
        <section className="py-8 bg-background border-b border-border sticky top-20 z-40 backdrop-blur-sm bg-background/95 shadow-sm">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filtrer :</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="transition-all"
                >
                  Tous les services
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
                    className="transition-all"
                    style={{
                      backgroundColor: selectedCategory === category.id ? category.color : undefined,
                      color: selectedCategory === category.id ? 'white' : undefined,
                    }}
                  >
                    {category.name}
                  </Button>
                </motion.div>
              ))}
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
