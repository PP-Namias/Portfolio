// Mobile Experience Enhancement for Skills Section
// src/utils/mobileSkillsEnhancer.ts

export interface TouchGesture {
	startX: number;
	startY: number;
	currentX: number;
	currentY: number;
	deltaX: number;
	deltaY: number;
	direction: "left" | "right" | "up" | "down" | null;
	velocity: number;
	timestamp: number;
}

export class MobileSkillsEnhancer {
	private container: HTMLElement | null = null;
	private skillCards: NodeListOf<HTMLElement> | null = null;
	private filterButtons: NodeListOf<HTMLElement> | null = null;
	private currentCategory = "all";
	private touchStartTime = 0;
	private touchHistory: TouchGesture[] = [];
	private swipeThreshold = 50;
	private velocityThreshold = 0.5;

	constructor() {
		this.init();
	}

	private init(): void {
		this.setupElements();
		this.setupTouchEvents();
		this.setupSwipeNavigation();
		this.optimizeMobileAnimations();
		this.setupPullToRefresh();
		this.enhanceScrolling();
	}

	private setupElements(): void {
		this.container = document.querySelector(".skills-section");
		this.skillCards = document.querySelectorAll(".skill-card");
		this.filterButtons = document.querySelectorAll(".filter-btn");
	}

	private setupTouchEvents(): void {
		if (!this.container) return;

		let touchStart: TouchGesture | null = null;

		this.container.addEventListener(
			"touchstart",
			(e) => {
				this.touchStartTime = Date.now();
				const touch = e.touches[0];
				touchStart = {
					startX: touch.clientX,
					startY: touch.clientY,
					currentX: touch.clientX,
					currentY: touch.clientY,
					deltaX: 0,
					deltaY: 0,
					direction: null,
					velocity: 0,
					timestamp: Date.now(),
				};
			},
			{ passive: true },
		);

		this.container.addEventListener(
			"touchmove",
			(e) => {
				if (!touchStart) return;

				const touch = e.touches[0];
				const currentTime = Date.now();
				const deltaTime = currentTime - touchStart.timestamp;

				touchStart.currentX = touch.clientX;
				touchStart.currentY = touch.clientY;
				touchStart.deltaX = touch.clientX - touchStart.startX;
				touchStart.deltaY = touch.clientY - touchStart.startY;

				// Calculate direction
				const absDeltaX = Math.abs(touchStart.deltaX);
				const absDeltaY = Math.abs(touchStart.deltaY);

				if (absDeltaX > absDeltaY) {
					touchStart.direction = touchStart.deltaX > 0 ? "right" : "left";
				} else {
					touchStart.direction = touchStart.deltaY > 0 ? "down" : "up";
				}

				// Calculate velocity
				touchStart.velocity =
					Math.sqrt(
						touchStart.deltaX * touchStart.deltaX +
							touchStart.deltaY * touchStart.deltaY,
					) / deltaTime;

				// Handle horizontal swipe for category navigation
				if (
					touchStart.direction === "left" ||
					touchStart.direction === "right"
				) {
					if (absDeltaX > this.swipeThreshold) {
						this.handleCategorySwipe(touchStart.direction);
					}
				}

				this.touchHistory.push({ ...touchStart });
				if (this.touchHistory.length > 10) {
					this.touchHistory.shift();
				}
			},
			{ passive: true },
		);

		this.container.addEventListener(
			"touchend",
			(e) => {
				if (!touchStart) return;

				const touchDuration = Date.now() - this.touchStartTime;

				// Handle tap gestures
				if (
					touchDuration < 200 &&
					Math.abs(touchStart.deltaX) < 10 &&
					Math.abs(touchStart.deltaY) < 10
				) {
					this.handleTap(e);
				}

				// Handle swipe gestures
				if (touchStart.velocity > this.velocityThreshold) {
					this.handleSwipeGesture(touchStart);
				}

				touchStart = null;
				this.touchHistory = [];
			},
			{ passive: true },
		);
	}

	private handleCategorySwipe(direction: "left" | "right"): void {
		const categories = [
			"all",
			"frontend",
			"backend",
			"ai",
			"devops",
			"database",
			"tools",
		];
		const currentIndex = categories.indexOf(this.currentCategory);

		let newIndex: number;
		if (direction === "left" && currentIndex < categories.length - 1) {
			newIndex = currentIndex + 1;
		} else if (direction === "right" && currentIndex > 0) {
			newIndex = currentIndex - 1;
		} else {
			return; // No change needed
		}

		const newCategory = categories[newIndex];
		this.switchCategory(newCategory);
	}

	private switchCategory(category: string): void {
		this.currentCategory = category;

		// Update active filter button
		this.filterButtons?.forEach((btn) => {
			btn.classList.remove("active");
			if (btn.dataset.filter === category) {
				btn.classList.add("active");
			}
		});

		// Filter skills with mobile-optimized animation
		this.filterSkillsWithAnimation(category);

		// Provide haptic feedback if available
		this.triggerHapticFeedback();
	}

	private filterSkillsWithAnimation(category: string): void {
		if (!this.skillCards) return;

		this.skillCards.forEach((card, index) => {
			const cardCategory = card.dataset.category;
			const shouldShow = category === "all" || cardCategory === category;

			if (shouldShow) {
				card.style.display = "block";
				card.style.animation = `mobileSlideIn 0.4s ease-out ${index * 0.05}s forwards`;
				card.style.opacity = "0";
				card.style.transform = "translateY(20px) scale(0.95)";

				setTimeout(() => {
					card.style.opacity = "1";
					card.style.transform = "translateY(0) scale(1)";
				}, index * 50);
			} else {
				card.style.animation = "mobileSlideOut 0.3s ease-in forwards";
				setTimeout(() => {
					card.style.display = "none";
				}, 300);
			}
		});
	}

	private handleTap(event: TouchEvent): void {
		const target = event.target as HTMLElement;

		// Enhanced tap feedback for mobile
		if (
			target.classList.contains("skill-card") ||
			target.closest(".skill-card")
		) {
			const card = target.closest(".skill-card") as HTMLElement;
			this.addTapEffect(card);
			this.expandSkillDetails(card);
		}

		if (target.classList.contains("filter-btn")) {
			this.addTapEffect(target);
		}
	}

	private addTapEffect(element: HTMLElement): void {
		element.style.transform = "scale(0.95)";
		element.style.transition = "transform 0.1s ease-out";

		setTimeout(() => {
			element.style.transform = "scale(1)";
			setTimeout(() => {
				element.style.transition = "";
			}, 100);
		}, 100);
	}

	private expandSkillDetails(card: HTMLElement): void {
		// Mobile-specific skill detail expansion
		const details = card.querySelector(".skill-description") as HTMLElement;
		const projects = card.querySelector(".skill-projects") as HTMLElement;

		if (details && projects) {
			const isExpanded = card.classList.contains("expanded");

			if (!isExpanded) {
				card.classList.add("expanded");
				details.style.maxHeight = `${details.scrollHeight}px`;
				projects.style.maxHeight = `${projects.scrollHeight}px`;
				card.style.transform = "scale(1.02)";
				card.style.zIndex = "10";
			} else {
				card.classList.remove("expanded");
				details.style.maxHeight = "0";
				projects.style.maxHeight = "0";
				card.style.transform = "scale(1)";
				card.style.zIndex = "";
			}
		}
	}

	private handleSwipeGesture(gesture: TouchGesture): void {
		if (!gesture.direction) return;

		switch (gesture.direction) {
			case "left":
				this.handleSwipeLeft();
				break;
			case "right":
				this.handleSwipeRight();
				break;
			case "up":
				this.handleSwipeUp();
				break;
			case "down":
				this.handleSwipeDown();
				break;
		}
	}

	private handleSwipeLeft(): void {
		// Next category
		this.navigateCategory("next");
	}

	private handleSwipeRight(): void {
		// Previous category
		this.navigateCategory("prev");
	}

	private handleSwipeUp(): void {
		// Scroll to top of skills section
		this.container?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	private handleSwipeDown(): void {
		// Could trigger refresh or navigate to analytics
		this.triggerPullToRefresh();
	}

	private navigateCategory(direction: "next" | "prev"): void {
		const categories = [
			"all",
			"frontend",
			"backend",
			"ai",
			"devops",
			"database",
			"tools",
		];
		const currentIndex = categories.indexOf(this.currentCategory);

		let newIndex: number;
		if (direction === "next" && currentIndex < categories.length - 1) {
			newIndex = currentIndex + 1;
		} else if (direction === "prev" && currentIndex > 0) {
			newIndex = currentIndex - 1;
		} else {
			return;
		}

		this.switchCategory(categories[newIndex]);
	}

	private setupSwipeNavigation(): void {
		// Add swipe indicators for mobile users
		const swipeIndicator = document.createElement("div");
		swipeIndicator.className = "mobile-swipe-indicator";
		swipeIndicator.innerHTML = `
      <div class="swipe-hint">
        <span class="swipe-arrow left">‹</span>
        <span class="swipe-text">Swipe to navigate categories</span>
        <span class="swipe-arrow right">›</span>
      </div>
    `;

		this.container?.appendChild(swipeIndicator);

		// Hide indicator after user interaction
		setTimeout(() => {
			swipeIndicator.style.opacity = "0";
			setTimeout(() => swipeIndicator.remove(), 300);
		}, 3000);
	}

	private optimizeMobileAnimations(): void {
		// Reduce animations for lower-end devices
		const isLowEndDevice = this.detectLowEndDevice();

		if (isLowEndDevice) {
			document.documentElement.style.setProperty(
				"--animation-duration",
				"0.2s",
			);
			document.documentElement.style.setProperty(
				"--transition-duration",
				"0.1s",
			);
		}

		// Use CSS containment for better performance
		this.skillCards?.forEach((card) => {
			card.style.contain = "layout style paint";
		});
	}

	private detectLowEndDevice(): boolean {
		// Simple heuristics for low-end device detection
		interface NavigatorWithDeviceMemory extends Navigator {
			deviceMemory?: number;
		}

		const memory = (navigator as NavigatorWithDeviceMemory).deviceMemory;
		const cores = navigator.hardwareConcurrency;

		return Boolean((memory && memory < 4) || (cores && cores < 4));
	}

	private setupPullToRefresh(): void {
		let startY = 0;
		let pullDistance = 0;
		const maxPullDistance = 100;

		const pullToRefreshElement = document.createElement("div");
		pullToRefreshElement.className = "pull-to-refresh";
		pullToRefreshElement.innerHTML = `
      <div class="pull-icon">↓</div>
      <div class="pull-text">Pull to refresh skills</div>
    `;

		this.container?.prepend(pullToRefreshElement);

		this.container?.addEventListener(
			"touchstart",
			(e) => {
				if (window.scrollY === 0) {
					startY = e.touches[0].clientY;
				}
			},
			{ passive: true },
		);

		this.container?.addEventListener("touchmove", (e) => {
			if (window.scrollY === 0 && startY > 0) {
				pullDistance = e.touches[0].clientY - startY;

				if (pullDistance > 0) {
					e.preventDefault();
					const opacity = Math.min(pullDistance / maxPullDistance, 1);
					pullToRefreshElement.style.opacity = opacity.toString();
					pullToRefreshElement.style.transform = `translateY(${Math.min(pullDistance, maxPullDistance)}px)`;
				}
			}
		});

		this.container?.addEventListener("touchend", () => {
			if (pullDistance > maxPullDistance) {
				this.triggerPullToRefresh();
			}

			pullToRefreshElement.style.opacity = "0";
			pullToRefreshElement.style.transform = "translateY(0)";
			startY = 0;
			pullDistance = 0;
		});
	}

	private triggerPullToRefresh(): void {
		// Simulate refresh with haptic feedback
		this.triggerHapticFeedback();

		// Refresh skills data or navigate to analytics
		console.log("Refreshing skills data...");

		// Could dispatch custom event for skill refresh
		window.dispatchEvent(new CustomEvent("skillsRefresh"));
	}

	private enhanceScrolling(): void {
		// Smooth scrolling behavior for mobile
		let isScrolling = false;

		this.container?.addEventListener(
			"scroll",
			() => {
				if (!isScrolling) {
					isScrolling = true;
					requestAnimationFrame(() => {
						// Add scroll-based animations or effects
						this.handleScrollEffects();
						isScrolling = false;
					});
				}
			},
			{ passive: true },
		);
	}

	private handleScrollEffects(): void {
		// Parallax effect for skill cards on scroll
		this.skillCards?.forEach((card) => {
			const rect = card.getBoundingClientRect();
			const viewportHeight = window.innerHeight;

			if (rect.top < viewportHeight && rect.bottom > 0) {
				const scrollProgress =
					(viewportHeight - rect.top) / (viewportHeight + rect.height);
				const parallaxOffset = (scrollProgress - 0.5) * 20;

				card.style.transform = `translateY(${parallaxOffset}px)`;
			}
		});
	}

	private triggerHapticFeedback(): void {
		// Trigger haptic feedback if available
		if ("vibrate" in navigator) {
			navigator.vibrate(50);
		}
	}

	// Public methods for external control
	public getCurrentCategory(): string {
		return this.currentCategory;
	}

	public setCategory(category: string): void {
		this.switchCategory(category);
	}

	public destroy(): void {
		// Clean up event listeners and elements
		this.container?.removeEventListener("touchstart", () => {});
		this.container?.removeEventListener("touchmove", () => {});
		this.container?.removeEventListener("touchend", () => {});

		const indicators = document.querySelectorAll(
			".mobile-swipe-indicator, .pull-to-refresh",
		);
		indicators.forEach((el) => {
			el.remove();
		});
	}
}

// CSS styles for mobile enhancements
export const mobileSkillsStyles = `
  @keyframes mobileSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes mobileSlideOut {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
  }

  .mobile-swipe-indicator {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 14px;
    z-index: 1000;
    transition: opacity 0.3s ease;
  }

  .swipe-hint {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .swipe-arrow {
    font-size: 18px;
    animation: pulse 2s infinite;
  }

  .pull-to-refresh {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0;
    transition: all 0.3s ease;
    color: #666;
    font-size: 14px;
  }

  .pull-icon {
    font-size: 20px;
    animation: bounce 1s infinite;
  }

  .skill-card.expanded {
    transform: scale(1.02);
    z-index: 10;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .skill-card.expanded .skill-description,
  .skill-card.expanded .skill-projects {
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
    60% { transform: translateY(-3px); }
  }

  /* Mobile-specific optimizations */
  @media (max-width: 768px) {
    .skill-card {
      contain: layout style paint;
      will-change: transform;
    }

    .skills-grid {
      scroll-behavior: smooth;
    }

    /* Touch target optimization */
    .filter-btn {
      min-height: 44px;
      min-width: 44px;
    }

    /* Improved readability */
    .skill-name {
      font-size: 1.1rem;
      line-height: 1.3;
    }

    .skill-description {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .skill-projects {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .skill-card {
      animation: none !important;
      transition: none !important;
    }

    .mobile-swipe-indicator,
    .pull-to-refresh {
      animation: none !important;
    }
  }
`;

// Initialize mobile enhancements
export function initializeMobileSkillsEnhancer(): MobileSkillsEnhancer | null {
	if (typeof window !== "undefined" && "ontouchstart" in window) {
		// Inject mobile styles
		const style = document.createElement("style");
		style.textContent = mobileSkillsStyles;
		document.head.appendChild(style);

		// Initialize mobile enhancer
		return new MobileSkillsEnhancer();
	}
	return null;
}
