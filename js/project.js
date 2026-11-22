/* Shared project detail template. One page for every project id. */
(function () {
  'use strict';

  var repo = window.NekoRepository;
  var ui = window.NekoUI;
  var components = window.NekoComponents;
  var mount = document.getElementById('detail-content');
  function tr(key) { return window.NekoI18n ? window.NekoI18n.t(key) : key; }
  if (!repo || !components || !mount) return;

  var match = /[?&]id=([^&]+)/.exec(window.location.search || '');
  var id = match ? decodeURIComponent(match[1]) : '';

  function showNotFound() {
    mount.innerHTML = ui
      ? ui.notFound('Project not found', 'This project is not in the catalog.', 'projects.html', 'Back to All Projects')
      : '<section class="page-hero"><div class="container"><h1>Project not found</h1></div></section>';
  }

  function versionMarkup(versions, slug) {
    if (!versions || !versions.length) {
      return '<div class="empty-state"><h3>No versions published yet.</h3>' +
        '<p>Versions for this project will appear here when available.</p></div>';
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
    var tags = (project.categories || []).concat(project.tags || []).map(function (tag) {
      return '<span>' + components.escapeHtml(tag) + '</span>';
    }).join('');
    document.title = project.title + ' — NekoStudios';
    var playButton = project.slug === 'deep-mine'
      ? '<a class="btn btn--primary" href="projects/deep-mine/">' + tr('play_browser') + '</a>'
      : '';

    var versions = meta.versions
      ? '<section class="versions-panel" aria-labelledby="versions-title">' +
          '<h2 id="versions-title">Versions</h2>' +
          '<div id="versions-content">' +
            (ui ? ui.loading('Loading versions…') : '') +
          '</div>' +
        '</section>'
      : '';

    mount.innerHTML =
      '<section class="page-hero detail-hero"><div class="container">' +
        '<a class="detail-back" href="projects.html">← All Projects</a>' +
        '<p class="eyebrow">' + components.escapeHtml(project.categoryLabel) + '</p>' +
        '<h1>' + components.escapeHtml(project.title) + '</h1>' +
        '<p class="page-subtitle">' + components.escapeHtml(project.description) + '</p>' +
        components.statusBadge(project.status) +
      '</div></section>' +
      '<section class="section catalog"><div class="container">' +
        '<div class="detail-layout">' +
          '<div class="detail-cover art--' + components.escapeHtml(project.art) + '">' +
            '<span class="project-status ' + components.escapeHtml(meta.className) + '">' +
              components.escapeHtml(meta.label) + '</span>' +
          '</div>' +
          '<div class="detail-panel">' +
            '<h2>Overview</h2>' +
            '<p>' + components.escapeHtml(project.description) + '</p>' +
            '<div class="detail-note">' + components.escapeHtml(project.note) + '</div>' +
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
        slot.innerHTML = ui ? ui.error('Versions could not be loaded.') : '';
      });
    }
  }

  mount.innerHTML = ui ? ui.loading() : '';
  repo.getProject(id).then(function (project) {
    if (!project) { showNotFound(); return; }
    render(project, repo.getStatusMeta(project.status));
  }).catch(function (error) {
    if (window.console && console.error) console.error('[NekoStudios] Project load failed', error);
    mount.innerHTML = ui ? ui.error('Project could not be loaded.') : '';
  });
})();
