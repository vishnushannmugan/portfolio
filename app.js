/**
 * Portfolio JavaScript - Theme Toggle and Interactions
 * Author: Vishnu Shanmugan
 */

class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupAnimations();
    this.setupInteractions();
    this.initializeTheme();
  }

  /**
   * Theme Management
   */
  setupThemeToggle() {
    this.themeToggle = document.querySelector('.theme-toggle');
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  initializeTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemPreference;
    
    this.setTheme(initialTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
      if (!localStorage.getItem('portfolio-theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    
    // Save preference
    localStorage.setItem('portfolio-theme', newTheme);
    
    // Add a subtle feedback animation
    this.themeToggle.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.themeToggle.style.transform = '';
    }, 150);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle button aria-label
    if (this.themeToggle) {
      this.themeToggle.setAttribute('aria-label', 
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      );
    }
    
    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  /**
   * Animation Setup
   */
  setupAnimations() {
    // Intersection Observer for scroll animations
    this.observeElements();
    
    // Parallax effect for header
    this.setupParallax();
    
    // Smooth scrolling for anchor links
    this.setupSmoothScrolling();
  }

  observeElements() {
    // Only run animations if user hasn't requested reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe sections for fade-in animation
    const sectionsToObserve = document.querySelectorAll('section, .subdomain-card, .update-card');
    sectionsToObserve.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(section);
    });
  }

  setupParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const header = document.querySelector('.header');
    if (header) {
      let ticking = false;
      
      const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const parallax = header.querySelector('.header::before');
        if (parallax && scrolled < header.offsetHeight) {
          const speed = scrolled * 0.5;
          header.style.transform = `translateY(${speed}px)`;
        }
        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      });
    }
  }

  setupSmoothScrolling() {
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Interactive Elements
   */
  setupInteractions() {
    this.setupCardInteractions();
    this.setupLinkTracking();
    this.setupFormValidation();
    this.setupKeyboardNavigation();
  }

  setupCardInteractions() {
    const cards = document.querySelectorAll('.subdomain-card, .update-card');
    
    cards.forEach(card => {
      // Add focus styles for keyboard navigation
      card.addEventListener('focusin', () => {
        card.style.transform = 'translateY(-4px)';
      });
      
      card.addEventListener('focusout', () => {
        if (!card.matches(':hover')) {
          card.style.transform = '';
        }
      });
      
      // Add click handler for cards with links
      const link = card.querySelector('a');
      if (link && !card.dataset.status === 'coming-soon') {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
          // Only trigger if click wasn't on the link itself
          if (e.target !== link && !link.contains(e.target)) {
            link.click();
          }
        });
      }
    });
  }

  setupLinkTracking() {
    // Track external link clicks for analytics (placeholder)
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const url = link.href;
        const linkText = link.textContent.trim();
        
        // Analytics tracking would go here
        console.log('External link clicked:', { url, linkText });
        
        // Add visual feedback
        link.style.transform = 'scale(0.98)';
        setTimeout(() => {
          link.style.transform = '';
        }, 100);
      });
    });
  }

  setupFormValidation() {
    // Email link validation and formatting
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const email = link.href.replace('mailto:', '');
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          e.preventDefault();
          console.error('Invalid email address:', email);
          return;
        }
        
        // Track email clicks
        console.log('Email link clicked:', email);
      });
    });
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Skip to main content with 'S' key
      if (e.key.toLowerCase() === 's' && e.altKey) {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Toggle theme with 'T' key
      if (e.key.toLowerCase() === 't' && e.altKey) {
        e.preventDefault();
        this.toggleTheme();
      }
    });

    // Add focus indicators for better accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  /**
   * Utility Functions
   */
  
  // Debounce function for performance optimization
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Performance and Error Handling
   */
  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Portfolio error:', e.error);
      // Could send error reports to analytics service
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      // Could send error reports to analytics service
    });
  }

  /**
   * Latest Updates Management (Placeholder for future dynamic content)
   */
  async loadLatestUpdates() {
    // Placeholder for future API integration
    // This could fetch latest posts from subdomains
    try {
      // const updates = await fetch('/api/latest-updates');
      // const data = await updates.json();
      // this.renderUpdates(data);
      
      console.log('Latest updates loaded (placeholder)');
    } catch (error) {
      console.error('Failed to load latest updates:', error);
    }
  }

  renderUpdates(updates) {
    const updatesGrid = document.querySelector('.updates-grid');
    if (!updatesGrid || !updates) return;

    updatesGrid.innerHTML = updates.map(update => `
      <article class="update-card">
        <div class="update-header">
          <span class="update-type">${update.type}</span>
          <time class="update-date" datetime="${update.date}">
            ${new Date(update.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </time>
        </div>
        <h3 class="update-title">${update.title}</h3>
        <p class="update-description">${update.description}</p>
        <a href="${update.link}" target="_blank" class="update-link">
          Read More
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </article>
    `).join('');
  }
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the main application
  const app = new PortfolioApp();
  
  // Make app available globally for debugging
  window.portfolioApp = app;
  
  // Initialize latest updates (placeholder)
  app.loadLatestUpdates();
});

/**
 * Handle page visibility changes for performance optimization
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause any intensive operations
    console.log('Page hidden, pausing operations');
  } else {
    // Page is visible, resume operations
    console.log('Page visible, resuming operations');
  }
});

/**
 * Service Worker Registration (for future PWA capabilities)
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Commented out for now - can be enabled when service worker is created
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(error => console.log('SW registration failed'));
  });
}

/**
 * Console welcome message
 */
console.log(`
🛡️ Vishnu Shanmugan Portfolio
✨ Built with modern web technologies
🔧 Theme toggle: Alt + T
⌨️  Skip to main: Alt + S
📧 Contact: contact@vishnushanmugan.in
`);

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioApp;
}
