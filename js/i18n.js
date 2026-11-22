/* Shared RU/EN localization. Translates data-i18n nodes and existing UI text. */
(function () {
  'use strict';

  var dictionary = {
    'profile': { ru: 'Профиль', en: 'Profile' },
    'security': { ru: 'Безопасность', en: 'Security' },
    'interface': { ru: 'Интерфейс', en: 'Interface' },
    'privacy': { ru: 'Приватность', en: 'Privacy' },
    'save': { ru: 'Сохранить', en: 'Save' },
    'saved': { ru: 'Сохранено', en: 'Saved' },
    'current_password': { ru: 'Текущий пароль', en: 'Current password' },
    'new_password': { ru: 'Новый пароль', en: 'New password' },
    'confirm_password': { ru: 'Подтвердите пароль', en: 'Confirm password' },
    'change_password': { ru: 'Сменить пароль', en: 'Change password' },
    'revoke_others': { ru: 'Завершить другие сессии', en: 'Revoke other sessions' },
    'logout': { ru: 'Выйти из аккаунта', en: 'Log out' },
    'admin_panel': { ru: 'Панель управления', en: 'Admin panel' },
    'public_profile': { ru: 'Публичный профиль', en: 'Public profile' },
    'show_activity': { ru: 'Показывать активность', en: 'Show activity' },
    'language': { ru: 'Язык', en: 'Language' },
    'theme': { ru: 'Тема', en: 'Theme' },
    'team': { ru: 'Команда', en: 'Team' },
    'team_title': { ru: 'NekoStudios Team', en: 'NekoStudios Team' },
    'add_member': { ru: 'Добавить участника', en: 'Add member' },
    'select_user': { ru: 'Выберите пользователя', en: 'Select a user' },
    'team_role': { ru: 'Роль в команде', en: 'Team role' },
    'description': { ru: 'Описание', en: 'Description' },
    'sort_order': { ru: 'Порядок', en: 'Order' },
    'remove_member': { ru: 'Удалить участника', en: 'Remove member' },
    'cancel': { ru: 'Отмена', en: 'Cancel' },
    'no_members': { ru: 'Состав команды пока не сформирован.', en: 'The team roster is empty for now.' },
    'reviews': { ru: 'Отзывы', en: 'Reviews' },
    'rating': { ru: 'Оценка', en: 'Rating' },
    'write_review': { ru: 'Написать отзыв', en: 'Write a review' },
    'edit_review': { ru: 'Изменить отзыв', en: 'Edit review' },
    'delete_review': { ru: 'Удалить отзыв', en: 'Delete review' },
    'submit': { ru: 'Отправить', en: 'Submit' },
    'no_reviews': { ru: 'Пока нет отзывов.', en: 'No reviews yet.' },
    'based_on': { ru: 'На основе', en: 'Based on' },
    'ratings': { ru: 'оценок', en: 'ratings' },
    'reviews_hidden': { ru: 'Скрыть отзыв', en: 'Hide review' },
    'reviews_show': { ru: 'Вернуть отзыв', en: 'Restore review' },
    'load_more': { ru: 'Загрузить ещё', en: 'Load more' },
    'home': { ru: 'Главная', en: 'Home' },
    'projects': { ru: 'Проекты', en: 'Projects' },
    'about': { ru: 'О нас', en: 'About' },
    'account': { ru: 'Аккаунт', en: 'Account' },
    'news': { ru: 'Новости', en: 'News' },
    'contact': { ru: 'Контакты', en: 'Contact' },
    'bug_reports': { ru: 'Сообщить об ошибке', en: 'Bug Reports' },
    'channel': { ru: 'Канал', en: 'Channel' }
  };

  // Fallback for UI strings that were written directly in templates.
  var textMap = {
    'Главная': 'Home', 'Проекты': 'Projects', 'О нас': 'About', 'Аккаунт': 'Account',
    'Панель управления': 'Admin panel', 'Выйти из аккаунта': 'Log out',
    'Пока нет публикаций': 'No publications yet',
    'Новости и devlog появятся здесь.': 'News and devlog will appear here.',
    'Публикации не загрузились.': 'Publications could not be loaded.',
    'Публикации не найдены.': 'No publications found.',
    'Попробуйте другой запрос или вернитесь ко всем новостям.': 'Try another query or return to all news.',
    'Сбросить фильтры': 'Reset filters',
    'Этот пост не привязан к конкретному проекту.': 'This post is not linked to a project.',
    'Публикация не найдена': 'Publication not found',
    'Попробуйте вернуться к списку публикаций.': 'Try returning to the publication list.',
    'Версия': 'Version', 'Название': 'Title', 'Платформа': 'Platform',
    'Дата релиза': 'Release date', 'Тип файла': 'File type', '← Проект': '← Project',
    'Информация': 'Information', 'Файл релиза': 'Release file',
    'Поиск по username': 'Search by username', 'Роль': 'Role',
    'Дата регистрации': 'Registered', 'Статус': 'Status',
    '← Аккаунты': '← Accounts', 'Язык': 'Language',
    'Публичный профиль': 'Public profile', 'Показывать активность': 'Show activity',
    'Аккаунт активен': 'Account active', 'Новый пароль (необязательно)': 'New password (optional)',
    'Разрешения': 'Permissions', 'Доступ к проектам (ID через запятую)': 'Project access (comma-separated IDs)',
    'Доступ к релизам (ID через запятую)': 'Release access (comma-separated IDs)',
    'Отключить аккаунт и отозвать все сессии?': 'Disable this account and revoke all sessions?',
    'Установить новый пароль и отозвать все сессии пользователя?': 'Set a new password and revoke all user sessions?',
    'Сохранено.': 'Saved.', 'Название сайта': 'Site name', 'Слоган': 'Slogan',
    'Язык по умолчанию': 'Default language', 'Настройки сохранены.': 'Settings saved.',
    'Нет доступных пользователей.': 'No available users.', 'Релиз обновлён.': 'Release updated.',
    'Пост обновлён.': 'Post updated.', 'Удалить пост без возможности восстановления?': 'Delete this post permanently?',
    'Участник удалён.': 'Member removed.', 'Проект сохранён.': 'Project saved.',
    'Релиз добавлен.': 'Release added.', 'Пост создан.': 'Post created.',
    'Удалить участника из команды? Аккаунт не будет удалён.': 'Remove this member from the team? The account will not be deleted.',
    'Удалить отзыв? Аккаунт не будет удалён.': 'Delete this review? The account will not be deleted.',
    'Отзыв удалён.': 'Review deleted.', 'Проект': 'Project', 'Проекты': 'Projects',
    'Краткое описание': 'Short description', 'Категория': 'Category',
    'Иконка URL': 'Icon URL', 'Обложка URL': 'Cover URL', 'Сайт URL': 'Website URL',
    'Репозиторий URL': 'Repository URL', 'Опубликован': 'Published',
    'Сохранить проект': 'Save project', 'Релизы': 'Releases',
    'опубликован': 'published', 'скрыт': 'hidden', 'Скрыть': 'Hide', 'Опубликовать': 'Publish',
    'Версия': 'Version', 'Release notes': 'Release notes', 'URL файла': 'File URL',
    'Опубликовать сразу': 'Publish immediately', 'Добавить релиз': 'Add release',
    'Тип': 'Type', 'Текст': 'Text', 'URL изображения': 'Image URL',
    'ID проекта (необязательно)': 'Project ID (optional)', 'Создать пост': 'Create post',
    'Дата': 'Date', 'Администратор': 'Admin', 'Цель': 'Target', 'Действие': 'Action', 'Детали': 'Details',
    '← Проекты': '← Projects', 'Проект': 'Project', 'Название': 'Title',
    'Все публикации →': 'All publications →',
    'Управление профилем и безопасностью аккаунта.': 'Manage your profile and account security.',
    'Состав команды пока не сформирован.': 'The team roster is empty for now.',
    'Neko ID': 'Neko ID', 'Сохранить': 'Save', 'Отмена': 'Cancel',
    'Имя пользователя': 'Username', 'Отображаемое имя': 'Display name',
    'Биография': 'Bio', 'Зарегистрирован': 'Registered',
    'Новости и devlog': 'News / Devlog', 'Главная страница': 'Home page'
  };

  var current = 'en';
  try { current = window.localStorage.getItem('neko_lang') || 'en'; } catch (e) {}

  var reverseText = {};
  var reverseDict = {};
  Object.keys(textMap).forEach(function (ru) { reverseText[textMap[ru]] = ru; });
  Object.keys(dictionary).forEach(function (key) {
    var entry = dictionary[key];
    if (entry.en) reverseDict[entry.en] = entry.ru;
  });

  function t(key) {
    var entry = dictionary[key];
    if (entry) return entry[current] || entry.en || entry.ru || key;
    if (current === 'en' && textMap[key]) return textMap[key];
    return key;
  }

  var translating = false;

  function translateNode(node) {
    if (translating || !node) return;
    if (node.nodeType === 3) {
      if (node.parentElement && node.parentElement.closest('[data-no-i18n]')) return;
      var text = node.nodeValue.trim();
      if (!text) return;
      var replacement = current === 'en'
        ? (dictionary[text] ? dictionary[text].en : textMap[text])
        : (reverseDict[text] || reverseText[text]);
      if (replacement && replacement !== text) {
        translating = true;
        node.nodeValue = node.nodeValue.replace(text, replacement);
        translating = false;
      }
      return;
    }
    if (node.nodeType !== 1) return;
    if (node.hasAttribute('data-i18n')) {
      var value = t(node.getAttribute('data-i18n'));
      if (node.textContent !== value) node.textContent = value;
    }
    ['placeholder', 'title', 'aria-label'].forEach(function (attr) {
      if (!node.hasAttribute(attr)) return;
      var source = node.getAttribute(attr);
      var translated = current === 'en'
        ? (dictionary[source] ? dictionary[source].en : textMap[source])
        : (reverseDict[source] || reverseText[source]);
      if (translated && translated !== source) node.setAttribute(attr, translated);
    });
  }

  function apply(lang) {
    current = lang === 'ru' ? 'ru' : 'en';
    try { window.localStorage.setItem('neko_lang', current); } catch (e) {}
    document.documentElement.setAttribute('lang', current);
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateNode);
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (node) {
      var value = t(node.getAttribute('data-i18n'));
      if (node.textContent !== value) node.textContent = value;
    });
  }

  apply(current);

  if (typeof MutationObserver === 'function') {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, translateNode);
        if (mutation.target && mutation.target.nodeType === 1) translateNode(mutation.target);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  window.NekoI18n = { t: t, apply: apply, current: function () { return current; } };
})();
