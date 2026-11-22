/* Wiring for register / login / profile pages. */
(function () {
  'use strict';

  var auth = window.NekoAuth;
  var ui = window.NekoUI;
  var page = document.body && document.body.getAttribute('data-auth-page');
  if (!auth || !page) return;

  function errorBox() { return document.getElementById('auth-error'); }
  function button(id) { return document.getElementById(id); }

  function setLoading(id, loading, label) {
    var b = button(id);
    if (!b) return;
    b.disabled = loading;
    b.textContent = loading ? 'Please wait…' : label;
  }

  function showError(message) {
    var box = errorBox();
    if (box) box.textContent = message || 'Something went wrong.';
  }

  if (page === 'register') {
    button('reg-submit').addEventListener('click', function () {
      showError('');
      setLoading('reg-submit', true, 'Create account');
      var values = {
        username: document.getElementById('reg-username').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        password: document.getElementById('reg-password').value
      };
      auth.register(values)
        .then(function () { return auth.login({ username: values.username, password: values.password }); })
        .then(function () { window.location.href = 'profile.html'; })
        .catch(function (e) { showError(e && e.message ? e.message : 'Registration failed.'); })
        .then(function () { setLoading('reg-submit', false, 'Create account'); });
    });
  }

  if (page === 'login') {
    button('login-submit').addEventListener('click', function () {
      showError('');
      setLoading('login-submit', true, 'Log in');
      var values = {
        username: document.getElementById('login-identity').value.trim(),
        password: document.getElementById('login-password').value
      };
      auth.login(values)
        .then(function () { window.location.href = 'profile.html'; })
        .catch(function (e) { showError(e && e.message ? e.message : 'Login failed.'); })
        .then(function () { setLoading('login-submit', false, 'Log in'); });
    });
  }

  if (page === 'profile') {
    var mount = document.getElementById('profile-content');
    if (mount) mount.innerHTML = ui ? ui.loading() : '';
    auth.refresh().then(function (user) {
      if (!user) {
        mount.innerHTML = '<div class="auth-card"><h1>Not logged in</h1>' +
          '<p class="page-support">Log in to view your profile.</p>' +
          '<a class="btn btn--primary auth-submit" href="login.html">Log in</a></div>';
        return;
      }
      mount.innerHTML = '<div class="auth-card"><h1>' + String(user.username) + '</h1>' +
        '<p class="page-support">Account information</p>' +
        '<div class="auth-meta">' +
          '<div><strong>Email</strong>' + String(user.email || '—') + '</div>' +
          '<div><strong>Registered</strong>' + String(user.created_at || '—') + '</div>' +
          '<div><strong>Username</strong>' + String(user.username) + '</div>' +
        '</div>' +
        (user.is_admin ? '<span class="auth-badge">Administrator</span>' : '') +
        '<a class="btn btn--primary auth-submit" href="settings.html">Neko ID settings</a>' +
        '<button type="button" class="btn btn--ghost auth-submit" data-auth-logout>Выйти из аккаунта</button>' +
        (user.role === 'admin'
          ? '<a class="btn btn--primary auth-submit" href="admin.html">Панель управления</a>'
          : '') +
        '</div>';
    });
  }
})();
