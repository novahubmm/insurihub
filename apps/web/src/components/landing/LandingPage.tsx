'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Shield, Users, MessageCircle, Coins, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { Footer } from './Footer';

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const features = [
    {
      icon: Shield,
      title: 'Insurance Expertise',
      description: 'Connect with verified insurance professionals and share industry insights',
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Build relationships with agents, customers, and industry experts',
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Instant messaging with file sharing and token-based pricing',
    },
    {
      icon: Coins,
      title: 'Token System',
      description: 'Fair, transparent pricing for premium content and services',
    },
  ];

  const benefits = [
    'Share insurance insights and expertise',
    'Connect with verified professionals',
    'Real-time messaging and notifications',
    'Token-based premium content system',
    'Mobile-first responsive design',
    'Secure and trusted platform',
  ];

  const handleGetStarted = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-insurance-light via-white to-gold-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-emerald-500/10" />
        
        <div className="relative container-wide py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-100 to-emerald-100 px-4 py-2 rounded-full text-sm font-medium text-gold-700 mb-8"
            >
              <Star className="w-4 h-4" />
              Premium Insurance Social Platform
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display mb-6">
              <span className="text-gradient-premium">
                Connect. Share. Grow.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The premier social platform for insurance professionals. 
              Share insights, connect with experts, and grow your network in a premium environment.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button
                onClick={() => handleGetStarted('register')}
                className="btn-primary text-lg px-8 py-4 group"
              >
                Get Started Free
              </button>
              
              <button
                onClick={() => handleGetStarted('login')}
                className="btn-outline text-lg px-8 py-4"
              >
                Sign In
              </button>
            </motion.div>

            {/* Platform Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 md:gap-16"
            >
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gradient-gold">500+</p>
                <p className="text-gray-600">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gradient-green">1,200+</p>
                <p className="text-gray-600">Posts Shared</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gradient-gold">10K+</p>
                <p className="text-gray-600">Messages Sent</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl opacity-20 blur-sm"
        />
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full opacity-20 blur-sm"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
              <span className="text-gradient-gold">Premium Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to connect, share, and grow in the insurance industry
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-100 to-emerald-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-gold-600" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-gold-50 to-emerald-50">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-8">
                <span className="text-gradient-green">Why Choose</span><br />
                <span className="text-gradient-gold">InsuriHub?</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of insurance professionals who trust our platform 
                for networking, sharing insights, and growing their business.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-premium p-8 lg:p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold-500 to-emerald-500 rounded-3xl mb-6">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    Trusted by Professionals
                  </h3>
                  
                  <p className="text-gray-600 mb-8">
                    Our platform is designed specifically for insurance professionals, 
                    with features that matter to your industry.
                  </p>
                  
                  <button
                    onClick={() => handleGetStarted('register')}
                    className="btn-primary w-full"
                  >
                    Join the Community
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card-premium p-12 lg:p-20 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
              <span className="text-gradient-premium">
                Ready to Get Started?
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join InsuriHub today and start building meaningful connections 
              in the insurance industry.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleGetStarted('register')}
                className="btn-primary text-lg px-8 py-4"
              >
                Create Free Account
              </button>
              
              <button
                onClick={() => handleGetStarted('login')}
                className="btn-outline text-lg px-8 py-4"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}