/* Public team roster. */
(function () {
  'use strict';
  var api = window.NekoApi, ui = window.NekoUI, i18n = window.NekoI18n;
  var grid = document.getElementById('team-grid');
  if (!api || !ui || !grid) return;

  var members = [];

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }
  function initials(name) { return String(name || '?').trim().slice(0, 2).toUpperCase(); }
  function t(k) { return i18n ? i18n.t(k) : k; }
  function roleLabel(value) { return i18n ? i18n.content(value) : value; }

  function render() {
    if (!members.length) {
      grid.className = '';
      grid.innerHTML = ui.empty(t('team_empty_title'), t('no_members'));
      return;
    }
    grid.className = 'team-grid';
    grid.innerHTML = members.map(function (m) {
      var name = m.display_name || m.username;
      return '<article class="team-card">' +
        '<div class="team-card-top">' +
          '<div class="team-avatar">' + esc(initials(name)) + '</div>' +
          '<span class="team-role">' + esc(roleLabel(m.team_role || '')) + '</span>' +
        '</div>' +
        '<h2 class="team-name">' + esc(name) + '</h2>' +
        '<div class="team-username">@' + esc(m.username) + '</div>' +
        (m.description ? '<p class="team-bio" data-no-i18n>' + esc(m.description) + '</p>' : '') +
        (m.uuid ? '<a class="team-link" href="user.html?uuid=' + encodeURIComponent(m.uuid) +
          '">' + esc(t('team_neko_id')) + '</a>' : '') +
        '</article>';
    }).join('');
  }

  grid.innerHTML = ui.loading();
  api.get('/api/team').then(function (payload) {
    members = payload.members || [];
    render();
  }).catch(function (error) {
    grid.innerHTML = ui.error(error && error.message ? error.message : t('team_load_error'));
  });

  if (i18n && i18n.onChange) {
    i18n.onChange(function () {
      if (members.length) render();
    });
  }
})();
