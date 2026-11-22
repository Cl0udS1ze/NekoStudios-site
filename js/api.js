/*
 * Single place for network access. Every section uses this module through
 * the repository; no page calls fetch directly.
 */
(function () {
  'use strict';

  var config = window.NekoConfig || {};

  function isConfigured() {
    return !!(config.API_BASE_URL && typeof config.API_BASE_URL === 'string');
  }

  function url(path) {
    return String(config.API_BASE_URL).replace(/\/+$/, '') + '/' + String(path || '').replace(/^\/+/, '');
  }

  function endpoint(name, values) {
    var template = (config.endpoints || {})[name];
    if (!template) throw new Error('API endpoint is not configured: ' + name);
    return template.replace(/\{(\w+)\}/g, function (all, key) {
      return encodeURIComponent(values && values[key] != null ? values[key] : '');
    });
  }

  function request(path, options) {
    options = options || {};
    if (!isConfigured()) {
      return Promise.reject(new Error('API base URL is not configured'));
    }
    if (typeof window.fetch !== 'function') {
      return Promise.reject(new Error('fetch is not available in this browser'));
    }

    var controller = typeof window.AbortController === 'function' ? new window.AbortController() : null;
    var timer = null;
    var init = {
      method: options.method || 'GET',
      headers: Object.assign({ 'Accept': 'application/json' }, options.headers || {}),
      signal: controller ? controller.signal : undefined
    };
    if (options.credentials) init.credentials = 'include';
    if (options.body !== undefined) {
      init.headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(options.body);
    }
    if (controller) {
      timer = window.setTimeout(function () { controller.abort(); }, config.requestTimeoutMs || 10000);
    }

    var target = url(path);
    return window.fetch(target, init).then(function (response) {
      if (timer) window.clearTimeout(timer);
      if (!response.ok) {
        var httpError = new Error('HTTP ' + response.status + ' ' + (response.statusText || '') + ' for ' + path);
        httpError.status = response.status;
        return response.text().then(function (text) {
          var payload = null;
          try { payload = JSON.parse(text); } catch (parseError) {}
          if (payload && payload.error) {
            var friendly = new Error(String(payload.error));
            friendly.status = response.status;
            throw friendly;
          }
          throw httpError;
        });
      }
      return response.json().catch(function () {
        throw new Error('Invalid JSON response from ' + path);
      });
    }).catch(function (error) {
      if (timer) window.clearTimeout(timer);
      var message = error && error.name === 'AbortError'
        ? 'Request timed out: ' + path
        : (error && error.message ? error.message : 'Network error for ' + path);
      var wrapped = new Error(message);
      wrapped.status = error && error.status;
      // Log only the path and message — never tokens or response bodies.
      if (window.console && console.error && wrapped.status !== 401) console.error('[NekoStudios API]', message);
      throw wrapped;
    });
  }

  function get(path) { return request(path); }

  window.NekoApi = {
    isConfigured: isConfigured,
    endpoint: endpoint,
    request: request,
    get: get
  };
})();
