'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { Card } from './Card';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card hover className="h-full flex flex-col">
        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
          {project.name}
        </h3>
        <p className="mt-1.5 text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed flex-1">
          {project.description}
        </p>
        <p className="mt-2 text-xs font-mono text-accent-pink">
          {project.url}
        </p>
      </Card>
    </motion.div>
  );
}
