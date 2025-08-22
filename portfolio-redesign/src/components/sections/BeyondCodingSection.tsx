'use client';

import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Mic, 
  Briefcase, 
  Sparkles, 
  MessageCircle, 
  Lightbulb,
  Target
} from 'lucide-react';

interface BeyondCodingItem {
  id: string;
  title: string;
  description: string;
  icon: 'Heart' | 'Users' | 'Mic' | 'Briefcase';
  category?: string;
}

const beyondCodingItems: BeyondCodingItem[] = [
  {
    id: '1',
    title: 'CodeCred',
    description: 'Online certificate platform for programmers',
    icon: 'Briefcase',
    category: 'Platform'
  },
  {
    id: '2',
    title: 'DIKLPH',
    description: 'AI-powered virtual assistant for developers',
    icon: 'Users',
    category: 'AI Product'
  }
];

const iconMap = {
  Heart,
  Users,
  Mic,
  Briefcase
};

const BeyondCodingCard = ({ item, index }: { item: BeyondCodingItem; index: number }) => {
  const IconComponent = iconMap[item.icon];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card card-compact group cursor-pointer relative overflow-hidden"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex items-start gap-4">
        <motion.div 
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
        >
          <IconComponent className="w-6 h-6 text-white" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="body-md font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
              {item.title}
            </h3>
            {item.category && (
              <span className="chip chip-secondary text-xs">
                {item.category}
              </span>
            )}
          </div>
          <p className="body-sm text-[var(--color-text-secondary)] leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const BeyondCodingSection = () => {
  return (
    <section className="card relative overflow-hidden" id="beyond-coding">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--color-primary)]/20 to-[var(--color-accent)]/10 rounded-full opacity-60 -translate-y-12 translate-x-12" />
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="heading-md text-[var(--color-text-primary)]">Beyond Coding</h2>
              <p className="body-sm text-[var(--color-text-muted)]">Exploring new horizons</p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 glass-card rounded-lg flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
          </motion.div>
        </div>

        {/* Enhanced Projects Grid */}
        <div className="space-y-4 mb-8">
          {beyondCodingItems.map((item, index) => (
            <BeyondCodingCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Enhanced Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="glass-card card-compact relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 via-transparent to-[var(--color-accent)]/5" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-5 h-5 text-[var(--color-accent)]" />
              <h3 className="body-md font-semibold text-[var(--color-text-primary)]">Philosophy & Interests</h3>
            </div>
            
            <div className="space-y-3">
              <p className="body-sm text-[var(--color-text-secondary)] leading-relaxed">
                When not writing code, I focus on learning about emerging technologies, minimalism, and startup culture.
              </p>
              
              <p className="body-sm text-[var(--color-text-secondary)] leading-relaxed">
                I share my knowledge through content creation and community building.
              </p>
            </div>

            {/* Interest Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="chip chip-primary">
                <Lightbulb className="w-3 h-3" />
                Innovation
              </span>
              <span className="chip chip-secondary">
                <Target className="w-3 h-3" />
                Minimalism
              </span>
              <span className="chip chip-primary">
                <Users className="w-3 h-3" />
                Community
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
