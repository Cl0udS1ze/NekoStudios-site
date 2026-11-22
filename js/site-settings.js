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
    var i18n = window.NekoI18n;
    var saved = null;
    try { saved = window.localStorage.getItem('neko_lang'); } catch (e) {}
    if (i18n && !saved && s.default_language) i18n.apply(s.default_language);
  }).catch(function () {});
})();
