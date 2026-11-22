/* Public version detail page for a published project release. */
(function () {
  'use strict';
  var api = window.NekoApi, ui = window.NekoUI;
  var mount = document.getElementById('version-content');
  if (!api || !ui || !mount) return;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }

  var params = new URLSearchParams(window.location.search || '');
  var slug = params.get('project') || '';
  var id = params.get('id') || '';
  mount.innerHTML = ui.loading();
  if (!slug || !id) {
    mount.innerHTML = ui.notFound('Version not found', 'No version specified.', 'projects.html', 'All Projects');
    return;
  }

  api.get('/api/projects/' + encodeURIComponent(slug) + '/versions/' + encodeURIComponent(id)).then(function (payload) {
    var v = payload.version;
    var fields = [
      ['Версия', v.version_number], ['Название', v.release_name], ['Платформа', v.platform],
      ['Дата релиза', v.release_date], ['Тип файла', v.file_type]
    ];
    document.title = (v.version_number || 'Version') + ' — NekoStudios';
    mount.innerHTML =
      '<section class="page-hero detail-hero"><div class="container">' +
        '<a class="detail-back" href="project.html?id=' + encodeURIComponent(slug) + '">← Проект</a>' +
        '<p class="eyebrow">Release</p>' +
        '<h1>' + esc(v.version_number || 'Version') + '</h1>' +
        (v.release_name ? '<p class="page-subtitle">' + esc(v.release_name) + '</p>' : '') +
      '</div></section>' +
      '<section class="section catalog"><div class="container">' +
        '<div class="detail-panel">' +
          '<h2>Информация</h2>' +
          fields.filter(function (f) { return f[1]; }).map(function (f) {
            return '<div class="settings-value"><strong>' + f[0] + ':</strong> ' + esc(f[1]) + '</div>';
          }).join('') +
          (v.release_notes ? '<h3>Release notes</h3><p>' + esc(v.release_notes) + '</p>' : '') +
          (v.file_url ? '<p><a class="btn btn--ghost" href="' + esc(v.file_url) + '">Файл релиза</a></p>' : '') +
        '</div>' +
      '</div></section>';
  }).catch(function () {
    mount.innerHTML = ui.notFound('Version not found', 'This version is not published.', 'projects.html', 'All Projects');
  });
})();
