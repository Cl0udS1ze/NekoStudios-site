/* Shared article page: renders one publication by slug from the data layer. */
(function () {
  'use strict';

  var repo = window.NekoRepository;
  var ui = window.NekoUI;
  var views = window.NekoNewsComponents;
  var i18n = window.NekoI18n;
  var mount = document.getElementById('article-content');
  var currentPost = null;
  if (!repo || !views || !mount) return;

  function t(key) { return i18n ? i18n.t(key) : key; }
  function content(value) { return i18n ? i18n.content(value) : value; }

  var match = /[?&]slug=([^&]+)/.exec(window.location.search || '');
  var slug = match ? decodeURIComponent(match[1]) : '';

  function render(post) {
    currentPost = post;
    var category = content(repo.categoryLabel(post.category));
    var date = post.date
      ? (i18n ? i18n.formatDate(post.date) : post.date)
      : t('news_demo_material');
    var badge = post.demo
      ? t('news_draft_demo')
      : (post.status === 'published' ? t('news_published') : t('news_draft'));
    var projectLink = post.projectId
      ? '<p>' + views.escapeHtml(t('article_related')) + ' <a href="project.html?id=' +
        encodeURIComponent(post.projectId) + '">' + views.escapeHtml(post.projectId) + '</a></p>'
      : '<p>' + views.escapeHtml(t('article_not_linked')) + '</p>';
    document.title = post.title + ' — NekoStudios';

    mount.innerHTML =
      '<section class="page-hero article-hero"><div class="container">' +
        '<a class="article-back" href="news.html">' + views.escapeHtml(t('article_back')) + '</a>' +
        '<p class="eyebrow">' + views.escapeHtml(category) + '</p>' +
        '<h1>' + views.escapeHtml(post.title) + '</h1>' +
        '<div class="article-meta">' +
          '<span class="news-date">' + views.escapeHtml(date) + '</span>' +
          '<span class="news-badge news-badge--inline">' + views.escapeHtml(badge) + '</span>' +
        '</div>' +
        '<p class="page-subtitle">' + views.escapeHtml(post.excerpt) + '</p>' +
        '<div class="article-cover art--' + views.escapeHtml(post.cover || 'studio') + '"></div>' +
      '</div></section>' +
      '<section class="section catalog"><div class="container">' +
        '<div class="article-layout">' +
          '<article class="article-body" data-no-i18n>' + views.renderBody(post.body) + '</article>' +
          '<aside class="article-aside">' +
            '<h2>' + views.escapeHtml(t('article_about')) + '</h2>' +
            '<p>' + views.escapeHtml(t('article_category')) + ': ' + views.escapeHtml(category) + '</p>' +
            '<p>' + views.escapeHtml(t('article_status')) + ': ' +
              views.escapeHtml(post.status === 'published' ? t('news_published') : t('news_draft')) +
              (post.demo ? views.escapeHtml(t('article_demo_suffix')) : '') + '</p>' +
            projectLink +
            '<a class="btn btn--ghost" href="news.html">' +
              views.escapeHtml(t('article_all')) + '</a>' +
          '</aside>' +
        '</div>' +
      '</div></section>';
  }

  mount.innerHTML = ui ? ui.loading() : '';
  repo.getPost(slug).then(function (post) {
    if (!post) {
      mount.innerHTML = ui
        ? ui.notFound(t('article_not_found'), t('article_not_found_text'), 'news.html', t('footer_news'))
        : '';
      return;
    }
    render(post);
  }).catch(function (error) {
    if (window.console && console.error) console.error('[NekoStudios] Article load failed', error);
    mount.innerHTML = ui ? ui.error(t('article_load_error')) : '';
  });

  if (i18n && i18n.onChange) {
    i18n.onChange(function () {
      if (currentPost) render(currentPost);
    });
  }
})();
