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

  function statusBadge(statusKey) {
    var data = window.NekoData;
    var meta = data && data.getStatusMeta
      ? data.getStatusMeta(statusKey)
      : { label: String(statusKey || ''), className: 'status--dev' };
    return '<span class="project-status ' + escapeHtml(meta.className) + '">' +
      escapeHtml(meta.label) + '</span>';
  }

  function projectCard(project) {
    var tags = (project.tags || []).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    var filters = (project.filters || []).join(' ');
    var searchText = [project.title, project.description, project.categoryLabel]
      .concat(project.categories || []).join(' ').toLowerCase();

    return '' +
      '<article class="project-card" data-project="' + escapeHtml(project.id) +
        '" data-filters="' + escapeHtml(filters) +
        '" data-search="' + escapeHtml(searchText) + '">' +
        '<a class="project-art art--' + escapeHtml(project.art || 'mine') +
          '" href="project.html?id=' + encodeURIComponent(project.id) +
          '" aria-label="View ' + escapeHtml(project.title) + '">' +
          statusBadge(project.status) +
        '</a>' +
        '<div class="project-body">' +
          '<span class="project-category">' + escapeHtml(project.categoryLabel || 'Project') + '</span>' +
          '<h3>' + escapeHtml(project.title) + '</h3>' +
          '<p>' + escapeHtml(project.description) + '</p>' +
          '<div class="project-tags">' + tags + '</div>' +
          '<a class="project-link" href="project.html?id=' + encodeURIComponent(project.id) +
            '">View Project <span aria-hidden="true">→</span></a>' +
        '</div>' +
      '</article>';
  }

  window.NekoComponents = {
    escapeHtml: escapeHtml,
    statusBadge: statusBadge,
    projectCard: projectCard
  };
})();
