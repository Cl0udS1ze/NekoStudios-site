/* Small shared state panels: loading, error, empty, not found. */
(function () {
  'use strict';

  function escapeHtml(value) {
    var shared = window.NekoComponents && window.NekoComponents.escapeHtml;
    return shared ? shared(value) : String(value == null ? '' : value);
  }

  function panel(kind, title, text, action) {
    return '<div class="state-panel state-panel--' + kind + '">' +
      '<h3>' + escapeHtml(title) + '</h3>' +
      (text ? '<p>' + escapeHtml(text) + '</p>' : '') +
      (action || '') +
      '</div>';
  }

  window.NekoUI = {
    loading: function (text) {
      return panel('loading', 'Loading…', text || 'Reading the latest data.');
    },
    error: function (text) {
      var detail = text || 'Data could not be loaded. Please try again.';
      if (window.console && console.error) console.error('[NekoStudios UI] ' + detail);
      return panel('error', 'Something went wrong', detail);
    },
    empty: function (title, text) {
      return panel('empty', title || 'Nothing here yet', text || '');
    },
    notFound: function (title, text, href, label) {
      return panel('not-found', title || 'Not found', text || '',
        href ? '<a class="btn btn--ghost" href="' + escapeHtml(href) + '">' +
          escapeHtml(label || 'Back') + '</a>' : '');
    }
  };
})();
