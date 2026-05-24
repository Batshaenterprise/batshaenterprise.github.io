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

document.addEventListener('DOMContentLoaded', setupMobileNavigation);
