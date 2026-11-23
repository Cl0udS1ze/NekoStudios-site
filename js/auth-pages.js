/* Wiring for register / login / profile pages. */
(function () {
  'use strict';

  var auth = window.NekoAuth;
  var api = window.NekoApi;
  var ui = window.NekoUI;
  var i18n = window.NekoI18n;
  var page = document.body && document.body.getAttribute('data-auth-page');
  if (!auth || !page) return;

  var profileUser = null;

  function t(key) { return i18n ? i18n.t(key) : key; }
  function errorBox() { return document.getElementById('auth-error'); }
  function button(id) { return document.getElementById(id); }
  function nextUrl() {
    var match = /[?&]next=([^&]+)/.exec(window.location.search || '');
    if (!match) return 'profile.html';
    try {
      var value = decodeURIComponent(match[1]);
      if (value.indexOf('/') === 0 && value.indexOf('//') !== 0) return value;
      if (value.indexOf('crazysurfer://auth') === 0) return value;
    } catch (e) {}
    return 'profile.html';
  }
  function finishAuth() {
    var next = nextUrl();
    if (next.indexOf('crazysurfer://') === 0 && api) {
      api.request('/api/auth/mobile-code', { method: 'POST', credentials: true })
        .then(function (j) {
          window.location.href = next + (next.indexOf('?') === -1 ? '?' : '&') +
            'code=' + encodeURIComponent(j.code || '');
        })
        .catch(function () { window.location.href = 'profile.html'; });
      return;
    }
    window.location.href = next;
  }

  function setLoading(id, loading, labelKey) {
    var b = button(id);
    if (!b) return;
    b.disabled = loading;
    b.textContent = loading ? t('wait') : t(labelKey);
  }

  function showError(message) {
    var box = errorBox();
    if (box) box.textContent = message || t('something_wrong');
  }

  if (page === 'register') {
    button('reg-submit').addEventListener('click', function () {
      showError('');
      setLoading('reg-submit', true, 'register_submit');
      var values = {
        username: document.getElementById('reg-username').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        password: document.getElementById('reg-password').value
      };
      auth.register(values)
        .then(function () { return auth.login({ username: values.username, password: values.password }); })
        .then(function () { finishAuth(); })
        .catch(function (e) { showError(e && e.message ? e.message : t('registration_failed')); })
        .then(function () { setLoading('reg-submit', false, 'register_submit'); });
    });
  }

  if (page === 'login') {
    button('login-submit').addEventListener('click', function () {
      showError('');
      setLoading('login-submit', true, 'login_submit');
      var values = {
        username: document.getElementById('login-identity').value.trim(),
        password: document.getElementById('login-password').value
      };
      auth.login(values)
        .then(function () { finishAuth(); })
        .catch(function (e) { showError(e && e.message ? e.message : t('login_failed')); })
        .then(function () { setLoading('login-submit', false, 'login_submit'); });
    });
  }

  if (page === 'profile') {
    var mount = document.getElementById('profile-content');
    if (mount) mount.innerHTML = ui ? ui.loading() : '';

    function renderProfile() {
      if (!mount) return;
      if (!profileUser) {
        mount.innerHTML = '<div class="auth-card"><h1>' + t('not_logged_in') + '</h1>' +
          '<p class="page-support">' + t('login_to_view') + '</p>' +
          '<a class="btn btn--primary auth-submit" href="login.html">' + t('login') + '</a></div>';
        return;
      }
      var user = profileUser;
      mount.innerHTML = '<div class="auth-card"><h1>' + String(user.username) + '</h1>' +
        '<p class="page-support">' + t('account_info') + '</p>' +
        '<div class="auth-meta">' +
          '<div><strong>' + t('email') + '</strong>' + String(user.email || '—') + '</div>' +
          '<div><strong>' + t('registered') + '</strong>' + String(user.created_at || '—') + '</div>' +
          '<div><strong>' + t('username') + '</strong>' + String(user.username) + '</div>' +
        '</div>' +
        (user.is_admin ? '<span class="auth-badge">' + t('administrator') + '</span>' : '') +
        '<a class="btn btn--primary auth-submit" href="settings.html">' + t('neko_id_settings') + '</a>' +
        '<button type="button" class="btn btn--ghost auth-submit" data-auth-logout>' + t('logout') + '</button>' +
        (user.role === 'admin'
          ? '<a class="btn btn--primary auth-submit" href="admin.html">' + t('admin_panel') + '</a>'
          : '') +
        '</div>';
    }

    auth.refresh().then(function (user) {
      profileUser = user || null;
      renderProfile();
    }).catch(function () {
      if (mount) mount.innerHTML = ui ? ui.error(t('profile_load_error')) : '';
    });

    if (i18n && i18n.onChange) i18n.onChange(renderProfile);
  }
})();
