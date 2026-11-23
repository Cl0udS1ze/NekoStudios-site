/* Shared project detail template. One page for every project id. */
(function () {
  'use strict';

  var repo = window.NekoRepository;
  var ui = window.NekoUI;
  var components = window.NekoComponents;
  var i18n = window.NekoI18n;
  var mount = document.getElementById('detail-content');
  function t(key) { return i18n ? i18n.t(key) : key; }
  function content(value) { return i18n ? i18n.content(value) : value; }
  if (!repo || !components || !mount) return;

  var match = /[?&]id=([^&]+)/.exec(window.location.search || '');
  var id = match ? decodeURIComponent(match[1]) : '';
  var currentProject = null;
  var currentMeta = null;

  function showNotFound() {
    mount.innerHTML = ui
      ? ui.notFound(t('project_not_found'), t('project_not_found_text'), 'projects.html', t('back_all_projects'))
      : '<section class="page-hero"><div class="container"><h1>' +
        components.escapeHtml(t('project_not_found')) + '</h1></div></section>';
  }

  function versionMarkup(versions, slug) {
    if (!versions || !versions.length) {
      return '<div class="empty-state"><h3>' + components.escapeHtml(t('versions_empty_title')) + '</h3>' +
        '<p>' + components.escapeHtml(t('versions_empty_text')) + '</p></div>';
    }
    var items = versions.map(function (version) {
      var label = components.escapeHtml(version.label || version.version || 'Version');
      var inner = '<strong>' + label + '</strong>' +
        (version.date ? '<span>' + components.escapeHtml(version.date) + '</span>' : '');
      return '<li class="version-item">' +
        (version.id && slug
          ? '<a href="version.html?project=' + encodeURIComponent(slug) + '&id=' +
            encodeURIComponent(version.id) + '">' + inner + '</a>'
          : inner) +
        '</li>';
    }).join('');
    return '<ul class="version-list">' + items + '</ul>';
  }

  function render(project, meta) {
    currentProject = project;
    currentMeta = meta;
    var description = i18n
      ? i18n.projectText(project.id, 'description', project.description)
      : project.description;
    var note = i18n ? i18n.projectText(project.id, 'note', project.note) : project.note;
    var tags = (project.categories || []).concat(project.tags || []).map(function (tag) {
      return '<span>' + components.escapeHtml(content(tag)) + '</span>';
    }).join('');
    document.title = project.title + ' — NekoStudios';
    var playButton = project.slug === 'deep-mine'
      ? '<a class="btn btn--primary" href="projects/deep-mine/">' + components.escapeHtml(t('play_browser')) + '</a>'
      : '';

    var versions = meta.versions
      ? '<section class="versions-panel" aria-labelledby="versions-title">' +
          '<h2 id="versions-title">' + components.escapeHtml(t('versions')) + '</h2>' +
          '<div id="versions-content">' +
            (ui ? ui.loading() : '') +
          '</div>' +
        '</section>'
      : '';

    mount.innerHTML =
      '<section class="page-hero detail-hero"><div class="container">' +
        '<a class="detail-back" href="projects.html">' + components.escapeHtml(t('back_all_projects')) + '</a>' +
        '<p class="eyebrow">' + components.escapeHtml(content(project.categoryLabel)) + '</p>' +
        '<h1>' + components.escapeHtml(project.title) + '</h1>' +
        '<p class="page-subtitle">' + components.escapeHtml(description) + '</p>' +
        components.statusBadge(project.status) +
      '</div></section>' +
      '<section class="section catalog"><div class="container">' +
        '<div class="detail-layout">' +
          '<div class="detail-cover art--' + components.escapeHtml(project.art) + '">' +
            '<span class="project-status ' + components.escapeHtml(meta.className) + '">' +
              components.escapeHtml(t('status_' + project.status)) + '</span>' +
          '</div>' +
          '<div class="detail-panel">' +
            '<h2>' + components.escapeHtml(t('overview')) + '</h2>' +
            '<p>' + components.escapeHtml(description) + '</p>' +
            (note ? '<div class="detail-note">' + components.escapeHtml(note) + '</div>' : '') +
            playButton +
            '<div class="detail-tags">' + tags + '</div>' +
          '</div>' +
        '</div>' +
        versions +
        '<div id="reviews-root" data-slug="' + components.escapeHtml(project.slug || id) + '"></div>' +
      '</div></section>';

    var reviewsRoot = document.getElementById('reviews-root');
    if (reviewsRoot && window.NekoReviewsUI) {
      window.NekoReviewsUI.mount(reviewsRoot.getAttribute('data-slug'), reviewsRoot);
    }

    if (meta.versions) {
      var slot = document.getElementById('versions-content');
      if (!slot) return;
      repo.getPublishedVersions(project.id).then(function (list) {
        slot.innerHTML = versionMarkup(list, project.slug || id);
      }).catch(function (error) {
        if (window.console && console.error) console.error('[NekoStudios] Versions load failed', error);
        slot.innerHTML = ui ? ui.error(t('versions_load_error')) : '';
      });
    }
  }

  mount.innerHTML = ui ? ui.loading() : '';
  repo.getProject(id).then(function (project) {
    if (!project) { showNotFound(); return; }
    render(project, repo.getStatusMeta(project.status));
  }).catch(function (error) {
    if (window.console && console.error) console.error('[NekoStudios] Project load failed', error);
    mount.innerHTML = ui ? ui.error(t('project_load_error')) : '';
  });

  if (i18n && i18n.onChange) {
    i18n.onChange(function () {
      if (currentProject) render(currentProject, currentMeta);
    });
  }
})();
