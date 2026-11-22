/* Admin panel UI. All actions go through NekoApi; roles/permissions are checked by Worker. */
(function () {
  'use strict';

  var api = window.NekoApi;
  var config = window.NekoConfig;
  var auth = window.NekoAuth;
  var ui = window.NekoUI;
  var panel = document.getElementById('admin-panel');
  var tabs = document.getElementById('admin-tabs');
  if (!api || !config || !auth || !ui || !panel || !tabs) return;

  var PERMISSIONS = ['manage_projects', 'manage_releases', 'manage_news',
    'manage_devblogs', 'manage_users', 'manage_roles'];
  var active = 'info';

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function suffix(path) { return config.ADMIN_BASE_URL + path; }
  function call(path, options) {
    return api.request(suffix(path), Object.assign({ credentials: true }, options || {}));
  }
  function message(text, isError) {
    var box = document.getElementById('admin-message');
    if (box) { box.textContent = text || ''; box.className = 'admin-message' + (isError ? ' error' : ''); }
  }
  function fail(error) {
    message(error && error.message ? error.message : 'Action failed.', true);
  }

  function renderTabs() {
    Array.prototype.forEach.call(tabs.querySelectorAll('[data-tab]'), function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-tab') === active);
    });
  }

  function renderInfo() {
    panel.innerHTML = '<div id="admin-message" class="admin-message"></div><div id="admin-content">' +
      (ui.loading('Loading statistics…')) + '</div>';
    call('/stats').then(function (payload) {
      var s = payload.stats || {};
      var labels = [
        ['Accounts', 'accounts'], ['Users', 'users'], ['Testers', 'testers'], ['Admins', 'admins'],
        ['Projects', 'projects'], ['Published projects', 'published_projects'], ['Releases', 'releases'],
        ['Posts', 'posts'], ['Devlogs', 'devlogs'], ['Users 7d', 'users_7d'], ['Users 30d', 'users_30d']
      ];
      document.getElementById('admin-content').innerHTML = '<div class="admin-grid">' +
        labels.map(function (item) {
          return '<div class="admin-card"><span>' + esc(item[0]) + '</span><strong>' +
            esc(s[item[1]] == null ? '—' : s[item[1]]) + '</strong></div>';
        }).join('') + '</div>';
    }).catch(fail);
  }

  function renderAccounts() {
    panel.innerHTML = '<div id="admin-message" class="admin-message"></div>' +
      '<div class="admin-form"><label><span>Поиск по username</span>' +
      '<input id="user-search" type="search" placeholder="username"></label></div>' +
      '<div id="admin-content">' + ui.loading() + '</div>';
    function load() {
      call('/users').then(function (payload) {
        var query = (document.getElementById('user-search').value || '').toLowerCase();
        var rows = (payload.users || []).filter(function (u) {
          return u.username.toLowerCase().indexOf(query) !== -1;
        });
        document.getElementById('admin-content').innerHTML = '<table class="admin-table"><thead><tr>' +
          '<th>Username</th><th>Роль</th><th>Дата регистрации</th><th>Статус</th></tr></thead><tbody>' +
          rows.map(function (u) {
            return '<tr data-user="' + u.id + '"><td>' + esc(u.username) + '</td><td>' + esc(u.role) +
              '</td><td>' + esc(u.created_at) + '</td><td>' + (u.is_active ? 'active' : 'disabled') + '</td></tr>';
          }).join('') + '</tbody></table>';
      }).catch(fail);
    }
    document.getElementById('user-search').addEventListener('input', load);
    load();
  }

  function renderAccountsDetail(id) {
    panel.innerHTML = '<div id="admin-message" class="admin-message"></div>' +
      '<p><button type="button" class="admin-tab" data-back>← Аккаунты</button></p>' +
      '<div id="admin-content">' + ui.loading() + '</div>';
    call('/users/' + id).then(function (payload) {
      var u = payload.user;
      var checks = PERMISSIONS.map(function (p) {
        return '<label><input type="checkbox" data-perm="' + p + '"' +
          ((u.permissions || []).indexOf(p) !== -1 ? ' checked' : '') + '>' + p + '</label>';
      }).join('');
      document.getElementById('admin-content').innerHTML =
        '<form class="admin-form" id="user-form">' +
          '<div class="settings-value">UUID: ' + esc(u.uuid) + '</div>' +
          '<label><span>Username</span><input id="f-username" value="' + esc(u.username) + '"></label>' +
          '<label><span>Display name</span><input id="f-display" value="' + esc(u.display_name || '') + '"></label>' +
          '<label><span>Bio</span><textarea id="f-bio">' + esc(u.bio || '') + '</textarea></label>' +
          '<label><span>Язык</span><select id="f-language">' +
            ['en', 'ru'].map(function (l) {
              return '<option value="' + l + '"' + (u.language === l ? ' selected' : '') + '>' + l + '</option>';
            }).join('') + '</select></label>' +
          '<label class="settings-check"><input type="checkbox" id="f-public"' + (u.profile_public ? ' checked' : '') + '> Публичный профиль</label>' +
          '<label class="settings-check"><input type="checkbox" id="f-activity"' + (u.show_activity ? ' checked' : '') + '> Показывать активность</label>' +
          '<label class="settings-check"><input type="checkbox" id="f-active"' + (u.is_active ? ' checked' : '') + '> Аккаунт активен</label>' +
          '<label><span>Новый пароль (необязательно)</span><input id="f-password" type="password"></label>' +
          '<label><span>Роль</span><select id="f-role">' +
            ['user', 'tester', 'admin'].map(function (r) {
              return '<option value="' + r + '"' + (u.role === r ? ' selected' : '') + '>' + r + '</option>';
            }).join('') + '</select></label>' +
          '<div><span>Разрешения</span><div class="admin-checks">' + checks + '</div></div>' +
          '<label><span>Доступ к проектам (ID через запятую)</span><input id="f-projects" value="' +
            esc((payload.projectAccess || []).join(',')) + '"></label>' +
          '<label><span>Доступ к релизам (ID через запятую)</span><input id="f-versions" value="' +
            esc((payload.versionAccess || []).join(',')) + '"></label>' +
          '<button class="btn btn--primary" type="submit">Сохранить</button>' +
        '</form>';
      document.getElementById('user-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var body = {
          username: document.getElementById('f-username').value.trim(),
          display_name: document.getElementById('f-display').value.trim(),
          bio: document.getElementById('f-bio').value,
          language: document.getElementById('f-language').value,
          profile_public: document.getElementById('f-public').checked,
          show_activity: document.getElementById('f-activity').checked,
          is_active: document.getElementById('f-active').checked,
          role: document.getElementById('f-role').value,
          permissions: Array.prototype.filter.call(
            document.querySelectorAll('[data-perm]'), function (el) { return el.checked; })
            .map(function (el) { return el.getAttribute('data-perm'); }),
          projectAccess: document.getElementById('f-projects').value.split(',').map(Number).filter(Boolean),
          versionAccess: document.getElementById('f-versions').value.split(',').map(Number).filter(Boolean)
        };
        var password = document.getElementById('f-password').value;
        if (password) body.password = password;
        if (!body.is_active && !window.confirm('Отключить аккаунт и отозвать все сессии?')) return;
        if (password && !window.confirm('Установить новый пароль и отозвать все сессии пользователя?')) return;
        call('/users/' + id, { method: 'POST', body: body })
          .then(function () { message('Сохранено.'); })
          .catch(fail);
      });
    }).catch(fail);
  }

  function renderProjects() {
    panel.innerHTML = '<div id="admin-message" class="admin-message"></div>' +
      '<div id="admin-content">' + ui.loading() + '</div>';
    call('/projects').then(function (payload) {
      document.getElementById('admin-content').innerHTML = '<table class="admin-table"><thead><tr>' +
        '<th>Название</th><th>Slug</th><th>Статус</th><th>Обновлён</th></tr></thead><tbody>' +
        (payload.projects || []).map(function (p) {
          return '<tr data-project="' + p.id + '"><td>' + esc(p.name) + '</td><td>' + esc(p.slug) +
            '</td><td>' + esc(p.status) + (p.is_published ? ' · published' : '') + '</td><td>' +
            esc(p.updated_at) + '</td></tr>';
        }).join('') + '</tbody></table>';
    }).catch(fail);
  }

  function renderProjectsDetail(id) {
    panel.innerHTML = '<div id="admin-message" class="admin-message"></div>' +
      '<p><button type="button" class="admin-tab" data-back>← Проекты</button></p>' +
      '<div id="admin-content">' + ui.loading() + '</div>';
    call('/projects/' + id).then(function (payload) {
      var p = payload.project;
      var fields = [
        ['name', 'Название'], ['slug', 'Slug'], ['short_description', 'Краткое описание'],
        ['description', 'Описание'], ['category', 'Категория'], ['status', 'Статус'],
        ['icon_url', 'Иконка URL'], ['cover_url', 'Обложка URL'],
        ['website_url', 'Сайт URL'], ['repository_url', 'Репозиторий URL'], ['sort_order', 'Порядок']
      ];
      document.getElementById('admin-content').innerHTML =
        '<form class="admin-form" id="project-form">' + fields.map(function (f) {
          return '<label><span>' + f[1] + '</span><input id="p-' + f[0] + '" value="' + esc(p[f[0]]) + '"></label>';
        }).join('') +
        '<label><input type="checkbox" id="p-published"' + (p.is_published ? ' checked' : '') + '> Опубликован</label>' +
        '<button class="btn btn--primary" type="submit">Сохранить проект</button></form>' +
        '<div id="releases"></div>';
      document.getElementById('project-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var body = {};
        fields.forEach(function (f) {
          var value = document.getElementById('p-' + f[0]).value.trim();
          body[f[0]] = f[0] === 'sort_order' ? Number(value) || 0 : value;
        });
        body.is_published = document.getElementById('p-published').checked;
        call('/projects/' + id, { method: 'POST', body: body })
          .then(function () { message('Проект сохранён.'); }).catch(fail);
      });
      renderReleases(id);
    }).catch(fail);
  }

  function renderReleases(projectId) {
    Promise.all([call('/projects/' + projectId + '/versions'), call('/projects/' + projectId)]).then(function (results) {
      var payload = results[0];
      var project = results[1].project || {};
      var host = document.getElementById('releases');
      host.innerHTML = '<h2>Релизы</h2><table class="admin-table"><tbody>' +
        (payload.versions || []).map(function (v) {
          var versionLink = project.slug
            ? '<a href="version.html?project=' + encodeURIComponent(project.slug) + '&id=' +
              encodeURIComponent(v.id) + '">' + esc(v.version_number) + '</a>'
            : esc(v.version_number);
          return '<tr><td>' + versionLink + ' ' + esc(v.release_name || '') + '</td>' +
            '<td>' + (v.is_published ? 'опубликован' : 'скрыт') + '</td>' +
            '<td><button class="admin-tab" data-version="' + v.id + '" data-published="' +
            (v.is_published ? 1 : 0) + '">' + (v.is_published ? 'Скрыть' : 'Опубликовать') + '</button></td></tr>';
        }).join('') + '</tbody></table>' +
        '<form class="admin-form" id="version-form">' +
          '<label><span>Версия</span><input id="v-number" required></label>' +
          '<label><span>Название</span><input id="v-name"></label>' +
          '<label><span>Release notes</span><textarea id="v-notes"></textarea></label>' +
          '<label><span>Платформа</span><input id="v-platform" value="all"></label>' +
          '<label><span>URL файла</span><input id="v-url"></label>' +
          '<label><input type="checkbox" id="v-published"> Опубликовать сразу</label>' +
          '<button class="btn btn--primary" type="submit">Добавить релиз</button></form>';
      document.getElementById('version-form').addEventListener('submit', function (event) {
        event.preventDefault();
        call('/projects/' + projectId + '/versions', { method: 'POST', body: {
          version_number: document.getElementById('v-number').value.trim(),
          release_name: document.getElementById('v-name').value.trim(),
          release_notes: document.getElementById('v-notes').value,
          platform: document.getElementById('v-platform').value.trim(),
          file_url: document.getElementById('v-url').value.trim(),
          is_published: document.getElementById('v-published').checked
        } }).then(function () { message('Релиз добавлен.'); renderReleases(projectId); }).catch(fail);
      });
    }).catch(fail);
  }

  function renderPosts() {
    panel.innerHTML = '<div id="admin-message" class="admin-message"></div>' +
      '<div id="admin-content">' + ui.loading() + '</div>';
    call('/posts').then(function (payload) {
      document.getElementById('admin-content').innerHTML =
        '<form class="admin-form" id="post-form">' +
          '<label><span>Название</span><input id="n-title" required></label>' +
          '<label><span>Slug</span><input id="n-slug" required></label>' +
          '<label><span>Тип</span><select id="n-type"><option value="news">news</option>' +
            '<option value="devblog">devblog</option></select></label>' +
          '<label><span>Краткое описание</span><input id="n-excerpt"></label>' +
          '<label><span>Текст</span><textarea id="n-content"></textarea></label>' +
          '<label><span>URL изображения</span><input id="n-cover"></label>' +
          '<label><span>ID проекта (необязательно)</span><input id="n-project"></label>' +
          '<label><input type="checkbox" id="n-published"> Опубликовать</label>' +
          '<button class="btn btn--primary" type="submit">Создать пост</button></form>' +
        '<table class="admin-table"><thead><tr><th>Название</th><th>Тип</th><th>Дата</th><th>Статус</th><th></th></tr></thead><tbody>' +
        (payload.posts || []).map(function (p) {
          return '<tr><td>' + esc(p.title) + '</td><td>' + esc(p.post_type || 'news') + '</td><td>' +
            esc(p.published_at || p.created_at) + '</td><td>' + (p.is_published ? 'опубликован' : 'черновик') +
            '</td><td><button class="admin-tab" data-post="' + p.id + '" data-published="' +
            (p.is_published ? 1 : 0) + '">' + (p.is_published ? 'Снять' : 'Опубликовать') +
            '</button> <button class="admin-tab" data-delete="' + p.id + '">Удалить</button></td></tr>';
        }).join('') + '</tbody></table>';
      document.getElementById('post-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var projectId = Number(document.getElementById('n-project').value.trim());
        call('/posts', { method: 'POST', body: {
          title: document.getElementById('n-title').value.trim(),
          slug: document.getElementById('n-slug').value.trim(),
          post_type: document.getElementById('n-type').value,
          excerpt: document.getElementById('n-excerpt').value.trim(),
          content: document.getElementById('n-content').value,
          cover_url: document.getElementById('n-cover').value.trim(),
          project_id: projectId || null,
          is_published: document.getElementById('n-published').checked
        } }).then(function () { message('Пост создан.'); renderPosts(); }).catch(fail);
      });
    }).catch(fail);
  }

  function renderSettings() {
    panel.innerHTML = '<div id="admin-message" class="admin-message"></div>' +
      '<div id="admin-content">' + ui.loading() + '</div>';
    call('/settings').then(function (payload) {
      var settings = {};
      (payload.settings || []).forEach(function (s) { settings[s.setting_key] = s.setting_value; });
      var labels = [['site_name', 'Название сайта'], ['site_slogan', 'Слоган'],
        ['site_theme', 'Тема'], ['default_language', 'Язык по умолчанию']];
      document.getElementById('admin-content').innerHTML = '<form class="admin-form" id="settings-form">' +
        labels.map(function (l) {
          return '<label><span>' + l[1] + '</span><input id="set-' + l[0] + '" value="' +
            esc(settings[l[0]] || '') + '"></label>';
        }).join('') + '<button class="btn btn--primary" type="submit">Сохранить</button></form>';
      document.getElementById('settings-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var body = { settings: {} };
        labels.forEach(function (l) { body.settings[l[0]] = document.getElementById('set-' + l[0]).value.trim(); });
        call('/settings', { method: 'POST', body: body })
          .then(function () { message('Настройки сохранены.'); })
          .catch(fail);
      });
    }).catch(fail);
  }

  function renderLog() {
    panel.innerHTML = '<div id="admin-message" class="admin-message"></div>' +
      '<div id="admin-content">' + ui.loading() + '</div>';
    call('/log').then(function (payload) {
      document.getElementById('admin-content').innerHTML = '<table class="admin-table"><thead><tr>' +
        '<th>Дата</th><th>Администратор</th><th>Цель</th><th>Действие</th><th>Детали</th></tr></thead><tbody>' +
        (payload.entries || []).map(function (e) {
          return '<tr><td>' + esc(e.created_at) + '</td><td>' + esc(e.admin_uuid) + '</td><td>' +
            esc(e.target_uuid || '—') + '</td><td>' + esc(e.action) + '</td><td>' + esc(e.details) + '</td></tr>';
        }).join('') + '</tbody></table>';
    }).catch(fail);
  }

  function renderReviews() {
    panel.innerHTML = '<div id="admin-message" class="admin-message"></div>' +
      '<div id="admin-content">' + ui.loading() + '</div>';
    call('/reviews').then(function (payload) {
      var rows = payload.reviews || [];
      document.getElementById('admin-content').innerHTML =
        '<table class="admin-table"><thead><tr><th>' + tr('rating') + '</th><th>@</th><th>Проект</th>' +
          '<th>' + tr('description') + '</th><th>Дата</th><th></th></tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr data-review="' + r.id + '"><td>' + r.rating + '</td><td>' + esc(r.username) +
            '</td><td>' + esc(r.project_slug) + '</td><td>' + esc((r.content || '').slice(0, 120)) +
            '</td><td>' + esc(r.created_at) + '</td><td>' +
            '<button class="admin-tab" data-review-toggle="' + r.id + '" data-published="' + (r.is_published ? 1 : 0) + '">' +
              (r.is_published ? tr('reviews_hidden') : tr('reviews_show')) + '</button> ' +
            '<button class="admin-tab" data-review-delete="' + r.id + '">' + tr('delete_review') + '</button></td></tr>';
        }).join('') + '</tbody></table>';
    }).catch(fail);
  }

  function tr(key) { return window.NekoI18n ? window.NekoI18n.t(key) : key; }

  function renderTeam() {
    panel.innerHTML = '<div id="admin-message" class="admin-message"></div>' +
      '<div id="admin-content">' + ui.loading() + '</div>';
    Promise.all([call('/team'), call('/team/users')]).then(function (results) {
      var members = results[0].members || [];
      var users = results[1].users || [];
      document.getElementById('admin-content').innerHTML =
        '<form class="admin-form" id="team-add">' +
          '<label><span>' + tr('select_user') + '</span><select id="t-user">' +
            users.map(function (u) {
              return '<option value="' + u.id + '">' + esc(u.display_name || u.username) + ' (@' + esc(u.username) + ')</option>';
            }).join('') + '</select></label>' +
          '<label><span>' + tr('team_role') + '</span><input id="t-role" required placeholder="Founder"></label>' +
          '<label><span>' + tr('description') + '</span><input id="t-desc"></label>' +
          '<label><span>' + tr('sort_order') + '</span><input id="t-order" type="number" value="0"></label>' +
          '<button class="btn btn--primary" type="submit">' + tr('add_member') + '</button>' +
        '</form>' +
        '<table class="admin-table"><thead><tr><th>@</th><th>' + tr('team_role') + '</th><th>' +
          tr('description') + '</th><th>' + tr('sort_order') + '</th><th></th></tr></thead><tbody>' +
        members.map(function (m) {
          return '<tr data-team="' + m.id + '"><td>' + esc(m.username) + '</td>' +
            '<td><input data-field="team_role" value="' + esc(m.team_role) + '"></td>' +
            '<td><input data-field="description" value="' + esc(m.description || '') + '"></td>' +
            '<td><input data-field="sort_order" type="number" value="' + esc(m.sort_order) + '"></td>' +
            '<td><button class="admin-tab" data-team-save="' + m.id + '">' + tr('save') + '</button> ' +
            '<button class="admin-tab" data-team-delete="' + m.id + '">' + tr('remove_member') + '</button></td></tr>';
        }).join('') + '</tbody></table>';

      document.getElementById('team-add').addEventListener('submit', function (event) {
        event.preventDefault();
        if (!users.length) { message('Нет доступных пользователей.', true); return; }
        call('/team', { method: 'POST', body: {
          user_id: Number(document.getElementById('t-user').value),
          team_role: document.getElementById('t-role').value.trim(),
          description: document.getElementById('t-desc').value.trim(),
          sort_order: Number(document.getElementById('t-order').value) || 0
        } }).then(function () { message(tr('saved') || 'Saved.'); renderTeam(); }).catch(fail);
      });
    }).catch(fail);
  }

  function render() {
    renderTabs();
    if (active === 'info') renderInfo();
    if (active === 'accounts') renderAccounts();
    if (active === 'projects') renderProjects();
    if (active === 'posts') renderPosts();
    if (active === 'settings') renderSettings();
    if (active === 'log') renderLog();
    if (active === 'team') renderTeam();
    if (active === 'reviews') renderReviews();
  }

  tabs.addEventListener('click', function (event) {
    var button = event.target.closest('[data-tab]');
    if (!button) return;
    active = button.getAttribute('data-tab');
    render();
  });

  panel.addEventListener('click', function (event) {
    var target = event.target;
    if (target.closest('[data-back]')) {
      active = target.closest('[data-back]').textContent.includes('Аккаунты') ? 'accounts' : 'projects';
      render(); return;
    }
    var userRow = target.closest('[data-user]');
    if (userRow) { renderAccountsDetail(userRow.getAttribute('data-user')); return; }
    var projectRow = target.closest('[data-project]');
    if (projectRow) { renderProjectsDetail(projectRow.getAttribute('data-project')); return; }
    var versionButton = target.closest('[data-version]');
    if (versionButton) {
      var id = versionButton.getAttribute('data-version');
      var isPublished = versionButton.getAttribute('data-published') !== '1';
      call('/versions/' + id, { method: 'POST', body: { is_published: isPublished } })
        .then(function () { message('Релиз обновлён.'); }).catch(fail);
      return;
    }
    var postButton = target.closest('[data-post]');
    if (postButton) {
      var postId = postButton.getAttribute('data-post');
      var publish = postButton.getAttribute('data-published') !== '1';
      call('/posts/' + postId, { method: 'POST', body: { is_published: publish } })
        .then(function () { message('Пост обновлён.'); renderPosts(); }).catch(fail);
      return;
    }
    var deleteButton = target.closest('[data-delete]');
    if (deleteButton) {
      if (!window.confirm('Удалить пост без возможности восстановления?')) return;
      call('/posts/' + deleteButton.getAttribute('data-delete'), { method: 'DELETE' })
        .then(function () { message('Пост удалён.'); renderPosts(); }).catch(fail);
      return;
    }
    var teamSave = target.closest('[data-team-save]');
    if (teamSave) {
      var row = teamSave.closest('[data-team]');
      var body = {};
      Array.prototype.forEach.call(row.querySelectorAll('[data-field]'), function (input) {
        var key = input.getAttribute('data-field');
        body[key] = key === 'sort_order' ? Number(input.value) || 0 : input.value.trim();
      });
      call('/team/' + teamSave.getAttribute('data-team-save'), { method: 'PATCH', body: body })
        .then(function () { message('Сохранено.'); renderTeam(); }).catch(fail);
      return;
    }
    var teamDelete = target.closest('[data-team-delete]');
    if (teamDelete) {
      if (!window.confirm('Удалить участника из команды? Аккаунт не будет удалён.')) return;
      call('/team/' + teamDelete.getAttribute('data-team-delete'), { method: 'DELETE' })
        .then(function () { message('Участник удалён.'); renderTeam(); }).catch(fail);
      return;
    }
    var reviewToggle = target.closest('[data-review-toggle]');
    if (reviewToggle) {
      var published = reviewToggle.getAttribute('data-published') !== '1';
      call('/reviews/' + reviewToggle.getAttribute('data-review-toggle'),
        { method: 'PATCH', body: { is_published: published } })
        .then(function () { message('Сохранено.'); renderReviews(); }).catch(fail);
      return;
    }
    var reviewDelete = target.closest('[data-review-delete]');
    if (reviewDelete) {
      if (!window.confirm('Удалить отзыв? Аккаунт не будет удалён.')) return;
      call('/reviews/' + reviewDelete.getAttribute('data-review-delete'), { method: 'DELETE' })
        .then(function () { message('Отзыв удалён.'); renderReviews(); }).catch(fail);
    }
  });

  auth.refresh().then(function (user) {
    if (!user || user.role !== 'admin') {
      panel.innerHTML = ui.notFound('Доступ запрещён', 'Панель управления доступна только администраторам.',
        'index.html', 'На главную');
      return;
    }
    render();
  });
})();
