/* Neko ID client. Uses the central NekoApi module; no tokens in localStorage. */
(function () {
  'use strict';

  var api = window.NekoApi;
  if (!api) return;

  function request(path, options) {
    return api.request(path, Object.assign({ credentials: true }, options || {}));
  }

  window.NekoAccount = {
    getProfile: function () { return request('/api/account/profile'); },
    updateProfile: function (values) {
      return request('/api/account/profile', { method: 'PATCH', body: values });
    },
    changePassword: function (values) {
      return request('/api/account/password', { method: 'POST', body: values });
    },
    revokeOthers: function () {
      return request('/api/account/sessions/revoke-others', { method: 'POST' });
    },
    publicProfile: function (uuid) { return api.get('/api/users/' + encodeURIComponent(uuid)); },
    siteSettings: function () { return api.get('/api/settings'); }
  };
})();
