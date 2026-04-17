'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '@/types';
import { Card } from './Card';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const projectUrl = project.liveURL || project.repositoryURL;
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="h-full"
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      viewport={{ once: true }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { delay: index * 0.08, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
      }
    >
      <Card hover className="h-full flex flex-col">
        {/* Project Screenshot */}
        {project.image && project.image !== 'placeholder.png' && (
          <div className="relative -mx-5 -mt-5 mb-3 rounded-t-xl overflow-hidden">
            <Image
              src={`/images/projects/${project.image}`}
              alt={project.title}
              width={400}
              height={128}
              sizes="(max-width: 768px) 100vw, 400px"
              loading="lazy"
              className="w-full h-32 object-cover"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark leading-snug">
            {project.title}
          </h3>
          <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark flex-shrink-0">
            {project.year}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed flex-1 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {project.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink">
              +{project.tags.length - 2}
            </span>
          )}
        </div>
        {projectUrl && (
          <div className="flex items-center gap-2 mt-2.5">
            {project.repositoryURL && (
              <a
                href={project.repositoryURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
              >
                <Github className="h-3 w-3" />
                Code
              </a>
            )}
            {project.liveURL && (
              <a
                href={project.liveURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Live
              </a>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
