/* News list: category filters + search over the central publication data. */
(function () {
  'use strict';

  var repo = window.NekoRepository;
  var ui = window.NekoUI;
  var views = window.NekoNewsComponents;
  var i18n = window.NekoI18n;
  var filterBar = document.getElementById('news-filters');
  var search = document.getElementById('news-search');
  var featured = document.getElementById('news-featured');
  var grid = document.getElementById('news-grid');
  var empty = document.getElementById('news-empty');
  if (!repo || !views || !filterBar || !search || !featured || !grid || !empty) return;

  var posts = [];
  var state = { category: 'all', query: '' };

  function t(key) { return i18n ? i18n.t(key) : key; }
  function esc(value) { return views.escapeHtml(value); }

  function searchText(post) {
    var category = repo.categoryLabel(post.category);
    return [post.title, post.excerpt, category, i18n ? i18n.content(category) : category]
      .concat((post.body || []).map(function (block) {
        return (block.text || '') + ' ' + (block.items || []).join(' ') + ' ' + (block.caption || '');
      })).join(' ').toLowerCase();
  }

  function visiblePosts() {
    var query = state.query.trim().toLowerCase();
    return posts.filter(function (post) {
      var categoryOk = state.category === 'all' || post.category === state.category;
      return categoryOk && (!query || searchText(post).indexOf(query) !== -1);
    });
  }

  function markButtons() {
    var buttons = filterBar.querySelectorAll('[data-category]');
    Array.prototype.forEach.call(buttons, function (button) {
      var active = button.getAttribute('data-category') === state.category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function render() {
    var list = visiblePosts();
    var plainListing = state.category !== 'all' || !!state.query.trim();
    var lead = !plainListing ? list.filter(function (p) { return p.featured; })[0] : null;
    var rest = lead ? list.filter(function (p) { return p.id !== lead.id; }) : list;

    featured.innerHTML = lead ? views.newsCard(lead, true) : '';
    grid.innerHTML = rest.map(function (post) { return views.newsCard(post, false); }).join('');

    grid.classList.add('is-filtering');
    window.setTimeout(function () { grid.classList.remove('is-filtering'); }, 300);

    if (list.length) {
      empty.hidden = true;
      empty.innerHTML = '';
    } else {
      empty.hidden = false;
      empty.innerHTML = '<h3>' + esc(t('news_empty_title')) + '</h3>' +
        '<p>' + esc(t('news_empty_text')) + '</p>' +
        '<button type="button" class="btn btn--ghost" data-reset>' + esc(t('news_reset')) + '</button>';
    }
    markButtons();
  }

  filterBar.addEventListener('click', function (event) {
    var button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.getAttribute('data-category');
    render();
  });

  search.addEventListener('input', function () {
    state.query = search.value || '';
    render();
  });

  empty.addEventListener('click', function (event) {
    if (!event.target.closest('[data-reset]')) return;
    state.category = 'all';
    state.query = '';
    search.value = '';
    render();
  });

  grid.innerHTML = ui ? ui.loading() : '';
  repo.getPosts().then(function (list) {
    posts = list;
    render();
  }).catch(function (error) {
    if (window.console && console.error) console.error('[NekoStudios] News load failed', error);
    featured.innerHTML = '';
    grid.innerHTML = '';
    empty.hidden = false;
    empty.innerHTML = ui ? ui.error(t('news_load_error')) : '';
  });

  if (i18n && i18n.onChange) {
    i18n.onChange(function () {
      if (posts.length) render();
    });
  }
})();
