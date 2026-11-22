/* Public team roster. */
(function () {
  'use strict';
  var api = window.NekoApi, ui = window.NekoUI, i18n = window.NekoI18n;
  var grid = document.getElementById('team-grid');
  if (!api || !ui || !grid) return;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }
  function initials(name) { return String(name || '?').trim().slice(0, 2).toUpperCase(); }
  function tr(k) { return i18n ? i18n.t(k) : k; }

  grid.innerHTML = ui.loading();
  api.get('/api/team').then(function (payload) {
    var members = payload.members || [];
    if (!members.length) {
      grid.innerHTML = ui.empty(tr('team_title'), tr('no_members'));
      return;
    }
    grid.className = 'team-grid';
    grid.innerHTML = members.map(function (m) {
      var name = m.display_name || m.username;
      return '<article class="team-card">' +
        '<div class="team-avatar">' + esc(initials(name)) + '</div>' +
        '<h2 class="team-name">' + esc(name) + '</h2>' +
        '<div class="team-username">@' + esc(m.username) + '</div>' +
        '<span class="team-role">' + esc(m.team_role) + '</span>' +
        (m.description ? '<p class="team-bio" data-no-i18n>' + esc(m.description) + '</p>' : '') +
        (m.uuid ? '<a class="team-link" href="user.html?uuid=' + encodeURIComponent(m.uuid) +
          '">Neko ID →</a>' : '') +
        '</article>';
    }).join('');
  }).catch(function (error) {
    grid.innerHTML = ui.error(error && error.message ? error.message : 'Team could not be loaded.');
  });
})();
