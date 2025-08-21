'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Mic, Briefcase } from 'lucide-react';

interface BeyondCodingItem {
  id: string;
  title: string;
  description: string;
  icon: 'Heart' | 'Users' | 'Mic' | 'Briefcase';
}

const beyondCodingItems: BeyondCodingItem[] = [
  {
    id: '1',
    title: 'CodeCred',
    description: 'Online certificate one for programmers',
    icon: 'Briefcase'
  },
  {
    id: '2',
    title: 'DIKLPH',
    description: 'AI powered virtual assistant',
    icon: 'Users'
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-surface rounded-2xl p-4 border border-default hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary text-sm mb-1 group-hover:text-accent transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-secondary leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const BeyondCodingSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="beyond-coding"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Heart className="w-4 h-4 mr-2 text-accent" />
          <h2 className="text-lg font-semibold text-primary">Beyond Coding</h2>
        </div>
      </div>

      <div className="space-y-3">
        {beyondCodingItems.map((item, index) => (
          <BeyondCodingCard key={item.id} item={item} index={index} />
        ))}
      </div>

      <p className="text-xs text-secondary mt-4 leading-relaxed">
        When not writing code, I focus on learning about emerging technologies, minimalism, and startup culture.
      </p>
      
      <p className="text-xs text-secondary mt-2 leading-relaxed">
        I share my knowledge through content creation and community building.
      </p>
    </motion.section>
  );
};
