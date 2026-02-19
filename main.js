/* ============================================================
   RESTFUL SEED FARM — main.js
   Features:
   - Sticky navbar with scroll class
   - Mobile hamburger menu toggle
   - Scroll-reveal animations (IntersectionObserver)
   - Contact form validation & success state
   - Smooth active nav link highlighting
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR: Scrolled State ────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load


  /* ── 2. MOBILE MENU TOGGLE ────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ── 3. SCROLL REVEAL (IntersectionObserver) ──────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      threshold: 0.12,      // Trigger when 12% visible
      rootMargin: '0px 0px -40px 0px' // Slight bottom offset
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all elements immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }


  /* ── 4. ACTIVE NAV LINK ON SCROLL ────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  const activateNavLink = () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateNavLink, { passive: true });

  // Add active style via JS (non-intrusive — just an attribute flag)
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: white !important;
      background: rgba(255,255,255,0.1) !important;
    }
    .nav-cta.active {
      background: var(--grad-btn-hover) !important;
    }
  `;
  document.head.appendChild(style);


  /* ── 5. CONTACT FORM ──────────────────────────────────── */
  const form        = document.getElementById('contact-form');
  const successMsg  = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple client-side validation
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        shakeForm(form);
        return;
      }

      if (!emailRe.test(email)) {
        form.querySelector('#email').focus();
        shakeForm(form);
        return;
      }

      // Simulate submission (replace with fetch/AJAX to your backend)
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending… 🌿';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Send Message 🌿';
        submitBtn.disabled = false;
        successMsg.classList.add('visible');

        setTimeout(() => {
          successMsg.classList.remove('visible');
        }, 5000);
      }, 1200);
    });
  }

  function shakeForm(el) {
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => {
      el.style.animation = '';
    }, { once: true });
  }

  // Add shake keyframe
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25%       { transform: translateX(-8px); }
      75%       { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(shakeStyle);


  /* ── 6. SMOOTH SCROLL (polyfill for older browsers) ──── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── 7. HERO PARALLAX (subtle) ─────────────────────── */
  const heroBg = document.querySelector('.hero-bg-orbs');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

});
