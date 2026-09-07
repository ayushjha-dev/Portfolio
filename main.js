document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Set Dynamic Copyright Year
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // 3. Theme Management (Light / Dark mode)
  const themeToggle = document.getElementById('themeToggle');
  
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
      themeToggle.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }

    // Refresh lucide icons if rendered inside toggle
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  let currentTheme = getInitialTheme();
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // 4. Mobile Navigation Drawer Controller
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = mobileDrawer ? mobileDrawer.querySelector('.mobile-drawer-backdrop') : null;
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta');

  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-active');
    if (menuToggle) {
      menuToggle.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('menu-open');
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-active');
    if (menuToggle) {
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('menu-open');
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (mobileDrawer && mobileDrawer.classList.contains('is-active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-active')) {
      closeDrawer();
    }
  });

  // 5. Active Route Highlight
  const markActiveNavLinks = () => {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const cleanHref = href.toLowerCase().split('/').pop();
      const currentFile = currentPath.split('/').pop() || 'index.html';

      if (cleanHref === currentFile || (currentFile === '' && cleanHref === 'index.html')) {
        link.classList.add('active');
      }
    });
  };
  markActiveNavLinks();

  // 6. Dynamic Real-time India Local Time (IST / GMT+5:30)
  const updateLocalTime = () => {
    const timeElement = document.getElementById('localTime');
    if (!timeElement) return;

    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      timeElement.textContent = `${formatter.format(new Date())} IST`;
    } catch (e) {
      const fallbackTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
      timeElement.textContent = `${fallbackTime} IST`;
    }
  };

  updateLocalTime();
  setInterval(updateLocalTime, 1000);

  // 7. Snappy Scroll Reveal (Intersection Observer)
  const setupScrollReveal = () => {
    const revealElements = document.querySelectorAll(
      '.hero-headline, .hero-details-area, .hero-actions, .project-item, .timeline-item, .about-intro, .about-body, .section-header'
    );

    if ('IntersectionObserver' in window) {
      revealElements.forEach(el => el.classList.add('reveal-init'));

      const observerOptions = {
        root: null,
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealElements.forEach(el => observer.observe(el));
    }
  };
  setupScrollReveal();

  // 8. Copy-to-Clipboard Functionality (Email & Code Snippets)
  const setupCopyButtons = () => {
    // Copy email button in footer/contact
    const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
    copyEmailBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email') || 'ayushkrjha85@gmail.com';
        try {
          await navigator.clipboard.writeText(email);
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `<i data-lucide="check" style="width:14px;height:14px;color:var(--status-available);"></i> Copied!`;
          if (typeof lucide !== 'undefined') lucide.createIcons();
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }, 2000);
        } catch (err) {
          // Fallback
          prompt('Copy email address:', email);
        }
      });
    });

    // Copy code snippet buttons in case studies
    const copyCodeBtns = document.querySelectorAll('.code-copy-btn');
    copyCodeBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const codeBlock = btn.closest('.code-block-wrapper')?.querySelector('code');
        if (!codeBlock) return;
        try {
          await navigator.clipboard.writeText(codeBlock.innerText);
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code snippet');
        }
      });
    });
  };
  setupCopyButtons();
});
