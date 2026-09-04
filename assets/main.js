(() => {
  const root = document.body.dataset.root || './';
  const page = document.body.dataset.page || 'Page';
  const headerMount = document.querySelector('[data-site-header]');
  const footerMount = document.querySelector('[data-site-footer]');
  const routes = [
    ['Work', `${root}work/`],
    ['About', `${root}about/`],
    ['Experience', `${root}experience/`],
  ];

  if (headerMount) {
    headerMount.innerHTML = `
      <header class="site-header">
        <div class="header-inner">
          <a class="brand" href="${root}" aria-label="Gabriel Gonzaga — Home">Gabriel Gonzaga</a>
          <nav class="desktop-nav" aria-label="Primary navigation">
            ${routes.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
            <span class="locale" aria-label="Language selector coming later">EN / PT</span>
          </nav>
          <button class="mobile-menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu">MENU</button>
        </div>
        <div id="mobile-menu" class="mobile-panel" hidden>
          <nav aria-label="Mobile navigation">
            ${routes.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
            <span class="locale">EN / PT</span>
          </nav>
        </div>
      </header>`;
  }

  if (footerMount) {
    footerMount.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <span class="footer-label">Gabriel Gonzaga</span>
          <span class="footer-label">Portfolio / ${page}</span>
        </div>
      </footer>`;
  }

  const menuButton = document.querySelector('.mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  if (menuButton && menu) {
    const close = () => {
      menu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };
    const open = () => {
      menu.hidden = false;
      menuButton.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      menu.querySelector('a')?.focus();
    };
    menuButton.addEventListener('click', () => menu.hidden ? open() : close());
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { close(); menuButton.focus(); } });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    window.matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) close(); });
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
      filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === active)));
    };
    filterButtons.forEach(button => button.addEventListener('click', () => {
      active = active === button.dataset.filter ? '' : button.dataset.filter;
      apply();
    }));
  }
})();
