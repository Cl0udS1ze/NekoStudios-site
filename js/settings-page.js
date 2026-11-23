/* Neko ID settings page wiring. */
(function () {
  'use strict';
  var account = window.NekoAccount, auth = window.NekoAuth, ui = window.NekoUI, i18n = window.NekoI18n;
  var mount = document.getElementById('settings-content');
  if (!account || !auth || !ui || !mount) return;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }
  function msg(text, error) { var m = document.getElementById('settings-msg');
    if (m) { m.textContent = text || ''; m.className = 'settings-msg' + (error ? ' error' : ''); } }
  function btn(id, text, busy) { var b = document.getElementById(id); if (b) { b.disabled = !!busy; b.textContent = busy ? '…' : text; } }
  function tr(k) { return i18n ? i18n.t(k) : k; }

  auth.refresh().then(function (user) {
    if (!user) { mount.innerHTML = ui.notFound(tr('not_logged_in'), tr('login_to_view'), 'login.html', tr('login')); return; }
    mount.innerHTML = ui.loading();
    account.getProfile().then(function (payload) {
      var p = payload.profile;
      mount.innerHTML =
        '<div id="settings-msg" class="settings-msg"></div><div class="settings-grid">' +
        '<div class="settings-card"><h2>' + tr('profile') + '</h2>' +
          '<form id="profile-form" class="auth-form">' +
            '<label class="settings-label">' + tr('username') + '<input id="s-username" value="' + esc(p.username) + '"></label>' +
            '<label class="settings-label">' + tr('display_name') + '<input id="s-display" value="' + esc(p.display_name || '') + '"></label>' +
            '<label class="settings-label">' + tr('bio') + '<textarea id="s-bio">' + esc(p.bio || '') + '</textarea></label>' +
            '<div class="settings-value">' + tr('neko_id') + ': ' + esc(p.uuid) + '</div>' +
            '<div class="settings-value">' + tr('registered') + ': ' + esc(p.created_at) + '</div>' +
            '<div class="settings-value">' + tr('role') + ': ' + esc(p.role) + '</div>' +
            '<button class="btn btn--primary" id="profile-save" type="submit">' + tr('save') + '</button>' +
          '</form></div>' +
        '<div class="settings-card"><h2>' + tr('interface') + '</h2>' +
          '<form id="ui-form" class="auth-form">' +
            '<label class="settings-label">' + tr('language') + '<select id="s-language">' +
              '<option value="en"' + (p.language === 'en' ? ' selected' : '') + '>EN</option>' +
              '<option value="ru"' + (p.language === 'ru' ? ' selected' : '') + '>RU</option></select></label>' +
            '<label class="settings-label">' + tr('theme') + '<select id="s-theme">' +
              '<option value="dark-purple">dark-purple</option></select></label>' +
            '<button class="btn btn--primary" type="submit">' + tr('save') + '</button>' +
          '</form></div>' +
        '<div class="settings-card"><h2>' + tr('privacy') + '</h2>' +
          '<form id="privacy-form" class="auth-form">' +
            '<label class="settings-check"><input type="checkbox" id="s-public"' + (p.profile_public ? ' checked' : '') + '> ' + tr('public_profile') + '</label>' +
            '<label class="settings-check"><input type="checkbox" id="s-activity"' + (p.show_activity ? ' checked' : '') + '> ' + tr('show_activity') + '</label>' +
            '<button class="btn btn--primary" type="submit">' + tr('save') + '</button>' +
          '</form></div>' +
        '<div class="settings-card"><h2>' + tr('security') + '</h2>' +
          '<form id="pass-form" class="auth-form">' +
            '<label class="settings-label">' + tr('current_password') + '<input id="s-current" type="password"></label>' +
            '<label class="settings-label">' + tr('new_password') + '<input id="s-new" type="password"></label>' +
            '<label class="settings-label">' + tr('confirm_password') + '<input id="s-confirm" type="password"></label>' +
            '<button class="btn btn--primary" id="pass-submit" type="submit">' + tr('change_password') + '</button>' +
          '</form>' +
          '<div class="admin-actions"><button class="btn btn--ghost" id="revoke-others" type="button">' + tr('revoke_others') + '</button>' +
          '<button class="btn btn--ghost" type="button" data-auth-logout>' + tr('logout') + '</button>' +
          (p.role === 'admin' ? '<a class="btn btn--primary" href="admin.html">' + tr('admin_panel') + '</a>' : '') + '</div>' +
        '</div></div>';

      document.getElementById('profile-form').addEventListener('submit', function (e) {
        e.preventDefault(); btn('profile-save', tr('save'), true); msg('');
        account.updateProfile({ username: document.getElementById('s-username').value.trim(),
          display_name: document.getElementById('s-display').value.trim(),
          bio: document.getElementById('s-bio').value })
          .then(function () { msg(tr('saved')); })
          .catch(function (err) { msg(err && err.message ? err.message : 'Error', true); })
          .then(function () { btn('profile-save', tr('save'), false); });
      });
      document.getElementById('ui-form').addEventListener('submit', function (e) {
        e.preventDefault(); msg('');
        account.updateProfile({ language: document.getElementById('s-language').value,
          theme: document.getElementById('s-theme').value })
          .then(function () { if (i18n) i18n.apply(document.getElementById('s-language').value); msg(tr('saved')); })
          .catch(function (err) { msg(err && err.message ? err.message : 'Error', true); });
      });
      document.getElementById('privacy-form').addEventListener('submit', function (e) {
        e.preventDefault(); msg('');
        account.updateProfile({ profile_public: document.getElementById('s-public').checked,
          show_activity: document.getElementById('s-activity').checked })
          .then(function () { msg(tr('saved')); })
          .catch(function (err) { msg(err && err.message ? err.message : 'Error', true); });
      });
      document.getElementById('pass-form').addEventListener('submit', function (e) {
        e.preventDefault(); btn('pass-submit', tr('change_password'), true); msg('');
        account.changePassword({ current_password: document.getElementById('s-current').value,
          new_password: document.getElementById('s-new').value,
          confirm_password: document.getElementById('s-confirm').value })
          .then(function () { msg(tr('saved')); document.getElementById('pass-form').reset(); })
          .catch(function (err) { msg(err && err.message ? err.message : 'Error', true); })
          .then(function () { btn('pass-submit', tr('change_password'), false); });
      });
      document.getElementById('revoke-others').addEventListener('click', function () {
        msg(''); account.revokeOthers().then(function () { msg(tr('saved')); })
          .catch(function (err) { msg(err && err.message ? err.message : 'Error', true); });
      });
    }).catch(function (err) {
      mount.innerHTML = ui.error(err && err.message ? err.message : 'Profile could not be loaded.');
    });
  });
})();
