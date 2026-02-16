import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import heroBg from '@/assets/hero-bg.jpg';
import { Users, Shield, Heart, MapPin, Star, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Largest Gau Community',
    description: 'Connect with Gaushalas, Volunteers, Donors, NGOs, Influencers and Vendors across India.',
  },
  {
    icon: Shield,
    title: 'Verified Directory',
    description: 'Every Gaushala is verified through a multi-stage process ensuring trust and transparency.',
  },
  {
    icon: Heart,
    title: 'Support & Collaborate',
    description: 'Post needs, offer help, and build meaningful connections in the Gau welfare ecosystem.',
  },
  {
    icon: MapPin,
    title: 'Location Discovery',
    description: 'Find nearby Gaushalas and opportunities using pincode-based filtering.',
  },
  {
    icon: Star,
    title: 'Credibility Scoring',
    description: 'Algorithmic scoring system builds trust through ratings, reviews, and verification.',
  },
];

const roles = [
  { emoji: '🏠', name: 'Gaushala', count: '10,000+' },
  { emoji: '🙋', name: 'Volunteers', count: '10,00,000+' },
  { emoji: '💝', name: 'Donors', count: '2,00,000+' },
  { emoji: '📢', name: 'Influencers', count: '500+' },
  { emoji: '🤝', name: 'NGOs', count: '200+' },
  { emoji: '🏪', name: 'Vendors', count: '200+' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Gaushala" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero" />
        </div>
        <div className="relative container py-20 lg:py-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight">
              India's Largest{' '}
              <span className="block">Gau Community</span>
            </h1>
            <p className="mt-5 text-lg lg:text-xl text-primary-foreground/90 max-w-lg leading-relaxed">
              Connect, empower and support Gaushalas. Join the verified national directory for Gau welfare.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-card text-foreground hover:bg-card/90 font-semibold text-base px-8 shadow-warm">
                  Register Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8">
                Explore Directory
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6G Roles */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
              The <span className="text-gradient-saffron">6G</span> Community
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Six pillars of India's Gau welfare ecosystem, all connected on one platform.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {roles.map((role, i) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-5 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-warm transition-all duration-300"
              >
                <span className="text-3xl">{role.emoji}</span>
                <h3 className="font-heading font-semibold text-foreground mt-2">{role.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Target: {role.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
              Why <span className="text-gradient-saffron">GauBook</span>?
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-card transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-lg gradient-saffron flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-foreground text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="container px-4">
          <div className="gradient-saffron rounded-2xl p-10 lg:p-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-primary-foreground">
              Join the Movement
            </h2>
            <p className="text-primary-foreground/90 mt-3 max-w-md mx-auto text-lg">
              Be part of India's most trusted community for Gau welfare.
            </p>
            <Link to="/register">
              <Button size="lg" className="mt-8 bg-card text-foreground hover:bg-card/90 font-semibold text-base px-10 shadow-warm">
                Register Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="container px-4 text-center">
          <span className="text-2xl">🐄</span>
          <p className="font-heading font-bold text-gradient-saffron text-lg mt-1">GauBook</p>
          <p className="text-xs text-muted-foreground mt-2">
            India's Largest Gau Community • Connect • Empower • Support
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
