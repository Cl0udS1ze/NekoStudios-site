/* Public version detail page for a published project release. */
(function () {
  'use strict';
  var api = window.NekoApi, ui = window.NekoUI, i18n = window.NekoI18n;
  var mount = document.getElementById('version-content');
  if (!api || !ui || !mount) return;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }
  function t(k) { return i18n ? i18n.t(k) : k; }

  var params = new URLSearchParams(window.location.search || '');
  var slug = params.get('project') || '';
  var id = params.get('id') || '';
  mount.innerHTML = ui.loading();
  if (!slug || !id) {
    mount.innerHTML = ui.notFound(t('version_not_found'), t('version_missing'), 'projects.html', t('back_all_projects'));
    return;
  }

  api.get('/api/projects/' + encodeURIComponent(slug) + '/versions/' + encodeURIComponent(id)).then(function (payload) {
    var v = payload.version || {};
    var releaseDate = v.release_date
      ? (i18n ? i18n.formatDate(v.release_date) : v.release_date)
      : v.release_date;
    var fields = [
      [t('version'), v.version_number], [t('title'), v.release_name], [t('platform'), v.platform],
      [t('release_date'), releaseDate], [t('file_type'), v.file_type]
    ];
    document.title = (v.version_number || t('version')) + ' — NekoStudios';
    mount.innerHTML =
      '<section class="page-hero detail-hero"><div class="container">' +
        '<a class="detail-back" href="project.html?id=' + encodeURIComponent(slug) + '">' +
          t('back_project') + '</a>' +
        '<p class="eyebrow">' + esc(t('release')) + '</p>' +
        '<h1>' + esc(v.version_number || t('version')) + '</h1>' +
        (v.release_name ? '<p class="page-subtitle">' + esc(v.release_name) + '</p>' : '') +
      '</div></section>' +
      '<section class="section catalog"><div class="container">' +
        '<div class="detail-panel">' +
          '<h2>' + esc(t('information')) + '</h2>' +
          fields.filter(function (f) { return f[1]; }).map(function (f) {
            return '<div class="settings-value"><strong>' + esc(f[0]) + ':</strong> ' + esc(f[1]) + '</div>';
          }).join('') +
          (v.release_notes ? '<h3>' + esc(t('release_notes')) + '</h3><p>' + esc(v.release_notes) + '</p>' : '') +
          (v.file_url ? '<p><a class="btn btn--ghost" href="' + esc(v.file_url) + '">' +
            esc(t('release_file')) + '</a></p>' : '') +
        '</div>' +
      '</div></section>';
  }).catch(function () {
    mount.innerHTML = ui.notFound(t('version_not_found'), t('version_not_found_text'), 'projects.html', t('back_all_projects'));
  });
})();
