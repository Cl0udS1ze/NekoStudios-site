/* Small shared state panels: loading, error, empty, not found. */
(function () {
  'use strict';

  function escapeHtml(value) {
    var shared = window.NekoComponents && window.NekoComponents.escapeHtml;
    return shared ? shared(value) : String(value == null ? '' : value);
  }

  function t(key) { return window.NekoI18n ? window.NekoI18n.t(key) : key; }

  function panel(kind, title, text, action) {
    return '<div class="state-panel state-panel--' + kind + '">' +
      '<h3>' + escapeHtml(title) + '</h3>' +
      (text ? '<p>' + escapeHtml(text) + '</p>' : '') +
      (action || '') +
      '</div>';
  }

  window.NekoUI = {
    loading: function (text) {
      return panel('loading', t('loading'), text || t('loading_data'));
    },
    error: function (text) {
      var detail = text || t('error_text');
      if (window.console && console.error) console.error('[NekoStudios UI] ' + detail);
      return panel('error', t('error_title'), detail);
    },
    empty: function (title, text) {
      return panel('empty', title || t('not_found'), text || '');
    },
    notFound: function (title, text, href, label) {
      return panel('not-found', title || t('not_found'), text || '',
        href ? '<a class="btn btn--ghost" href="' + escapeHtml(href) + '">' +
          escapeHtml(label || t('back')) + '</a>' : '');
    }
  };
})();
