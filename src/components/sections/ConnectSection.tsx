'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail, Calendar, FileText, ChevronRight, Clock, ExternalLink,
  Github, Instagram, Linkedin, Facebook, Twitter, MessageSquare,
} from 'lucide-react';
import { profile } from '@/data/profile';
import { socialLinks } from '@/data/socials';
import { blogPosts } from '@/data/blogPosts';
import { Card } from '@/components/ui/Card';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  github: Github,
  mail: Mail,
  linkedin: Linkedin,
  facebook: Facebook,
  'message-square': MessageSquare,
  twitter: Twitter,
  instagram: Instagram,
};

export function ConnectSection() {
  const latestPost = blogPosts[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Connect */}
        <Card>
          {/* Social Links */}
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-2.5">
            Social Links
          </h3>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon] || ExternalLink;
              return (
                <a
                  key={link.name}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors duration-200 group"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Get in Touch */}
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-2.5">
            Get in Touch
          </h3>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors duration-200"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{profile.email}</span>
            </a>
            {socialLinks.find((s) => s.name === 'calendly') && (
              <a
                href={socialLinks.find((s) => s.name === 'calendly')!.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors duration-200"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Schedule a Call</span>
              </a>
            )}
            <Link
              href="/blog"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors duration-200"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Blog</span>
            </Link>
          </div>

          {/* Quick Links */}
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-2.5">
            Quick Links
          </h3>
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-accent-pink text-white hover:bg-accent-pink-hover transition-colors duration-200"
            >
              View GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-pink hover:border-accent-pink dark:hover:text-accent-pink dark:hover:border-accent-pink transition-colors duration-200"
            >
              <Mail className="h-3 w-3" />
              Send Email
            </a>
          </div>
        </Card>

        {/* Card 2: Latest Blog Post */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
              Latest Post
            </h3>
            <Link
              href="/blog"
              className="flex items-center gap-0.5 text-[11px] text-text-muted-light dark:text-text-muted-dark hover:text-accent-pink dark:hover:text-accent-pink transition-colors duration-200"
            >
              View all
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <Link href={`/blog/${latestPost.slug}`} className="block group">
            {/* Thumbnail */}
            <div className="rounded-lg overflow-hidden mb-3">
              <img
                src={latestPost.coverImage}
                alt={latestPost.title}
                className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Details */}
            <h4 className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-accent-pink transition-colors duration-200 line-clamp-2 leading-snug">
              {latestPost.title}
            </h4>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1.5 line-clamp-2 leading-relaxed">
              {latestPost.excerpt}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px] text-text-muted-light dark:text-text-muted-dark">
                <Clock className="h-2.5 w-2.5" />
                {latestPost.readTime}
              </span>
              <div className="flex gap-1">
                {latestPost.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </Card>
      </div>
    </motion.section>
  );
}
