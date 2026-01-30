import { PublicLayout } from '@/components/layout/PublicLayout';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/button';
import { Calendar, Scissors, Sparkles, ArrowRight, Clock, Banknote, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockServices, mockCategories, getCategoryById } from '@/data/mockData';
import { AfricanStarSymbol, AkomaSymbol, SankofaSymbol, GyeNyameSymbol } from '@/components/african-symbols/AfricanSymbols';
import heroImage from '@/assets/hero-salon.jpg';
import { HeroSection } from '@/components/public/HeroSection';
import { AnimatedSection } from '@/components/public/AnimatedSection';
import { AnimatedCard } from '@/components/public/AnimatedCard';
import { StaggerGrid, StaggerItem } from '@/components/public/StaggerGrid';
import { ParallaxSection } from '@/components/public/ParallaxSection';
import { getServiceImage } from '@/lib/unsplash';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { salon } = useTenant();
  const featuredServices = mockServices.slice(0, 6);
  // Image du dashboard (ou image personnalisée du salon)
  const heroImageUrl = salon.heroImage || heroImage;

  return (
    <PublicLayout>
      {/* Hero Section avec animations */}
      <HeroSection
        backgroundImage={heroImageUrl}
        subtitle={
          <div className="flex items-center gap-2">
            <AkomaSymbol size={24} animated={true} color="yellow" />
            <span>Bienvenue chez {salon.name}</span>
          </div>
        }
        title={
          <>
            Votre beauté,
            <br />
            <span className="text-accent">Notre passion</span>
          </>
        }
        description="Découvrez nos services de coiffure et prenez rendez-vous en ligne"
        actions={
          <>
            <Link to="/public/booking">
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-glow-primary transition-all hover:scale-105">
                <Calendar className="w-5 h-5" />
                Réserver maintenant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/public/services">
              <Button size="lg" variant="outline" className="gap-2 bg-background/10 backdrop-blur-sm border-background/30 text-background hover:bg-background/20">
                <Scissors className="w-5 h-5" />
                Voir nos services
              </Button>
            </Link>
          </>
        }
        decorativeElements={
          <>
            <motion.div
              className="absolute top-8 right-8 opacity-30"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <AfricanStarSymbol size={60} animated={true} color="gradient" />
            </motion.div>
            <motion.div
              className="absolute bottom-16 left-8 opacity-25"
              animate={{
                y: [0, 15, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <SankofaSymbol size={48} animated={true} color="yellow" />
            </motion.div>
          </>
        }
      />

      {/* Services en vedette avec animations stagger */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection variant="fadeInUp" className="text-center mb-12 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <AfricanStarSymbol size={32} animated={true} color="gradient" />
              </motion.div>
              <h2 className="text-4xl font-bold">Nos Services</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez notre gamme complète de services de coiffure pour tous vos besoins
            </p>
          </AnimatedSection>

          <StaggerGrid columns={3}>
            {featuredServices.map((service, index) => {
              const category = getCategoryById(service.categoryId);
              const serviceImage = service.image || getServiceImage(service.id, 800, 600);
              return (
                <StaggerItem key={service.id}>
                  <AnimatedCard delay={index * 0.1} hover className="overflow-hidden">
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
                      <div className="absolute top-3 right-3">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                          <AkomaSymbol size={20} animated={true} color="yellow" />
                        </motion.div>
                      </div>
                      {/* Badge catégorie sur l'image */}
                      <div className="absolute bottom-3 left-3">
                        <span
                          className="px-3 py-1 text-xs font-medium rounded-full shadow-lg backdrop-blur-sm"
                          style={{
                            backgroundColor: category?.color || 'hsl(var(--muted))',
                            color: 'white',
                          }}
                        >
                          {category?.name || 'Sans catégorie'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{service.duration} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-bold text-lg">
                          <Banknote className="w-4 h-4" />
                          {service.price} FCFA
                        </div>
                      </div>
                      <Link to={`/public/services/${service.id}`}>
                        <Button className="w-full mb-2 gap-2" variant="outline">
                          Voir détails
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to="/public/booking" state={{ serviceId: service.id }}>
                        <Button className="w-full gap-2">
                          Réserver
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </AnimatedCard>
                </StaggerItem>
              );
            })}
          </StaggerGrid>

          <AnimatedSection variant="fadeInUp" delay={0.3} className="text-center mt-12">
            <Link to="/public/services">
              <Button size="lg" variant="outline" className="gap-2">
                Voir tous les services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Pourquoi nous choisir avec animations */}
      <section className="py-12 lg:py-16 bg-secondary/50 relative overflow-hidden">
        <div className="absolute inset-0 pattern-mudcloth opacity-30" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <AnimatedSection variant="fadeInUp" className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Pourquoi nous choisir ?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Excellence, professionnalisme et passion pour votre beauté
            </p>
          </AnimatedSection>

          <StaggerGrid columns={3}>
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-primary" />,
                title: 'Expertise',
                description: 'Des professionnels qualifiés avec des années d\'expérience',
                symbol: <AfricanStarSymbol size={24} animated={true} color="gradient" />,
                color: 'from-green-500/20 to-yellow-500/20',
              },
              {
                icon: <Clock className="w-8 h-8 text-primary" />,
                title: 'Réservation en ligne',
                description: 'Réservez votre créneau en quelques clics, 24/7',
                symbol: <AkomaSymbol size={24} animated={true} color="green" />,
                color: 'from-yellow-500/20 to-blue-500/20',
              },
              {
                icon: <Users className="w-8 h-8 text-primary" />,
                title: 'Service client',
                description: 'Une équipe à votre écoute pour répondre à tous vos besoins',
                symbol: <SankofaSymbol size={24} animated={true} color="blue" />,
                color: 'from-blue-500/20 to-green-500/20',
              },
            ].map((feature, index) => (
              <StaggerItem key={index}>
                <motion.div
                  className="bg-card border border-border rounded-xl p-8 text-center relative overflow-hidden group"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <motion.div
                      className="flex justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div className="p-4 bg-primary/10 rounded-full">
                        {feature.icon}
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex justify-center mb-3"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {feature.symbol}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* CTA Section */}
      <ParallaxSection speed={0.2}>
        <section className="py-12 lg:py-16 bg-gradient-gabon relative overflow-hidden">
          <div className="absolute inset-0 pattern-gabon opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/95 via-foreground/90 to-foreground/95" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            {/* CTA */}
            <AnimatedSection variant="scaleIn" className="text-center space-y-6">
              <motion.div
                className="flex justify-center mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <GyeNyameSymbol size={48} animated={true} color="yellow" />
              </motion.div>
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">Prêt à prendre rendez-vous ?</h2>
              <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md">
                Réservez votre créneau dès maintenant et laissez-nous prendre soin de vous
              </p>
              <Link to="/public/booking">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6"
                >
                  <Button size="lg" variant="secondary" className="gap-2 shadow-xl hover:shadow-2xl transition-all bg-white text-foreground hover:bg-white/90">
                    <Calendar className="w-5 h-5" />
                    Réserver un rendez-vous
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </ParallaxSection>
    </PublicLayout>
  );
}
