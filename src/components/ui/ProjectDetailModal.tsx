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

function resolveProjectTarget(project: Project): string | null {
  return project.detailURL || project.liveURL || project.repositoryURL || null;
}

export function ProjectDetailModal({ open, onClose, project }: Readonly<ProjectDetailModalProps>) {
  if (!project) {
    return null;
  }

  const descriptionId = `project-detail-description-${project.title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '')}`;

  const target = resolveProjectTarget(project);

  return (
    <Modal open={open} onClose={onClose} title={project.title} fullScreen descriptionId={descriptionId}>
      <div className="space-y-5 p-5 sm:p-6">
        {(project.previewVideoURL || (project.image && project.image !== 'placeholder.png')) && (
          <div className="relative h-56 overflow-hidden rounded-xl border border-border-light dark:border-border-dark sm:h-72">
            {project.previewVideoURL ? (
              <video
                src={project.previewVideoURL}
                className="h-full w-full object-cover"
                muted
                loop
                autoPlay
                playsInline
                preload="none"
                aria-label={`Preview video for ${project.title}`}
              />
            ) : (
              <Image
                src={`/images/projects/${project.image}`}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                loading="lazy"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full border border-border-light px-2 py-1 text-text-secondary-light dark:border-border-dark dark:text-text-secondary-dark">
            <Calendar className="h-3 w-3" /> {project.year}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border-light px-2 py-1 text-text-secondary-light dark:border-border-dark dark:text-text-secondary-dark">
            <Layers className="h-3 w-3" /> {project.category || 'Uncategorized'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border-light px-2 py-1 text-text-secondary-light dark:border-border-dark dark:text-text-secondary-dark">
            <BriefcaseBusiness className="h-3 w-3" /> {project.role || 'Project Contributor'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-pink/10 px-2 py-1 text-accent-pink">
            {toStatusLabel(project.status)}
          </span>
        </div>

        <p id={descriptionId} className="text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
          {project.description}
        </p>

        {(target || project.repositoryURL || project.liveURL || project.processURL) && (
          <div className="flex flex-wrap items-center gap-2">
            {target && (
              <a
                href={target}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-accent-pink px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-pink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open Full Project
              </a>
            )}
            {project.repositoryURL && (
              <a
                href={project.repositoryURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border-light px-3 py-1.5 text-xs font-medium text-text-secondary-light transition-colors hover:border-accent-pink/40 hover:text-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 dark:border-border-dark dark:text-text-secondary-dark"
              >
                <Code2 className="h-3.5 w-3.5" />
                Source Code
              </a>
            )}
            {project.liveURL && (
              <a
                href={project.liveURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border-light px-3 py-1.5 text-xs font-medium text-text-secondary-light transition-colors hover:border-accent-pink/40 hover:text-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 dark:border-border-dark dark:text-text-secondary-dark"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live Demo
              </a>
            )}
            {project.processURL && (
              <a
                href={project.processURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border-light px-3 py-1.5 text-xs font-medium text-text-secondary-light transition-colors hover:border-accent-pink/40 hover:text-accent-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/50 dark:border-border-dark dark:text-text-secondary-dark"
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
                  className="rounded-lg border border-border-light bg-surface-light p-3 dark:border-border-dark dark:bg-surface-dark"
                >
                  <p className="text-[11px] font-semibold text-text-primary-light dark:text-text-primary-dark">{metric.label}</p>
                  <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">{metric.value}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Tech Stack</h3>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-accent-pink/10 px-2 py-0.5 text-[11px] font-medium text-accent-pink">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {project.gallery && project.gallery.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">Project Gallery</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.gallery.map((item) => (
                <figure
                  key={`${item.image}-${item.caption}`}
                  className="overflow-hidden rounded-lg border border-border-light dark:border-border-dark"
                >
                  <div className="relative h-40">
                    <Image
                      src={`/images/projects/${item.image}`}
                      alt={item.caption}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="bg-white px-3 py-2 text-[11px] text-text-secondary-light dark:bg-card-bg-dark dark:text-text-secondary-dark">
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
