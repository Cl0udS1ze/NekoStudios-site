/* Frontend auth state. Tokens stay in HttpOnly cookies — never in localStorage. */
(function () {
  'use strict';

  var api = window.NekoApi;
  var user = null;

  function call(name, options) {
    return api.request(api.endpoint(name), options || {});
  }

  function setUser(next) {
    user = next || null;
    renderSlots();
    return user;
  }

  function renderSlots() {
    var slots = document.querySelectorAll('[data-auth-slot]');
    Array.prototype.forEach.call(slots, function (slot) {
      if (!user) {
        slot.innerHTML = '<a href="login.html">Log in</a>';
        return;
      }
      slot.innerHTML = (user.role === 'admin'
          ? '<a class="auth-admin" href="admin.html">Панель управления</a>' : '') +
        '<a href="profile.html">' + String(user.username) + '</a>' +
        '<button type="button" class="auth-logout" data-auth-logout>Log out</button>';
    });
  }

  function logout() {
    return call('authLogout', { method: 'POST', credentials: true })
      .then(function () { setUser(null); })
      .catch(function () { setUser(null); });
  }

  function refresh() {
    if (!api || !api.isConfigured()) return Promise.resolve(null);
    return call('authMe', { credentials: true })
      .then(function (payload) { return setUser(payload && payload.user); })
      .catch(function () { return setUser(null); });
  }

  document.addEventListener('click', function (event) {
    if (event.target && event.target.closest && event.target.closest('[data-auth-logout]')) {
      event.preventDefault();
      logout();
    }
  });

  window.NekoAuth = {
    refresh: refresh,
    currentUser: function () { return user; },
    isAdmin: function () { return !!(user && user.is_admin); },
    register: function (values) {
      return call('authRegister', { method: 'POST', credentials: true, body: values })
        .then(function (payload) { return payload && payload.user; });
    },
    login: function (values) {
      return call('authLogin', { method: 'POST', credentials: true, body: values })
        .then(function (payload) { return setUser(payload && payload.user); });
    },
    logout: logout
  };

  refresh();
})();
