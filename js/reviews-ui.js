/* Reviews UI for a project page. Uses NekoApi + NekoAuth only. */
(function () {
  'use strict';
  var api = window.NekoApi, auth = window.NekoAuth, ui = window.NekoUI, i18n = window.NekoI18n;
  if (!api || !ui) return;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }
  function tr(key) { return i18n ? i18n.t(key) : key; }
  function stars(n) { var value = Number(n) || 0;
    return '★★★★★'.slice(0, value) + '☆☆☆☆☆'.slice(0, 5 - value); }
  function date(value) { return value ? String(value).slice(0, 10) : ''; }

  window.NekoReviewsUI = {
    mount: function (slug, root) {
      if (!slug || !root) return;
      var state = { sort: 'new', offset: 0, mine: null, user: null };
      root.innerHTML = '<section class="reviews-panel" aria-labelledby="reviews-title">' +
        '<h2 id="reviews-title">' + tr('reviews') + '</h2>' +
        '<div id="reviews-summary">' + ui.loading() + '</div>' +
        '<div id="reviews-form-root"></div>' +
        '<div class="reviews-toolbar"><select id="reviews-sort">' +
          '<option value="new">' + tr('reviews_new') + '</option>' +
          '<option value="high">★ ↓</option><option value="low">★ ↑</option>' +
        '</select></div>' +
        '<div id="reviews-list">' + ui.loading() + '</div>' +
        '<div id="reviews-more-slot"></div>' +
        '</section>';

      function summary(data) {
        var average = data.average ? Number(data.average).toFixed(1) : '—';
        document.getElementById('reviews-summary').innerHTML =
          '<div class="reviews-summary"><div class="reviews-score">' + average + ' / 5</div>' +
          '<div class="reviews-stars">' + stars(Math.round(Number(data.average) || 0)) + '</div>' +
          '<div class="reviews-count">' + tr('based_on') + ' ' + data.count + ' ' + tr('ratings') + '</div></div>';
        state.mine = data.my_review || null;
        renderForm();
      }

      function renderForm() {
        var host = document.getElementById('reviews-form-root');
        if (!state.user) { host.innerHTML = ''; return; }
        var review = state.mine;
        var selected = review ? Number(review.rating) : 0;
        host.innerHTML = '<form class="reviews-form" id="review-form">' +
          '<h3>' + tr(review ? 'edit_review' : 'write_review') + '</h3>' +
          '<div class="stars-input">' + [1, 2, 3, 4, 5].map(function (n) {
            return '<button type="button" class="star-btn' + (n <= selected ? ' is-active' : '') +
              '" data-star="' + n + '">★</button>';
          }).join('') + '</div>' +
          '<input type="hidden" id="review-rating" value="' + (selected || '') + '">' +
          '<textarea id="review-text" maxlength="2000" placeholder="' + tr('description') + '">' +
            esc(review ? (review.content || '') : '') + '</textarea>' +
          '<div class="reviews-hint">0 / 2000</div>' +
          '<div class="reviews-msg" id="review-msg"></div>' +
          '<div class="admin-actions"><button class="btn btn--primary" type="submit">' + tr('submit') + '</button>' +
          (review ? '<button class="btn btn--ghost" id="review-cancel" type="button">' + tr('cancel') + '</button>' : '') +
          (review ? '<button class="btn btn--ghost" id="review-delete" type="button">' + tr('delete_review') + '</button>' : '') +
          '</div></form>';
        var form = document.getElementById('review-form');
        var ratingInput = document.getElementById('review-rating');
        Array.prototype.forEach.call(form.querySelectorAll('[data-star]'), function (button) {
          button.addEventListener('click', function () {
            var value = Number(button.getAttribute('data-star'));
            ratingInput.value = value;
            Array.prototype.forEach.call(form.querySelectorAll('[data-star]'), function (b) {
              b.classList.toggle('is-active', Number(b.getAttribute('data-star')) <= value);
            });
          });
        });
        var text = document.getElementById('review-text');
        text.addEventListener('input', function () {
          text.nextElementSibling.textContent = text.value.length + ' / 2000';
        });
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          var msg = document.getElementById('review-msg');
          msg.textContent = ''; msg.className = 'reviews-msg';
          var value = Number(ratingInput.value);
          if (value < 1 || value > 5) { msg.textContent = tr('rating'); msg.classList.add('error'); return; }
          var button = form.querySelector('[type="submit"]');
          button.disabled = true; button.textContent = '…';
          var body = { rating: value, content: text.value.trim() };
          var request = review
            ? api.request('/api/reviews/' + review.id, { method: 'PATCH', credentials: true, body: body })
            : api.request('/api/projects/' + encodeURIComponent(slug) + '/reviews', { method: 'POST', credentials: true, body: body });
          request.then(function () {
            return api.get('/api/projects/' + encodeURIComponent(slug) + '/rating');
          }).then(function (data) {
            summary(data); loadList(true);
          }).catch(function (error) {
            msg.textContent = error && error.message ? error.message : 'Error';
            msg.classList.add('error');
          }).then(function () { button.disabled = false; button.textContent = tr('submit'); });
        });
        var cancel = document.getElementById('review-cancel');
        if (cancel) cancel.addEventListener('click', function () {
          state.mine = null; renderForm();
        });
        var remove = document.getElementById('review-delete');
        if (remove) remove.addEventListener('click', function () {
          if (!window.confirm(tr('delete_review') + '?')) return;
          api.request('/api/reviews/' + review.id, { method: 'DELETE', credentials: true })
            .then(function () { state.mine = null; renderForm(); return api.get('/api/projects/' + encodeURIComponent(slug) + '/rating'); })
            .then(function (data) { summary(data); loadList(true); })
            .catch(function () {});
        });
      }

      function reviewMarkup(item) {
        var edited = item.updated_at && item.created_at && item.updated_at.slice(0, 10) !== item.created_at.slice(0, 10);
        return '<article class="review-item">' +
          '<div class="review-head">' +
            (item.user_uuid ? '<a class="review-author" href="user.html?uuid=' + encodeURIComponent(item.user_uuid) + '">' +
              esc(item.author || item.username) + '</a>' : '<span class="review-author">' + esc(item.author || item.username) + '</span>') +
            '<span class="reviews-stars">' + stars(item.rating) + '</span>' +
            '<span class="review-date">' + date(item.created_at) + (edited ? ' · ' + date(item.updated_at) : '') + '</span>' +
          '</div>' +
          (item.content ? '<div class="review-body" data-no-i18n>' + esc(item.content) + '</div>' : '') +
          '</article>';
      }

      function loadList(reset) {
        if (reset) state.offset = 0;
        var host = document.getElementById('reviews-list');
        if (reset) host.innerHTML = ui.loading();
        api.get('/api/projects/' + encodeURIComponent(slug) + '/reviews?sort=' + state.sort +
          '&limit=10&offset=' + state.offset).then(function (payload) {
          var items = payload.reviews || [];
          if (reset) {
            host.innerHTML = items.length ? items.map(reviewMarkup).join('') :
              '<div class="empty-state">' + tr('no_reviews') + '</div>';
          } else {
            host.insertAdjacentHTML('beforeend', items.map(reviewMarkup).join(''));
          }
          state.offset = payload.next_offset || state.offset + items.length;
          document.getElementById('reviews-more-slot').innerHTML = payload.next_offset
            ? '<button class="btn btn--ghost reviews-more" id="reviews-more">' + tr('load_more') + '</button>' : '';
          var more = document.getElementById('reviews-more');
          if (more) more.addEventListener('click', function () { loadList(false); });
        }).catch(function (error) {
          if (reset) host.innerHTML = ui.error(error && error.message ? error.message : 'Error');
        });
      }

      document.getElementById('reviews-sort').addEventListener('change', function (event) {
        state.sort = event.target.value;
        loadList(true);
      });

      api.get('/api/projects/' + encodeURIComponent(slug) + '/rating').then(summary).catch(function () {
        document.getElementById('reviews-summary').innerHTML = '';
      });
      loadList(true);
      auth.refresh().then(function (user) { state.user = user; renderForm(); });
    }
  };
})();
