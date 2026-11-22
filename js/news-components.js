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
    return post.date ? escapeHtml(post.date) : escapeHtml(post.dateLabel || 'Demo material');
  }

  function badge(post) {
    var label = post.demo ? 'Draft · Demo material' : (post.status === 'published' ? 'Published' : 'Draft');
    return '<span class="news-badge">' + escapeHtml(label) + '</span>';
  }

  function newsCard(post, featured) {
    var href = 'article.html?slug=' + encodeURIComponent(post.slug);
    var repo = window.NekoRepository;
    var category = repo ? repo.categoryLabel(post.category) : 'News';
    var searchText = [post.title, post.excerpt, category]
      .concat((post.body || []).map(function (b) {
        return (b.text || '') + ' ' + (b.items || []).join(' ') + ' ' + (b.caption || '');
      })).join(' ').toLowerCase();

    return '' +
      '<article class="news-card' + (featured ? ' news-card--featured' : '') +
        '" data-post="' + escapeHtml(post.id) + '" data-category="' + escapeHtml(post.category) +
        '" data-search="' + escapeHtml(searchText) + '">' +
        '<a class="news-card-cover art--' + escapeHtml(post.cover || 'studio') + '" href="' + href +
          '" aria-label="Read ' + escapeHtml(post.title) + '">' + badge(post) + '</a>' +
        '<div class="news-card-body">' +
          '<div class="news-meta"><span class="news-category">' + escapeHtml(category) + '</span>' +
            '<span class="news-date">' + postDate(post) + '</span></div>' +
          '<h3><a href="' + href + '">' + escapeHtml(post.title) + '</a></h3>' +
          '<p>' + escapeHtml(post.excerpt) + '</p>' +
          '<a class="news-read" href="' + href + '">Read article <span aria-hidden="true">→</span></a>' +
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
