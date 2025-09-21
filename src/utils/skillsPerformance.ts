// Performance Optimization Script for Skills Section
// src/utils/skillsPerformance.ts

export class SkillsPerformanceOptimizer {
  private observer: IntersectionObserver | null = null;
  private animationQueue: Set<HTMLElement> = new Set();
  private isAnimating = false;

  constructor() {
    this.setupIntersectionObserver();
    this.optimizeAnimations();
  }

  /**
   * Lazy load skill animations only when they enter viewport
   */
  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.queueAnimation(entry.target as HTMLElement);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
      }
    );
  }

  /**
   * Queue animations to prevent performance issues
   */
  private queueAnimation(element: HTMLElement): void {
    this.animationQueue.add(element);
    this.processAnimationQueue();
  }

  /**
   * Process animation queue with requestAnimationFrame
   */
  private processAnimationQueue(): void {
    if (this.isAnimating || this.animationQueue.size === 0) return;

    this.isAnimating = true;
    requestAnimationFrame(() => {
      const element = this.animationQueue.values().next().value;
      if (element) {
        this.animateElement(element);
        this.animationQueue.delete(element);
      }
      this.isAnimating = false;
      
      // Process next animation
      if (this.animationQueue.size > 0) {
        setTimeout(() => this.processAnimationQueue(), 50);
      }
    });
  }

  /**
   * Optimize element animation
   */
  private animateElement(element: HTMLElement): void {
    if (element.classList.contains('skill-progress')) {
      this.animateProgressBar(element);
    } else if (element.classList.contains('skill-card')) {
      this.animateSkillCard(element);
    }
  }

  /**
   * Animate progress bar with optimized CSS
   */
  private animateProgressBar(progressBar: HTMLElement): void {
    const level = progressBar.dataset.level;
    if (!level) return;

    // Use CSS transform instead of width for better performance
    progressBar.style.transform = 'scaleX(0)';
    progressBar.style.transformOrigin = 'left center';
    progressBar.style.transition = 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)';

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      const scaleValue = Number.parseInt(level) / 100;
      progressBar.style.transform = `scaleX(${scaleValue})`;
    });
  }

  /**
   * Animate skill card entrance
   */
  private animateSkillCard(card: HTMLElement): void {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }

  /**
   * Observe elements for lazy loading
   */
  public observeElement(element: HTMLElement): void {
    this.observer?.observe(element);
  }

  /**
   * Optimize animations for reduced motion
   */
  private optimizeAnimations(): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }

    // Listen for changes
    prefersReducedMotion.addEventListener('change', (e) => {
      const duration = e.matches ? '0.1s' : '0.6s';
      document.documentElement.style.setProperty('--animation-duration', duration);
      document.documentElement.style.setProperty('--transition-duration', duration);
    });
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.animationQueue.clear();
  }
}

// Performance utilities
export const performanceUtils = {
  preloadCriticalSkills: (): void => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = '/src/data/skillsConfig.ts';
    document.head.appendChild(link);
  },

  measureBundleSize: async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();
    
    try {
      const skillsModule = await import('../data/skillsConfig');
      const endTime = performance.now();
      
      const loadTime = endTime - startTime;
      const skills = skillsModule.getAllSkills();
      
      console.group('🔍 Skills Bundle Analysis');
      console.log(`📦 Load Time: ${loadTime.toFixed(2)}ms`);
      console.log(`📊 Total Skills: ${skills.length}`);
      console.log(`🎯 Performance Score: ${loadTime < 50 ? '🟢 Excellent' : '🟡 Good'}`);
      console.groupEnd();
      
    } catch (error) {
      console.error('Bundle analysis failed:', error);
    }
  },

  monitorFrameRate: (): void => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFrame = (currentTime: number) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        console.log(`📊 FPS: ${frameCount}`);
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }
};