/* Small reusable view components. Each returns markup for a given data object. */
(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function t(key) { return window.NekoI18n ? window.NekoI18n.t(key) : key; }
  function content(value) { return window.NekoI18n ? window.NekoI18n.content(value) : value; }

  function statusBadge(statusKey) {
    var data = window.NekoData;
    var meta = data && data.getStatusMeta
      ? data.getStatusMeta(statusKey)
      : { label: String(statusKey || ''), className: 'status--dev' };
    var translated = t('status_' + statusKey);
    var label = translated.indexOf('status_') === 0 ? meta.label : translated;
    return '<span class="project-status ' + escapeHtml(meta.className) + '">' +
      escapeHtml(label) + '</span>';
  }

  function projectCard(project) {
    var i18n = window.NekoI18n;
    var description = i18n
      ? i18n.projectText(project.id, 'description', project.description)
      : project.description;
    var category = content(project.categoryLabel || 'Project');
    var tags = (project.tags || []).map(function (tag) {
      return '<span>' + escapeHtml(content(tag)) + '</span>';
    }).join('');
    var filters = (project.filters || []).join(' ');
    var searchText = [project.title, project.description, description, project.categoryLabel,
      category, project.note].concat(project.categories || [], project.tags || [])
      .join(' ').toLowerCase();

    return '' +
      '<article class="project-card" data-project="' + escapeHtml(project.id) +
        '" data-filters="' + escapeHtml(filters) +
        '" data-search="' + escapeHtml(searchText) + '">' +
        '<a class="project-art art--' + escapeHtml(project.art || 'mine') +
          '" href="project.html?id=' + encodeURIComponent(project.id) +
          '" aria-label="' + escapeHtml(t('view_project') + ': ' + project.title) + '">' +
          statusBadge(project.status) +
        '</a>' +
        '<div class="project-body">' +
          '<span class="project-category">' + escapeHtml(category) + '</span>' +
          '<h3>' + escapeHtml(project.title) + '</h3>' +
          '<p>' + escapeHtml(description) + '</p>' +
          '<div class="project-tags">' + tags + '</div>' +
          '<a class="project-link" href="project.html?id=' + encodeURIComponent(project.id) +
            '">' + escapeHtml(t('view_project')) + ' <span aria-hidden="true">→</span></a>' +
        '</div>' +
      '</article>';
  }

  window.NekoComponents = {
    escapeHtml: escapeHtml,
    statusBadge: statusBadge,
    projectCard: projectCard
  };
})();
