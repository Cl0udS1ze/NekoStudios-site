/* Page wiring: render data, mobile menu, active navigation, footer year. */
(function () {
  'use strict';

  var components = window.NekoComponents;
  var repo = window.NekoRepository;
  var ui = window.NekoUI;
  var grid = document.getElementById('project-grid');

  if (repo && components && grid) {
    grid.innerHTML = ui ? ui.loading() : '';
    repo.getProjects().then(function (projects) {
      grid.innerHTML = projects.map(components.projectCard).join('');
    }).catch(function (error) {
      if (window.console && console.error) console.error('[NekoStudios] Projects load failed', error);
      grid.innerHTML = ui ? ui.error('Projects could not be loaded.') : '';
    });
  }

  // Latest publications on the home page, from the same data layer.
  var newsGrid = document.getElementById('home-news-grid');
  var newsViews = window.NekoNewsComponents;
  if (repo && newsViews && newsGrid) {
    newsGrid.innerHTML = ui ? ui.loading() : '';
    repo.getPosts().then(function (posts) {
      var latest = posts.slice(0, 3);
      newsGrid.innerHTML = latest.length
        ? latest.map(function (post) { return newsViews.newsCard(post, false); }).join('')
        : (ui ? ui.empty('Пока нет публикаций', 'Новости и devlog появятся здесь.') : '');
    }).catch(function (error) {
      if (window.console && console.error) console.error('[NekoStudios] Home news load failed', error);
      newsGrid.innerHTML = ui ? ui.error('Публикации не загрузились.') : '';
    });
  }

  // Local catalogue filters. The data shape stays the same for a future API.
  var filters = document.getElementById('project-filters');
  if (grid && filters) {
    var buttons = filters.querySelectorAll('[data-filter]');
    function applyFilter(name) {
      var cards = grid.querySelectorAll('.project-card');
      Array.prototype.forEach.call(cards, function (card) {
        var tokens = (card.getAttribute('data-filters') || '').split(/\s+/);
        card.hidden = name !== 'all' && tokens.indexOf(name) === -1;
      });
      Array.prototype.forEach.call(buttons, function (button) {
        var active = button.getAttribute('data-filter') === name;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }
    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        applyFilter(button.getAttribute('data-filter'));
      });
    });
  }

  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('is-open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });

    window.addEventListener('resize', closeMenu);
  }

  var navLinks = document.querySelectorAll('[data-nav]');
  var isHome = document.body && document.body.getAttribute('data-page') === 'home';
  if (isHome && 'IntersectionObserver' in window && navLinks.length) {
    var sections = Array.prototype.map.call(navLinks, function (link) {
      return document.getElementById(link.getAttribute('data-nav'));
    }).filter(Boolean);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute('data-nav') === entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
