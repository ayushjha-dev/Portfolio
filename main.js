document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set current year in footer
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Theme Management (Light / Dark mode)
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = themeToggle ? themeToggle.querySelector('.theme-toggle-label') : null;
  
  // Get initial theme from localStorage or system preferences
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  };

  let currentTheme = getInitialTheme();

  // Apply theme to document
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    currentTheme = theme;
    
    // Always show "LIGHT" label
    if (themeLabel) {
      themeLabel.textContent = 'Light';
    }
  };

  // Initial application
  applyTheme(currentTheme);

  // Toggle button event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Dynamic India Local Time
  const updateLocalTime = () => {
    const timeElement = document.getElementById('localTime');
    if (!timeElement) return;

    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
      };
      
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      timeElement.textContent = formatter.format(new Date());
    } catch (e) {
      // Fallback if Europe/London timezone formatting fails
      const fallbackTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
      timeElement.textContent = `${fallbackTime} GMT`;
    }
  };

  // Run immediately and update every second
  updateLocalTime();
  setInterval(updateLocalTime, 1000);

  // Progressive Reveal on Scroll (Intersection Observer)
  const observeScrollReveal = () => {
    const revealElements = document.querySelectorAll(
      '.hero-headline, .hero-meta-item, .project-item, .timeline-item, .about-headline, .about-body, .skills-category, .footer-cta'
    );

    // Apply inline initial styles programmatically to avoid FOUC if JS is disabled
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const observerOptions = {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px' // triggers slightly before entry to avoid awkward delays
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
          // Unobserve after showing to prevent unnecessary runs
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  };

  // Check if browser supports IntersectionObserver
  if ('IntersectionObserver' in window) {
    observeScrollReveal();
  }
});
