/* Page wiring: render data, mobile menu, active navigation, footer year. */
(function () {
  'use strict';

  var components = window.NekoComponents;
  var repo = window.NekoRepository;
  var ui = window.NekoUI;
  var i18n = window.NekoI18n;
  var grid = document.getElementById('project-grid');
  var currentFilter = 'all';
  var filterButtons = null;

  function t(key, vars) { return i18n ? i18n.t(key, vars) : key; }
  function content(value) { return i18n ? i18n.content(value) : value; }

  /* ---------- Projects on the home page ---------- */
  function paintProjects() {
    if (!grid || !components) return;
    var cards = grid.querySelectorAll('.project-card');
    Array.prototype.forEach.call(cards, function (card) {
      var tokens = (card.getAttribute('data-filters') || '').split(/\s+/);
      card.hidden = currentFilter !== 'all' && tokens.indexOf(currentFilter) === -1;
    });
    if (filterButtons) {
      Array.prototype.forEach.call(filterButtons, function (button) {
        var active = button.getAttribute('data-filter') === currentFilter;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }
  }

  function renderProjects(projects) {
    if (!grid || !components) return;
    grid.innerHTML = projects.map(components.projectCard).join('');
    paintProjects();
  }

  var projectsPromise = null;
  if (repo && components && grid) {
    grid.innerHTML = ui ? ui.loading() : '';
    projectsPromise = repo.getProjects().then(function (projects) {
      renderProjects(projects);
      featuredProject = projects.filter(function (p) { return p.id === 'deep-mine'; })[0] || projects[0] || null;
      paintFeatured(featuredProject);
      return projects;
    }).catch(function (error) {
      if (window.console && console.error) console.error('[NekoStudios] Projects load failed', error);
      grid.innerHTML = ui ? ui.error(t('projects_load_error')) : '';
      return [];
    });
  }

  /* ---------- Featured project ---------- */
  function paintFeatured(project) {
    var root = document.getElementById('featured-project');
    if (!root || !project) return;
    var title = document.getElementById('featured-title');
    var description = document.getElementById('featured-description');
    var meta = document.getElementById('featured-meta');
    var link = document.getElementById('featured-link');
    var play = document.getElementById('featured-play');
    var art = document.getElementById('featured-art');

    if (title) title.textContent = project.title;
    if (description) description.textContent = i18n
      ? i18n.projectText(project.id, 'description', project.description)
      : project.description;
    if (meta) meta.textContent = content(project.categoryLabel) + ' · ' + t('status_' + project.status);
    if (link) {
      link.href = 'project.html?id=' + encodeURIComponent(project.id);
      link.textContent = t('home_featured_open');
    }
    if (play) {
      play.hidden = project.id !== 'deep-mine';
      play.textContent = t('play_browser');
    }
    if (art && project.art) {
      art.className = 'featured-art art--' + project.art;
    }
  }

  var featuredProject = null;

  /* ---------- Latest publications on the home page ---------- */
  var newsGrid = document.getElementById('home-news-grid');
  var newsViews = window.NekoNewsComponents;
  var homePosts = [];

  function renderHomeNews() {
    if (!newsGrid || !newsViews) return;
    if (!homePosts.length) {
      newsGrid.innerHTML = ui ? ui.empty(t('news_no_posts_title'), t('news_no_posts_text')) : '';
      return;
    }
    newsGrid.innerHTML = homePosts.map(function (post) {
      return newsViews.newsCard(post, false);
    }).join('');
  }

  if (repo && newsViews && newsGrid) {
    newsGrid.innerHTML = ui ? ui.loading() : '';
    repo.getPosts().then(function (posts) {
      homePosts = posts.slice(0, 3);
      renderHomeNews();
    }).catch(function (error) {
      if (window.console && console.error) console.error('[NekoStudios] Home news load failed', error);
      newsGrid.innerHTML = ui ? ui.error(t('news_load_error')) : '';
    });
  }

  /* ---------- Catalogue filters ---------- */
  var filters = document.getElementById('project-filters');
  if (grid && filters) {
    filterButtons = filters.querySelectorAll('[data-filter]');
    Array.prototype.forEach.call(filterButtons, function (button) {
      button.addEventListener('click', function () {
        currentFilter = button.getAttribute('data-filter');
        paintProjects();
      });
    });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');

  function syncMenuLabel() {
    if (!toggle) return;
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-label', t(open ? 'menu_close' : 'menu_open'));
  }

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    syncMenuLabel();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
      syncMenuLabel();
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
    syncMenuLabel();
  }

  /* ---------- Active section on the home page ---------- */
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

  /* ---------- Live language switching ---------- */
  if (i18n && i18n.onChange) {
    i18n.onChange(function () {
      if (projectsPromise) {
        projectsPromise.then(function (projects) {
          if (projects && projects.length && grid) renderProjects(projects);
        });
      }
      if (featuredProject) paintFeatured(featuredProject);
      if (homePosts.length) renderHomeNews();
      syncMenuLabel();
    });
  }
})();
