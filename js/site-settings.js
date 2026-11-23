/* Applies public site settings from the Worker/D1. Safe to load on every page. */
(function () {
  'use strict';
  var api = window.NekoApi;
  if (!api || !api.isConfigured()) return;
  api.get('/api/settings').then(function (payload) {
    var s = (payload && payload.settings) || {};
    if (s.site_theme) document.documentElement.setAttribute('data-theme', s.site_theme);
    if (s.site_name) document.title = document.title.replace('NekoStudios', s.site_name);
    Array.prototype.forEach.call(document.querySelectorAll('[data-setting-key]'), function (node) {
      var value = s[node.getAttribute('data-setting-key')];
      if (value) node.textContent = value;
    });
    // Language is a visitor choice: Russian by default, restored from
    // localStorage by i18n.js. The site setting must not override it.
  }).catch(function () {});
})();
