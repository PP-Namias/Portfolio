'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Code2, ExternalLink, Layers, BriefcaseBusiness } from 'lucide-react';
import { Modal } from './Modal';
import { Project } from '@/types';

interface ProjectDetailModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

function toStatusLabel(status?: Project['status']): string {
  if (!status) return 'Completed';
  if (status === 'in-progress') return 'In Progress';
  if (status === 'prototype') return 'Prototype';
  return 'Completed';
}

export function ProjectDetailModal({ open, onClose, project }: Readonly<ProjectDetailModalProps>) {
  if (!project) {
    return null;
  }

  const descriptionId = `project-detail-description-${project.title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '')}`;

  return (
    <Modal open={open} onClose={onClose} title={project.title} fullScreen descriptionId={descriptionId}>
      <div className="p-5 sm:p-6 space-y-5">
        {project.image && project.image !== 'placeholder.png' && (
          <div className="relative h-56 sm:h-72 rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
            <Image
              src={`/images/projects/${project.image}`}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full border border-border-light dark:border-border-dark px-2 py-1 text-text-secondary-light dark:text-text-secondary-dark">
            <Calendar className="h-3 w-3" /> {project.year}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border-light dark:border-border-dark px-2 py-1 text-text-secondary-light dark:text-text-secondary-dark">
            <Layers className="h-3 w-3" /> {project.category || 'Uncategorized'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border-light dark:border-border-dark px-2 py-1 text-text-secondary-light dark:text-text-secondary-dark">
            <BriefcaseBusiness className="h-3 w-3" /> {project.role || 'Project Contributor'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-pink/10 text-accent-pink px-2 py-1">
            {toStatusLabel(project.status)}
          </span>
        </div>

        <p id={descriptionId} className="text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
          {project.description}
        </p>

        {(project.liveURL || project.repositoryURL || project.processURL) && (
          <div className="flex flex-wrap items-center gap-2">
            {project.liveURL && (
              <a
                href={project.liveURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-accent-pink text-white px-3 py-1.5 text-xs font-medium hover:bg-accent-pink/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live Demo
              </a>
            )}
            {project.repositoryURL && (
              <a
                href={project.repositoryURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border-light dark:border-border-dark px-3 py-1.5 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50"
              >
                <Code2 className="h-3.5 w-3.5" />
                Source Code
              </a>
            )}
            {project.processURL && (
              <a
                href={project.processURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border-light dark:border-border-dark px-3 py-1.5 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Process Notes
              </a>
            )}
          </div>
        )}

        {project.impactMetrics && project.impactMetrics.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Impact Highlights</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {project.impactMetrics.map((metric) => (
                <li
                  key={`${metric.label}-${metric.value}`}
                  className="rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-3"
                >
                  <p className="text-[11px] font-semibold text-text-primary-light dark:text-text-primary-dark">{metric.label}</p>
                  <p className="text-xs mt-1 text-text-secondary-light dark:text-text-secondary-dark">{metric.value}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Tech Stack</h3>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {project.gallery && project.gallery.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Project Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.gallery.map((item) => (
                <figure key={`${item.image}-${item.caption}`} className="rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
                  <div className="relative h-40">
                    <Image
                      src={`/images/projects/${item.image}`}
                      alt={item.caption}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-[11px] px-3 py-2 text-text-secondary-light dark:text-text-secondary-dark bg-white dark:bg-card-bg-dark">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}
