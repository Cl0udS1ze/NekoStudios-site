/* Minimal public Neko ID profile. */
(function () {
  'use strict';
  var api = window.NekoApi, ui = window.NekoUI, i18n = window.NekoI18n;
  var mount = document.getElementById('user-profile');
  if (!api || !ui || !mount) return;
  var match = /[?&]uuid=([^&]+)/.exec(window.location.search || '');
  var uuid = match ? decodeURIComponent(match[1]) : '';

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }
  function t(k) { return i18n ? i18n.t(k) : k; }

  mount.innerHTML = ui.loading();
  if (!uuid) {
    mount.innerHTML = ui.notFound(t('profile_not_found'), t('profile_missing'), 'team.html', t('back_team'));
    return;
  }
  api.get('/api/users/' + encodeURIComponent(uuid)).then(function (payload) {
    var p = payload.profile || {};
    var registered = p.created_at
      ? (i18n ? i18n.formatDate(p.created_at) : p.created_at)
      : p.created_at;
    mount.innerHTML = '<div class="auth-card">' +
      '<div class="team-avatar">' + esc(String(p.display_name || p.username || '?').slice(0, 2).toUpperCase()) + '</div>' +
      '<h1>' + esc(p.display_name || p.username) + '</h1>' +
      '<p class="page-support">@' + esc(p.username) + '</p>' +
      (p.bio ? '<p data-no-i18n>' + esc(p.bio) + '</p>' : '') +
      '<div class="settings-value">' + esc(t('neko_id')) + ': ' + esc(p.uuid) + '</div>' +
      '<div class="settings-value">' + esc(t('registered')) + ': ' + esc(registered) + '</div>' +
      '<a class="btn btn--ghost auth-submit" href="team.html">' + esc(t('back_team')) + '</a>' +
      '</div>';
  }).catch(function () {
    mount.innerHTML = ui.notFound(t('profile_not_found'), t('profile_not_found_text'), 'team.html', t('back_team'));
  });
})();
