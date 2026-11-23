/* Projects catalog: local filtering + search over the central project data. */
(function () {
  'use strict';

  var repo = window.NekoRepository;
  var ui = window.NekoUI;
  var components = window.NekoComponents;
  var i18n = window.NekoI18n;
  var grid = document.getElementById('project-grid');
  var filterBar = document.getElementById('project-filters');
  var search = document.getElementById('project-search');
  var empty = document.getElementById('catalog-empty');
  if (!repo || !components || !grid || !filterBar || !search || !empty) return;

  var projects = [];
  var state = { filter: 'all', query: '' };

  function t(key) { return i18n ? i18n.t(key) : key; }

  function matchesFilter(project, filter) {
    return filter === 'all' || (project.filters || []).indexOf(filter) !== -1;
  }

  function matchesQuery(project, query) {
    if (!query) return true;
    var localized = i18n ? i18n.projectText(project.id, 'description', '') : '';
    var localizedNote = i18n ? i18n.projectText(project.id, 'note', '') : '';
    var haystack = [project.title, project.description, project.note, localized, localizedNote,
      project.categoryLabel].concat(project.categories || [], project.tags || [])
      .join(' ').toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function markButtons() {
    var buttons = filterBar.querySelectorAll('[data-filter]');
    Array.prototype.forEach.call(buttons, function (button) {
      var active = button.getAttribute('data-filter') === state.filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function render() {
    var query = state.query.trim().toLowerCase();
    var visible = projects.filter(function (project) {
      return matchesFilter(project, state.filter) && matchesQuery(project, query);
    });

    grid.innerHTML = visible.map(components.projectCard).join('');
    grid.classList.add('is-filtering');
    window.setTimeout(function () { grid.classList.remove('is-filtering'); }, 300);

    if (visible.length) {
      empty.hidden = true;
      empty.innerHTML = '';
    } else {
      empty.hidden = false;
      empty.innerHTML = state.query
        ? '<h3>' + components.escapeHtml(t('projects_empty_title')) + '</h3>' +
          '<p>' + components.escapeHtml(t('projects_empty_text')) + '</p>' +
          '<button type="button" class="btn btn--ghost" data-reset>' +
          components.escapeHtml(t('projects_reset')) + '</button>'
        : '<h3>' + components.escapeHtml(t('projects_cat_empty')) + '</h3>' +
          '<button type="button" class="btn btn--ghost" data-reset>' +
          components.escapeHtml(t('projects_show_all')) + '</button>';
    }
    markButtons();
  }

  filterBar.addEventListener('click', function (event) {
    var button = event.target.closest('[data-filter]');
    if (!button) return;
    state.filter = button.getAttribute('data-filter');
    render();
  });

  search.addEventListener('input', function () {
    state.query = search.value || '';
    render();
  });

  empty.addEventListener('click', function (event) {
    if (!event.target.closest('[data-reset]')) return;
    state.filter = 'all';
    state.query = '';
    search.value = '';
    render();
  });

  grid.innerHTML = ui ? ui.loading() : '';
  repo.getProjects().then(function (list) {
    projects = list;
    render();
  }).catch(function (error) {
    if (window.console && console.error) console.error('[NekoStudios] Catalog load failed', error);
    empty.hidden = false;
    empty.innerHTML = ui ? ui.error(t('projects_load_error')) : '';
  });

  if (i18n && i18n.onChange) {
    i18n.onChange(function () {
      if (projects.length) render();
    });
  }
})();
