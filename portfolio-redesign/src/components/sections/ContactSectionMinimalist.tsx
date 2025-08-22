'use client';

import { contactInfo, type ContactMethod, type SocialPlatform } from '@/data/contact';
import { personalInfo } from '@/data/personal';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function ContactSection() {
  const primaryMethods = contactInfo.contactMethods
    .filter((method: ContactMethod) => method.primary)
    .slice(0, 3);

  const primarySocials = contactInfo.socialPlatforms
    .filter((platform: SocialPlatform) => platform.primary)
    .slice(0, 4);

  return (
    <section id="contact" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="heading-2 mb-lg">Get In Touch</h2>
          
          <p className="body-large mb-2xl">
            Always interested in new opportunities and collaborations. 
            Feel free to reach out if you&apos;d like to work together.
          </p>
          
          {/* Contact Methods */}
          <div className="grid-2 md:grid-cols-3 gap-6 mb-2xl">
            {primaryMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={method.href}
                  className="card-simple block hover:border-blue-600 transition-colors group"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-sm group-hover:text-blue-600 transition-colors">
                      {method.icon}
                    </div>
                    <h3 className="heading-4 mb-xs">{method.label}</h3>
                    <p className="body-small text-gray-600 dark:text-gray-400 mb-sm">
                      {method.description}
                    </p>
                    <p className="body-small font-medium text-blue-600">
                      {method.value}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Social Links */}
          <div className="mb-2xl">
            <h3 className="heading-4 mb-lg">Connect With Me</h3>
            <div className="flex justify-center gap-4">
              {primarySocials.map((social, index) => (
                <motion.div
                  key={social.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 chip hover:chip-accent transition-all"
                  >
                    <span>{social.icon}</span>
                    <span>{social.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Primary CTA */}
          <div>
            <Link
              href={`mailto:${personalInfo.profile.email}`}
              className="btn btn-primary btn-lg"
            >
              Send Me an Email
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
