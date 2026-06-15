const getCurrentPage = () => window.location.pathname.split('/').pop() || 'index.html';

const normalizePageHref = (href) => {
  try {
    return new URL(href, window.location.href).pathname.split('/').pop() || 'index.html';
  } catch {
    return href.split('/').pop() || 'index.html';
  }
};

const isCurrentPageHref = (href) => normalizePageHref(href) === getCurrentPage();

const removeCurrentPageLinks = (root) => {
  root.querySelectorAll('a[href]').forEach((link) => {
    if (isCurrentPageHref(link.getAttribute('href'))) {
      link.remove();
    }
  });
};

const setupMobileNavigation = () => {
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelector('.nav-links');

  if (!nav || !navLinks || nav.querySelector('.menu-toggle')) return;

  const menuButton = document.createElement('button');
  menuButton.className = 'menu-toggle';
  menuButton.type = 'button';
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  menuButton.setAttribute('aria-controls', 'mobileSidebar');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = '<span></span><span></span><span></span>';

  const sidebar = document.createElement('aside');
  sidebar.className = 'mobile-sidebar';
  sidebar.id = 'mobileSidebar';
  sidebar.setAttribute('aria-hidden', 'true');

  const sidebarHeader = document.createElement('div');
  sidebarHeader.className = 'mobile-sidebar-header';

  const sidebarTitle = document.createElement('span');
  sidebarTitle.textContent = 'Menu';

  const closeButton = document.createElement('button');
  closeButton.className = 'menu-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close navigation menu');
  closeButton.innerHTML = '&times;';

  const sidebarLinks = navLinks.cloneNode(true);
  sidebarLinks.classList.remove('nav-links');
  sidebarLinks.classList.add('mobile-sidebar-links');

  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-backdrop';
  backdrop.hidden = true;

  sidebarHeader.append(sidebarTitle, closeButton);
  sidebar.append(sidebarHeader, sidebarLinks);
  nav.appendChild(menuButton);
  document.body.append(sidebar, backdrop);

  const setOpen = (isOpen) => {
    document.body.classList.toggle('menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    sidebar.setAttribute('aria-hidden', String(!isOpen));
    backdrop.hidden = !isOpen;

    if (isOpen) {
      closeButton.focus();
    } else {
      menuButton.focus();
    }
  };

  menuButton.addEventListener('click', () => {
    setOpen(!document.body.classList.contains('menu-open'));
  });

  closeButton.addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  sidebarLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && document.body.classList.contains('menu-open')) {
      setOpen(false);
    }
  });
};

const setupPageIdentity = () => {
  const path = getCurrentPage();
  document.body.classList.toggle('is-home-page', path === 'index.html');
};

const setupCurrentPageNavigation = () => {
  document.querySelectorAll('.nav-links, .hero-nav').forEach(removeCurrentPageLinks);
};

const setupSharedFooter = () => {
  const footerHtml = `
    <div class="footer-shell">
      <nav class="footer-links" aria-label="Footer links">
          <a href="services.html">Services</a>
          <a href="terms.html">Terms</a>
          <a href="privacy.html">Privacy</a>
          <a href="compliance.html">Compliance</a>
          <a href="projects.html">Projects</a>
      </nav>
      <div class="footer-meta">
        <span>Batshas Holdings and Enterprises (Pty) Ltd</span>
        <span>&copy; 2024</span>
      </div>
    </div>
  `;

  document.querySelectorAll('footer.footer').forEach((footer) => {
    footer.innerHTML = footerHtml;
    removeCurrentPageLinks(footer);
  });
};

const createTopPageNav = () => {
  const links = [
    ['index.html', 'Home'],
    ['about.html', 'About'],
    ['services.html', 'Services'],
    ['compliance.html', 'Compliance'],
    ['learners.html', 'Learners'],
    ['projects.html', 'Projects'],
    ['contact.html', 'Contact']
  ];
  const nav = document.createElement('nav');
  nav.className = 'page-top-nav';
  nav.setAttribute('aria-label', 'Page navigation');

  links
    .filter(([href]) => !isCurrentPageHref(href))
    .forEach(([href, label]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      nav.appendChild(link);
    });

  return nav;
};

const setupTopPageNavigation = () => {
  if (document.querySelector('.hero-nav, .page-top-nav')) return;

  const main = document.querySelector('main');

  if (!main) return;

  main.prepend(createTopPageNav());
};

const setupScrollReveals = () => {
  const revealItems = [
    ...document.querySelectorAll('.hero-bottom .intro-grid, .home-statements .statement'),
    ...document.querySelectorAll('.home-statements .values p'),
    ...document.querySelectorAll('.about-grid > div, .why, .why li, .future-build'),
    ...document.querySelectorAll('.services-hero, .service-entry'),
    ...document.querySelectorAll('.contact-copy, .contact-media, .contact-item, .contact-map'),
    ...document.querySelectorAll('.compliance-intro, .compliance-panel, .proof-list li, .proof-card'),
    ...document.querySelectorAll('.learner-copy, .learner-media, .learner-card, .learner-note'),
    ...document.querySelectorAll('.projects-hero > div, .projects-media, .project-focus, .empty-projects')
  ];

  if (!revealItems.length) return;

  revealItems.forEach((item, index) => {
    item.classList.add('scroll-reveal');
    item.style.setProperty('--reveal-delay', `${Math.min(index * 80, 420)}ms`);
  });

  document.querySelector('.home-statements .statement:nth-of-type(1)')?.classList.add('reveal-from-left');
  document.querySelector('.home-statements .statement:nth-of-type(2)')?.classList.add('reveal-from-right');
  document.querySelector('.about-grid > div:first-child')?.classList.add('reveal-from-left');
  document.querySelector('.about-grid > div:nth-child(2)')?.classList.add('reveal-from-right');
  document.querySelectorAll('.service-entry').forEach((item, index) => {
    item.classList.add(index % 2 === 0 ? 'reveal-from-left' : 'reveal-from-right');
  });
  document.querySelector('.contact-copy')?.classList.add('reveal-from-left');
  document.querySelector('.contact-media')?.classList.add('reveal-from-right');
  document.querySelector('.contact-map')?.classList.add('reveal-from-right');
  document.querySelector('.compliance-intro')?.classList.add('reveal-from-left');
  document.querySelector('.learner-copy')?.classList.add('reveal-from-left');
  document.querySelector('.learner-media')?.classList.add('reveal-from-right');
  document.querySelector('.learner-note')?.classList.add('reveal-from-right');
  document.querySelector('.projects-hero > div')?.classList.add('reveal-from-left');
  document.querySelector('.projects-media')?.classList.add('reveal-from-right');
  document.querySelector('.empty-projects')?.classList.add('reveal-from-left');

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12
    }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const setupScrollHeader = () => {
  const header = document.querySelector('.site-header');

  if (!header) return;

  const updateHeader = () => {
    const isVisible = window.scrollY > 72 || document.body.classList.contains('menu-open');
    header.classList.toggle('site-header-visible', isVisible);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);
};

const setupServiceWorker = () => {
  if (!('serviceWorker' in navigator)) return;
  if (!['localhost', '127.0.0.1'].includes(window.location.hostname) && window.location.protocol !== 'https:') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
};

document.addEventListener('DOMContentLoaded', setupPageIdentity);
document.addEventListener('DOMContentLoaded', setupCurrentPageNavigation);
document.addEventListener('DOMContentLoaded', setupMobileNavigation);
document.addEventListener('DOMContentLoaded', setupSharedFooter);
document.addEventListener('DOMContentLoaded', setupTopPageNavigation);
document.addEventListener('DOMContentLoaded', setupScrollReveals);
document.addEventListener('DOMContentLoaded', setupScrollHeader);
document.addEventListener('DOMContentLoaded', setupServiceWorker);
