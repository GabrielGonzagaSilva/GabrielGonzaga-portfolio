(() => {
  const root = document.body.dataset.root || './';
  const page = document.body.dataset.page || 'Page';
  const headerMount = document.querySelector('[data-site-header]');
  const footerMount = document.querySelector('[data-site-footer]');
  const workCasePages = new Set(['QuantoLab', 'Aureum Hub']);
  const routes = [
    ['Work', `${root}work/`],
    ['About', `${root}about/`],
    ['Experience', `${root}experience/`],
    ['Contact', `${root}#contact`],
  ];

  const createText = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text;
    return node;
  };

  const createRouteLink = (label, href) => {
    const link = createText('a', '', label);
    link.href = href;
    if (page === label || (workCasePages.has(page) && label === 'Work')) {
      link.setAttribute('aria-current', 'page');
    }
    return link;
  };

  if (headerMount) {
    const header = document.createElement('header');
    header.className = 'site-header';

    const inner = document.createElement('div');
    inner.className = 'header-inner';

    const brand = createRouteLink('Gabriel Gonzaga', root);
    brand.className = 'brand';
    brand.setAttribute('aria-label', 'Gabriel Gonzaga — Home');
    if (page === 'Home') brand.setAttribute('aria-current', 'page');
    inner.append(brand);

    const desktopNav = document.createElement('nav');
    desktopNav.className = 'desktop-nav';
    desktopNav.setAttribute('aria-label', 'Primary navigation');
    routes.forEach(([label, href]) => desktopNav.append(createRouteLink(label, href)));
    inner.append(desktopNav);

    const menuButton = createText('button', 'mobile-menu-button', 'MENU');
    menuButton.type = 'button';
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-controls', 'mobile-menu');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    inner.append(menuButton);

    const panel = document.createElement('div');
    panel.id = 'mobile-menu';
    panel.className = 'mobile-panel';
    panel.hidden = true;

    const mobileNav = document.createElement('nav');
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    routes.forEach(([label, href]) => mobileNav.append(createRouteLink(label, href)));
    panel.append(mobileNav);

    header.append(inner, panel);
    headerMount.append(header);
  }

  if (footerMount) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    const inner = document.createElement('div');
    inner.className = 'footer-inner';
    const context = page === 'Home' ? 'Portfolio / Product Designer' : workCasePages.has(page) ? `Case Study / ${page}` : `Portfolio / ${page}`;
    inner.append(
      createText('span', 'footer-label', 'Gabriel Gonzaga'),
      createText('span', 'footer-label', context),
    );
    footer.append(inner);
    footerMount.append(footer);
  }

  const menuButton = document.querySelector('.mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  if (menuButton && menu) {
    const close = () => {
      menu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
      document.body.classList.remove('menu-open');
    };
    const open = () => {
      menu.hidden = false;
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'Close navigation menu');
      document.body.classList.add('menu-open');
      menu.querySelector('a')?.focus();
    };
    menuButton.addEventListener('click', () => menu.hidden ? open() : close());
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) {
        close();
        menuButton.focus();
      }
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    window.matchMedia('(min-width: 768px)').addEventListener('change', event => {
      if (event.matches) close();
    });
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-project-categories]');
  if (filterButtons.length && cards.length) {
    let active = '';
    const apply = () => {
      cards.forEach(card => {
        const categories = (card.dataset.projectCategories || '').split(' ');
        card.hidden = Boolean(active && !categories.includes(active));
      });
      filterButtons.forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.filter === active));
      });
    };
    filterButtons.forEach(button => button.addEventListener('click', () => {
      active = active === button.dataset.filter ? '' : button.dataset.filter;
      apply();
    }));
  }
})();
