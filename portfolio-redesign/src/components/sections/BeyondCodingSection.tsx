'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, Lightbulb, Coffee, Code2 } from 'lucide-react';

export const BeyondCodingSection = () => {
  const interests = [
    {
      icon: Code2,
      title: 'Technology & Innovation',
      description: 'AI Research, Open Source Contributions, Tech Mentoring',
      color: 'text-blue-400'
    },
    {
      icon: BookOpen,
      title: 'Creative Pursuits',
      description: 'Technical Writing, Photography, Design Systems',
      color: 'text-green-400'
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'Developer Meetups, Knowledge Sharing, Code Reviews',
      color: 'text-purple-400'
    }
  ];

  const activities = [
    'Contributing to open source projects',
    'Mentoring junior developers',
    'Writing technical articles',
    'Participating in hackathons',
    'Building developer communities'
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="card"
      id="beyond-coding"
    >
      <div className="flex items-center mb-6">
        <Heart className="w-5 h-5 mr-3 text-accent" />
        <h2 className="text-xl font-semibold text-text-primary">Beyond Coding</h2>
      </div>

      <div className="space-y-6">
        {/* Philosophy */}
        <div className="bg-secondary/20 p-4 rounded-lg border border-border">
          <div className="flex items-center mb-3">
            <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
            <span className="text-sm font-medium text-text-secondary">Philosophy</span>
          </div>
          <p className="text-text-primary font-medium italic">
            &ldquo;Building technology that makes a difference, one line of code at a time.&rdquo;
          </p>
        </div>

        {/* Interests */}
        <div>
          <h3 className="text-lg font-medium text-primary mb-4">Interests & Passions</h3>
          <div className="space-y-4">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/10 border border-border hover:bg-secondary/20 transition-colors"
              >
                <interest.icon className={`w-5 h-5 mt-0.5 ${interest.color}`} />
                <div>
                  <h4 className="font-medium text-primary">{interest.title}</h4>
                  <p className="text-sm text-secondary mt-1">{interest.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Activities */}
        <div>
          <h3 className="text-lg font-medium text-primary mb-4">Current Activities</h3>
          <div className="space-y-2">
            {activities.map((activity, index) => (
              <motion.div
                key={activity}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                <span className="text-secondary">{activity}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Community Impact */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">50+</div>
            <div className="text-sm text-secondary">Developers Mentored</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">25+</div>
            <div className="text-sm text-secondary">Open Source PRs</div>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
          <div className="flex items-center mb-2">
            <Coffee className="w-4 h-4 mr-2 text-accent" />
            <span className="text-sm font-medium text-accent">Fun Fact</span>
          </div>
          <p className="text-secondary text-sm">
            When not coding, I enjoy exploring new coffee shops and documenting the perfect brewing techniques for each blend!
          </p>
        </div>
      </div>
    </motion.section>
  );
};
