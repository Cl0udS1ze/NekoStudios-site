/* Reusable News / Devlog markup. No external editor or rendering library. */
(function () {
  'use strict';

  var shared = window.NekoComponents;

  function escapeHtml(value) {
    return shared && shared.escapeHtml
      ? shared.escapeHtml(value)
      : String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
  }

  function t(key) { return window.NekoI18n ? window.NekoI18n.t(key) : key; }
  function content(value) { return window.NekoI18n ? window.NekoI18n.content(value) : value; }

  // Minimal inline formatting: **bold**, ==highlight==, [text](internal-url).
  // HTML is escaped first; only known internal link prefixes survive.
  function inline(text) {
    var safe = escapeHtml(text);
    safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (all, label, url) {
      if (/^(project\.html|projects\.html|news\.html|article\.html|#)/.test(url)) {
        return '<a href="' + url + '">' + label + '</a>';
      }
      return label;
    });
    safe = safe.replace(/==([^=]+)==/g, '<mark>$1</mark>');
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return safe;
  }

  function renderBody(blocks) {
    return (blocks || []).map(function (block) {
      if (block.type === 'h2' || block.type === 'h3') {
        return '<' + block.type + '>' + inline(block.text) + '</' + block.type + '>';
      }
      if (block.type === 'ul' || block.type === 'ol') {
        var items = (block.items || []).map(function (item) {
          return '<li>' + inline(item) + '</li>';
        }).join('');
        return '<' + block.type + '>' + items + '</' + block.type + '>';
      }
      if (block.type === 'figure') {
        return '<figure class="news-figure">' +
          '<div class="news-figure-art art--' + escapeHtml(block.art || 'studio') + '"></div>' +
          (block.caption ? '<figcaption>' + inline(block.caption) + '</figcaption>' : '') +
          '</figure>';
      }
      return '<p>' + inline(block.text || '') + '</p>';
    }).join('');
  }

  function postDate(post) {
    if (post.date) {
      return escapeHtml(window.NekoI18n ? window.NekoI18n.formatDate(post.date) : post.date);
    }
    return escapeHtml(post.dateLabel === 'Demo material' ? t('news_demo_material') : (post.dateLabel || t('news_demo_material')));
  }

  function badge(post) {
    var label = post.demo
      ? t('news_draft_demo')
      : (post.status === 'published' ? t('news_published') : t('news_draft'));
    return '<span class="news-badge">' + escapeHtml(label) + '</span>';
  }

  function newsCard(post, featured) {
    var href = 'article.html?slug=' + encodeURIComponent(post.slug);
    var repo = window.NekoRepository;
    var category = repo ? repo.categoryLabel(post.category) : 'News';
    var categoryLabel = content(category);
    var searchText = [post.title, post.excerpt, category, categoryLabel]
      .concat((post.body || []).map(function (b) {
        return (b.text || '') + ' ' + (b.items || []).join(' ') + ' ' + (b.caption || '');
      })).join(' ').toLowerCase();

    return '' +
      '<article class="news-card' + (featured ? ' news-card--featured' : '') +
        '" data-post="' + escapeHtml(post.id) + '" data-category="' + escapeHtml(post.category) +
        '" data-search="' + escapeHtml(searchText) + '">' +
        '<a class="news-card-cover art--' + escapeHtml(post.cover || 'studio') + '" href="' + href +
          '" aria-label="' + escapeHtml(t('news_read') + ': ' + post.title) + '">' + badge(post) + '</a>' +
        '<div class="news-card-body">' +
          '<div class="news-meta"><span class="news-category">' + escapeHtml(categoryLabel) + '</span>' +
            '<span class="news-date">' + postDate(post) + '</span></div>' +
          '<h3><a href="' + href + '">' + escapeHtml(post.title) + '</a></h3>' +
          '<p>' + escapeHtml(post.excerpt) + '</p>' +
          '<a class="news-read" href="' + href + '">' + escapeHtml(t('news_read')) +
            ' <span aria-hidden="true">→</span></a>' +
        '</div>' +
      '</article>';
  }

  window.NekoNewsComponents = {
    escapeHtml: escapeHtml,
    inline: inline,
    renderBody: renderBody,
    newsCard: newsCard
  };
})();
