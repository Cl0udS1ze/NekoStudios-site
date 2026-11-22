/* Shared article page: renders one publication by slug from the data layer. */
(function () {
  'use strict';

  var repo = window.NekoRepository;
  var ui = window.NekoUI;
  var views = window.NekoNewsComponents;
  var mount = document.getElementById('article-content');
  if (!repo || !views || !mount) return;

  var match = /[?&]slug=([^&]+)/.exec(window.location.search || '');
  var slug = match ? decodeURIComponent(match[1]) : '';

  function render(post) {
    var category = repo.categoryLabel(post.category);
    var date = post.date ? views.escapeHtml(post.date) : views.escapeHtml(post.dateLabel || 'Demo material');
    var badge = post.demo ? 'Draft · Demo material' : (post.status === 'published' ? 'Published' : 'Draft');
    var projectLink = post.projectId
      ? '<p>Related project: <a href="project.html?id=' + encodeURIComponent(post.projectId) +
        '">' + views.escapeHtml(post.projectId) + '</a></p>'
      : '<p>Этот пост не привязан к конкретному проекту.</p>';
    document.title = post.title + ' — NekoStudios';

    mount.innerHTML =
      '<section class="page-hero article-hero"><div class="container">' +
        '<a class="article-back" href="news.html">← News &amp; Devlog</a>' +
        '<p class="eyebrow">' + views.escapeHtml(category) + '</p>' +
        '<h1>' + views.escapeHtml(post.title) + '</h1>' +
        '<div class="article-meta">' +
          '<span class="news-date">' + date + '</span>' +
          '<span class="news-badge">' + views.escapeHtml(badge) + '</span>' +
        '</div>' +
        '<p class="page-subtitle">' + views.escapeHtml(post.excerpt) + '</p>' +
        '<div class="article-cover art--' + views.escapeHtml(post.cover || 'studio') + '"></div>' +
      '</div></section>' +
      '<section class="section catalog"><div class="container">' +
        '<div class="article-layout">' +
          '<article class="article-body" data-no-i18n>' + views.renderBody(post.body) + '</article>' +
          '<aside class="article-aside">' +
            '<h2>About this post</h2>' +
            '<p>Category: ' + views.escapeHtml(category) + '</p>' +
            '<p>Status: ' + views.escapeHtml(post.status) + (post.demo ? ' (demonstration draft)' : '') + '</p>' +
            projectLink +
            '<a class="btn btn--ghost" href="news.html">All publications</a>' +
          '</aside>' +
        '</div>' +
      '</div></section>';
  }

  mount.innerHTML = ui ? ui.loading() : '';
  repo.getPost(slug).then(function (post) {
    if (!post) {
      mount.innerHTML = ui
        ? ui.notFound('Публикация не найдена', 'Попробуйте вернуться к списку публикаций.', 'news.html', 'News & Devlog')
        : '';
      return;
    }
    render(post);
  }).catch(function (error) {
    if (window.console && console.error) console.error('[NekoStudios] Article load failed', error);
    mount.innerHTML = ui ? ui.error('The publication could not be loaded.') : '';
  });
})();
