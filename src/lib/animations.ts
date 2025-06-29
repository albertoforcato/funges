import { animate, stagger, inView } from 'motion';

// Animation presets for common UI patterns
export const animations = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },

  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    transition: { duration: 1.5, ease: 'easeOut' }
  },

  // Slide animations
  slideInFromLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },

  slideInFromRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },

  slideInFromTop: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },

  slideInFromBottom: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },

  // Scale animations
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },

  // Hover animations
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  },

  // Button animations
  buttonPress: {
    scale: 0.95,
    transition: { duration: 0.1, ease: 'easeOut' }
  },

  // Loading animations
  spin: {
    rotate: 360,
    transition: { duration: 1, ease: 'linear', repeat: Infinity }
  },

  // Stagger animations for lists
  stagger: {
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },

  // Modal animations
  modal: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2, ease: 'easeOut' }
  },

  // Dropdown animations
  dropdown: {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: { duration: 0.15, ease: 'easeOut' }
  }
};

// Simple utility functions for common animation patterns
export const animationUtils = {
  // Fade out with visibility hidden (for splash screens)
  fadeOutAndHide: (element: HTMLElement) => {
    animate(
      element,
      { opacity: [1, 0] },
      { duration: 1.5, ease: 'easeOut' }
    ).finished.then(() => {
      element.style.visibility = 'hidden';
    });
  },

  // Stagger animation for lists
  staggerList: (elements: HTMLElement[], delay: number = 0.1) => {
    animate(
      elements,
      { opacity: [0, 1], y: [20, 0] },
      { delay: stagger(delay), duration: 0.3, ease: 'easeOut' }
    );
  },

  // In-view animations
  inViewAnimation: (element: HTMLElement, animation: any) => {
    inView(element, () => {
      animate(element, animation.animate, animation.transition);
    });
  }
};

// Legacy animation migrations
export const legacyAnimations = {
  // Original fadeOut animation from legacy CSS
  splashScreenFadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    transition: { duration: 1.5, ease: 'easeOut' }
  },

  // Button hover transitions
  buttonHover: {
    transition: { duration: 0.2, ease: 'ease' }
  },

  // Loading spinner rotation
  loadingSpinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, ease: 'linear', repeat: Infinity }
  }
}; 