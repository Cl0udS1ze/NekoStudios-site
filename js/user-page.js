/* Minimal public Neko ID profile. */
(function () {
  'use strict';
  var api = window.NekoApi, ui = window.NekoUI;
  var mount = document.getElementById('user-profile');
  if (!api || !ui || !mount) return;
  var match = /[?&]uuid=([^&]+)/.exec(window.location.search || '');
  var uuid = match ? decodeURIComponent(match[1]) : '';
  mount.innerHTML = ui.loading();
  if (!uuid) { mount.innerHTML = ui.notFound('Profile not found', 'No Neko ID specified.', 'team.html', 'Back to Team'); return; }
  api.get('/api/users/' + encodeURIComponent(uuid)).then(function (payload) {
    var p = payload.profile;
    mount.innerHTML = '<div class="auth-card">' +
      '<div class="team-avatar">' + String(p.display_name || p.username).slice(0, 2).toUpperCase() + '</div>' +
      '<h1>' + String(p.display_name || p.username) + '</h1>' +
      '<p class="page-support">@' + String(p.username) + '</p>' +
      (p.bio ? '<p data-no-i18n>' + String(p.bio) + '</p>' : '') +
      '<div class="settings-value">Neko ID: ' + String(p.uuid) + '</div>' +
      '<div class="settings-value">Registered: ' + String(p.created_at) + '</div>' +
      '<a class="btn btn--ghost auth-submit" href="team.html">← Team</a>' +
      '</div>';
  }).catch(function () {
    mount.innerHTML = ui.notFound('Profile not found', 'This profile is private or does not exist.', 'team.html', 'Back to Team');
  });
})();
