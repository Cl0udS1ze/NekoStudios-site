/*
 * Global RU/EN localization.
 * - Russian is the default language.
 * - The choice is stored in localStorage under `neko_lang` and restored on load.
 * - Static UI uses data-i18n / data-i18n-placeholder / data-i18n-aria.
 * - Dynamic views subscribe with NekoI18n.onChange() and re-render themselves.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'neko_lang';
  var DEFAULT_LANG = 'ru';

  var translations = {
    /* ---------- Global chrome ---------- */
    'skip': { ru: 'Перейти к содержимому', en: 'Skip to content' },
    'nav_home': { ru: 'Главная', en: 'Home' },
    'nav_projects': { ru: 'Проекты', en: 'Projects' },
    'nav_about': { ru: 'О нас', en: 'About' },
    'nav_account': { ru: 'Аккаунт', en: 'Account' },
    'nav_team': { ru: 'Команда', en: 'Team' },
    'nav_news': { ru: 'Devlog', en: 'Devlog' },
    'nav_main': { ru: 'Основная навигация', en: 'Main navigation' },
    'nav_secondary': { ru: 'Дополнительная навигация', en: 'Secondary navigation' },
    'nav_footer': { ru: 'Навигация в подвале', en: 'Footer navigation' },
    'menu_open': { ru: 'Открыть меню', en: 'Open menu' },
    'menu_close': { ru: 'Закрыть меню', en: 'Close menu' },
    'lang_label': { ru: 'Язык', en: 'Language' },
    'brand_home': { ru: 'NekoStudios — на главную', en: 'NekoStudios — home' },
    'site_slogan': { ru: 'Маленькая студия. Большие миры.', en: 'Small studio. Big worlds.' },

    /* ---------- Footer ---------- */
    'footer_about': {
      ru: 'Независимая студия, создающая игры, программы и экспериментальные AI-системы.',
      en: 'An independent studio creating games, software and experimental AI systems.'
    },
    'footer_navigate': { ru: 'Навигация', en: 'Navigate' },
    'footer_contact': { ru: 'Контакты', en: 'Contact' },
    'footer_news': { ru: 'Новости / Devlog', en: 'News / Devlog' },
    'bug_reports': { ru: 'Сообщить об ошибке', en: 'Bug Reports' },
    'channel': { ru: 'Канал', en: 'Channel' },
    'footer_role': { ru: 'Независимая игровая и программная студия', en: 'Independent Game & Software Studio' },

    /* ---------- Home ---------- */
    'home_eyebrow': { ru: 'Независимая игровая и программная студия', en: 'Independent Game & Software Studio' },
    'home_lead': {
      ru: 'Мы создаём интерактивные миры, полезные цифровые инструменты и экспериментальные AI-системы.',
      en: 'We build interactive worlds, useful digital tools and experimental AI systems.'
    },
    'home_cta_projects': { ru: 'Смотреть проекты', en: 'Explore our projects' },
    'home_cta_about': { ru: 'О студии', en: 'About the studio' },
    'home_caption': { ru: 'Идеи&nbsp; → &nbsp;Миры', en: 'Ideas&nbsp; → &nbsp;Worlds' },
    'home_scroll': { ru: 'листайте вниз', en: 'scroll to explore' },
    'home_featured_eyebrow': { ru: 'Главный проект студии', en: 'Featured project' },
    'home_featured_lead': {
      ru: '2D-игра про добычу полезных ископаемых в разработке. Пробивайтесь сквозь пласты, находите ресурсы и улучшайте снаряжение.',
      en: 'A 2D mining game in development. Dig through layers, discover resources and upgrade your equipment.'
    },
    'home_featured_open': { ru: 'Открыть проект', en: 'View project' },
    'home_featured_meta': { ru: 'Игра · В разработке', en: 'Game · In development' },
    'home_news_eyebrow': { ru: 'Из devlog', en: 'From the devlog' },
    'home_news_title': { ru: 'Новости и devlog', en: 'News & Devlog' },
    'home_news_all': { ru: 'Все публикации →', en: 'All publications →' },
    'home_projects_eyebrow': { ru: 'Что мы создаём', en: 'What we are building' },
    'home_projects_title': { ru: 'Избранные проекты', en: 'Featured Projects' },
    'home_projects_intro': {
      ru: 'Миры, инструменты и идеи, которые сейчас разрабатываются в NekoStudios.',
      en: 'Explore the worlds, tools and ideas currently being developed at NekoStudios.'
    },
    'home_about_eyebrow': { ru: 'О студии', en: 'About the studio' },
    'home_about_title': { ru: 'Создано из идей. Ведомо воображением.', en: 'Built from ideas. Driven by imagination.' },
    'home_about_p1': {
      ru: 'NekoStudios — независимая студия, создающая игры, программы и экспериментальные AI-системы.',
      en: 'NekoStudios is an independent studio creating games, software and experimental AI systems.'
    },
    'home_about_p2': {
      ru: 'Мы строим интерактивные миры, разрабатываем полезные цифровые инструменты и исследуем новые идеи через технологии.',
      en: 'We build interactive worlds, develop useful digital tools and explore new ideas through technology.'
    },
    'home_about_p3': {
      ru: 'Среди наших программных проектов — экспериментальные утилиты и AI-система NEIRON, которая создаётся с нуля и всё ещё находится в разработке.',
      en: 'Our software projects include experimental utilities and the AI system NEIRON, which is being built from the ground up and is still in development.'
    },
    'home_about_label': { ru: 'Независимость как принцип', en: 'Independent by design' },

    /* ---------- Filters ---------- */
    'filter_all': { ru: 'Все проекты', en: 'All Projects' },
    'filter_games': { ru: 'Игры', en: 'Games' },
    'filter_software': { ru: 'Софт', en: 'Software' },
    'filter_ai': { ru: 'AI и исследования', en: 'AI & Research' },

    /* ---------- Projects catalog ---------- */
    'projects_eyebrow': { ru: 'Каталог', en: 'Catalog' },
    'projects_title': { ru: 'Наши проекты', en: 'Our Projects' },
    'projects_subtitle': {
      ru: 'Игры, программы и экспериментальные технологии — созданные из идей и разработанные с воображением.',
      en: 'Games, software and experimental technology — built from ideas and developed with imagination.'
    },
    'projects_support': {
      ru: 'Миры, инструменты и системы, которые сейчас создаются в NekoStudios.',
      en: 'Explore the worlds, tools and systems currently being created at NekoStudios.'
    },
    'projects_search': { ru: 'Поиск проектов', en: 'Search projects' },
    'projects_catalog_label': { ru: 'Каталог проектов', en: 'Project catalog' },
    'filter_projects_label': { ru: 'Фильтр проектов', en: 'Filter projects' },
    'filter_news_label': { ru: 'Фильтр публикаций', en: 'Filter publications' },
    'projects_empty_title': { ru: 'Проекты не найдены.', en: 'No projects found.' },
    'projects_empty_text': { ru: 'Попробуйте другой запрос или вернитесь ко всем проектам.', en: 'Try another search or return to all projects.' },
    'projects_reset': { ru: 'Сбросить поиск', en: 'Reset search' },
    'projects_cat_empty': { ru: 'В этой категории пока нет проектов.', en: 'No projects in this category yet.' },
    'projects_show_all': { ru: 'Показать все проекты', en: 'Show All Projects' },
    'projects_load_error': { ru: 'Не удалось загрузить проекты.', en: 'Projects could not be loaded.' },
    'projects_js_notice': { ru: 'Включите JavaScript, чтобы увидеть каталог проектов.', en: 'Enable JavaScript to view the project catalog.' },
    'view_project': { ru: 'Открыть проект', en: 'View Project' },
    'project_not_found': { ru: 'Проект не найден', en: 'Project not found' },
    'project_not_found_text': { ru: 'Этого проекта нет в каталоге.', en: 'This project is not in the catalog.' },
    'back_all_projects': { ru: '← Все проекты', en: '← All Projects' },
    'back_project': { ru: '← Проект', en: '← Project' },
    'version': { ru: 'Версия', en: 'Version' },
    'platform': { ru: 'Платформа', en: 'Platform' },
    'release_date': { ru: 'Дата релиза', en: 'Release date' },
    'file_type': { ru: 'Тип файла', en: 'File type' },
    'overview': { ru: 'Обзор', en: 'Overview' },
    'versions': { ru: 'Версии', en: 'Versions' },
    'versions_empty_title': { ru: 'Опубликованных версий пока нет.', en: 'No versions published yet.' },
    'versions_empty_text': { ru: 'Версии проекта появятся здесь, когда будут доступны.', en: 'Versions for this project will appear here when available.' },
    'versions_load_error': { ru: 'Не удалось загрузить версии.', en: 'Versions could not be loaded.' },
    'project_load_error': { ru: 'Не удалось загрузить проект.', en: 'Project could not be loaded.' },

    /* ---------- News / Devlog ---------- */
    'news_eyebrow': { ru: 'Журнал', en: 'Journal' },
    'news_title': { ru: 'Новости и devlog', en: 'News & Devlog' },
    'news_subtitle': {
      ru: 'Новости студии, обновления проектов и заметки о процессе разработки NekoStudios.',
      en: 'Studio news, project updates and development notes from NekoStudios.'
    },
    'news_support': {
      ru: 'Черновики-демонстрации помечены как таковые и не являются официальными анонсами.',
      en: 'Demonstration drafts are marked as such and are not official announcements.'
    },
    'news_search': { ru: 'Поиск публикаций', en: 'Search publications' },
    'news_section_label': { ru: 'Публикации', en: 'Publications' },
    'news_filter_all': { ru: 'Все новости', en: 'All News' },
    'news_filter_studio': { ru: 'Новости студии', en: 'Studio News' },
    'news_filter_games': { ru: 'Обновления игр', en: 'Game Updates' },
    'news_filter_software': { ru: 'Софт', en: 'Software' },
    'news_filter_devlog': { ru: 'Devlog', en: 'Devlog' },
    'news_read': { ru: 'Читать статью', en: 'Read article' },
    'news_empty_title': { ru: 'Публикации не найдены.', en: 'No publications found.' },
    'news_empty_text': { ru: 'Попробуйте другой запрос или вернитесь ко всем новостям.', en: 'Try another query or return to all news.' },
    'news_reset': { ru: 'Сбросить фильтры', en: 'Reset filters' },
    'news_load_error': { ru: 'Не удалось загрузить публикации.', en: 'Publications could not be loaded.' },
    'news_js_notice': { ru: 'Включите JavaScript, чтобы увидеть публикации.', en: 'Enable JavaScript to view publications.' },
    'news_demo_material': { ru: 'Демонстрационный материал', en: 'Demo material' },
    'news_draft_demo': { ru: 'Черновик · Демо', en: 'Draft · Demo material' },
    'news_published': { ru: 'Опубликовано', en: 'Published' },
    'news_draft': { ru: 'Черновик', en: 'Draft' },
    'news_no_posts_title': { ru: 'Пока нет публикаций', en: 'No publications yet' },
    'news_no_posts_text': { ru: 'Новости и devlog появятся здесь.', en: 'News and devlog will appear here.' },
    'article_back': { ru: '← Новости и devlog', en: '← News & Devlog' },
    'article_about': { ru: 'Об этой публикации', en: 'About this post' },
    'article_category': { ru: 'Категория', en: 'Category' },
    'article_status': { ru: 'Статус', en: 'Status' },
    'article_related': { ru: 'Связанный проект:', en: 'Related project:' },
    'article_not_linked': { ru: 'Эта публикация не привязана к конкретному проекту.', en: 'This post is not linked to a project.' },
    'article_all': { ru: 'Все публикации', en: 'All publications' },
    'article_not_found': { ru: 'Публикация не найдена', en: 'Publication not found' },
    'article_not_found_text': { ru: 'Попробуйте вернуться к списку публикаций.', en: 'Try returning to the publication list.' },
    'article_load_error': { ru: 'Не удалось загрузить публикацию.', en: 'The publication could not be loaded.' },
    'article_demo_suffix': { ru: ' (демонстрационный черновик)', en: ' (demonstration draft)' },

    /* ---------- Team ---------- */
    'team_eyebrow': { ru: 'Люди за проектами', en: 'People behind the projects' },
    'team_title': { ru: 'Команда NekoStudios', en: 'NekoStudios Team' },
    'team_subtitle': {
      ru: 'Небольшая команда, которая создаёт игры, инструменты и экспериментирует с технологиями.',
      en: 'A small team building games, tools and experimenting with technology.'
    },
    'team_support': {
      ru: 'Состав команды ведётся через Neko ID. Профиль открывается по карточке участника.',
      en: 'The roster is managed through Neko ID. Open a member card to view the profile.'
    },
    'no_members': { ru: 'Состав команды пока не сформирован.', en: 'The team roster is empty for now.' },
    'team_empty_title': { ru: 'Команда пока не сформирована', en: 'The team is not formed yet' },
    'team_load_error': { ru: 'Не удалось загрузить команду.', en: 'Team could not be loaded.' },
    'team_neko_id': { ru: 'Neko ID →', en: 'Neko ID →' },
    'team_roster_label': { ru: 'Состав команды', en: 'Team roster' },

    /* ---------- Statuses ---------- */
    'status_in-development': { ru: 'В разработке', en: 'In Development' },
    'status_experimental': { ru: 'Экспериментальный', en: 'Experimental' },
    'status_completed': { ru: 'Завершён', en: 'Completed' },
    'status_released': { ru: 'Выпущен', en: 'Released' },
    'status_coming-soon': { ru: 'Скоро', en: 'Coming Soon' },
    'status_closed': { ru: 'Закрыт', en: 'Closed' },
    'status_unknown': { ru: 'Неизвестно', en: 'Unknown' },

    /* ---------- Shared states ---------- */
    'loading': { ru: 'Загрузка…', en: 'Loading…' },
    'loading_data': { ru: 'Читаем актуальные данные.', en: 'Reading the latest data.' },
    'error_title': { ru: 'Что-то пошло не так', en: 'Something went wrong' },
    'error_text': { ru: 'Не удалось загрузить данные. Попробуйте ещё раз.', en: 'Data could not be loaded. Please try again.' },
    'not_found': { ru: 'Не найдено', en: 'Not found' },
    'back': { ru: 'Назад', en: 'Back' },
    'play_browser': { ru: 'Играть в браузере', en: 'Play in browser' },

    /* ---------- Auth / account ---------- */
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
    'contact': { ru: 'Контакты', en: 'Contact' },
    'account': { ru: 'Аккаунт', en: 'Account' },
    'home': { ru: 'Главная', en: 'Home' },
    'projects': { ru: 'Проекты', en: 'Projects' },
    'about': { ru: 'О нас', en: 'About' },
    'news': { ru: 'Новости', en: 'News' },
    'team': { ru: 'Команда', en: 'Team' },
    'team_title_old': { ru: 'NekoStudios Team', en: 'NekoStudios Team' },
    'add_member': { ru: 'Добавить участника', en: 'Add member' },
    'select_user': { ru: 'Выберите пользователя', en: 'Select a user' },
    'team_role': { ru: 'Роль в команде', en: 'Team role' },
    'description': { ru: 'Описание', en: 'Description' },
    'sort_order': { ru: 'Порядок', en: 'Order' },
    'remove_member': { ru: 'Удалить участника', en: 'Remove member' },
    'cancel': { ru: 'Отмена', en: 'Cancel' },
    'reviews': { ru: 'Отзывы', en: 'Reviews' },
    'rating': { ru: 'Оценка', en: 'Rating' },
    'write_review': { ru: 'Написать отзыв', en: 'Write a review' },
    'edit_review': { ru: 'Изменить отзыв', en: 'Edit review' },
    'delete_review': { ru: 'Удалить отзыв', en: 'Delete review' },
    'submit': { ru: 'Отправить', en: 'Submit' },
    'no_reviews': { ru: 'Пока нет отзывов.', en: 'No reviews yet.' },
    'reviews_new': { ru: 'Сначала новые', en: 'Newest first' },
    'based_on': { ru: 'На основе', en: 'Based on' },
    'ratings': { ru: 'оценок', en: 'ratings' },
    'reviews_hidden': { ru: 'Скрыть отзыв', en: 'Hide review' },
    'reviews_show': { ru: 'Вернуть отзыв', en: 'Restore review' },
    'load_more': { ru: 'Загрузить ещё', en: 'Load more' },
    'login': { ru: 'Вход', en: 'Log in' },
    'login_eyebrow': { ru: 'С возвращением', en: 'Welcome back' },
    'login_support': { ru: 'Используйте имя пользователя или email и пароль.', en: 'Use your username or email and password.' },
    'username_or_email': { ru: 'Имя пользователя или email', en: 'Username or email' },
    'password': { ru: 'Пароль', en: 'Password' },
    'login_submit': { ru: 'Войти', en: 'Log in' },
    'new_here': { ru: 'Впервые здесь? Создать аккаунт', en: 'New here? Create an account' },
    'register_eyebrow': { ru: 'Присоединиться к студии', en: 'Join the studio' },
    'create_account': { ru: 'Создать аккаунт', en: 'Create account' },
    'register_support': { ru: 'Имя пользователя: 3–24 символа. Пароль: не менее 10 символов.', en: 'Username: 3–24 characters. Password: at least 10 characters.' },
    'username': { ru: 'Имя пользователя', en: 'Username' },
    'email': { ru: 'Email', en: 'Email' },
    'register_submit': { ru: 'Создать аккаунт', en: 'Create account' },
    'have_account': { ru: 'Уже есть аккаунт? Войти', en: 'Already have an account? Log in' },
    'not_logged_in': { ru: 'Вы не вошли', en: 'Not logged in' },
    'registered': { ru: 'Дата регистрации', en: 'Registered' },
    'neko_id': { ru: 'Neko ID', en: 'Neko ID' },
    'account_profile_support': { ru: 'Управление профилем и безопасностью аккаунта.', en: 'Manage your profile and account security.' },
    'display_name': { ru: 'Отображаемое имя', en: 'Display name' },
    'bio': { ru: 'Биография', en: 'Bio' },
    'wait': { ru: 'Подождите…', en: 'Please wait…' },
    'something_wrong': { ru: 'Что-то пошло не так.', en: 'Something went wrong.' },
    'account_info': { ru: 'Информация об аккаунте', en: 'Account information' },
    'login_to_view': { ru: 'Войдите, чтобы посмотреть профиль.', en: 'Log in to view your profile.' },
    'neko_id_settings': { ru: 'Настройки Neko ID', en: 'Neko ID settings' },
    'administrator': { ru: 'Администратор', en: 'Administrator' },
    'registration_failed': { ru: 'Не удалось зарегистрироваться.', en: 'Registration failed.' },
    'login_failed': { ru: 'Не удалось войти.', en: 'Login failed.' },
    'profile_load_error': { ru: 'Не удалось загрузить профиль.', en: 'Profile could not be loaded.' },

    /* ---------- Versions / public profile ---------- */
    'release': { ru: 'Релиз', en: 'Release' },
    'information': { ru: 'Информация', en: 'Information' },
    'release_notes': { ru: 'Заметки к релизу', en: 'Release notes' },
    'release_file': { ru: 'Файл релиза', en: 'Release file' },
    'version_not_found': { ru: 'Версия не найдена', en: 'Version not found' },
    'version_not_found_text': { ru: 'Эта версия не опубликована.', en: 'This version is not published.' },
    'version_missing': { ru: 'Версия не указана.', en: 'No version specified.' },
    'profile_not_found': { ru: 'Профиль не найден', en: 'Profile not found' },
    'profile_not_found_text': { ru: 'Этот профиль скрыт или не существует.', en: 'This profile is private or does not exist.' },
    'profile_missing': { ru: 'Neko ID не указан.', en: 'No Neko ID specified.' },
    'back_team': { ru: '← Команда', en: '← Team' },

    /* ---------- Admin (kept from the existing panel) ---------- */
    'team_title_admin': { ru: 'NekoStudios Team', en: 'NekoStudios Team' },
    'save_project': { ru: 'Сохранить проект', en: 'Save project' },
    'releases': { ru: 'Релизы', en: 'Releases' },
    'published': { ru: 'опубликован', en: 'published' },
    'hidden': { ru: 'скрыт', en: 'hidden' },
    'hide': { ru: 'Скрыть', en: 'Hide' },
    'publish': { ru: 'Опубликовать', en: 'Publish' },
    'release_notes_admin': { ru: 'Release notes', en: 'Release notes' },
    'file_url': { ru: 'URL файла', en: 'File URL' },
    'publish_now': { ru: 'Опубликовать сразу', en: 'Publish immediately' },
    'add_release': { ru: 'Добавить релиз', en: 'Add release' },
    'type': { ru: 'Тип', en: 'Type' },
    'text': { ru: 'Текст', en: 'Text' },
    'image_url': { ru: 'URL изображения', en: 'Image URL' },
    'project_id_optional': { ru: 'ID проекта (необязательно)', en: 'Project ID (optional)' },
    'create_post': { ru: 'Создать пост', en: 'Create post' },
    'date': { ru: 'Дата', en: 'Date' },
    'administrator': { ru: 'Администратор', en: 'Admin' },
    'target': { ru: 'Цель', en: 'Target' },
    'action': { ru: 'Действие', en: 'Action' },
    'details': { ru: 'Детали', en: 'Details' },
    'project': { ru: 'Проект', en: 'Project' },
    'title': { ru: 'Название', en: 'Title' },
    'short_description': { ru: 'Краткое описание', en: 'Short description' },
    'category': { ru: 'Категория', en: 'Category' },
    'icon_url': { ru: 'Иконка URL', en: 'Icon URL' },
    'cover_url': { ru: 'Обложка URL', en: 'Cover URL' },
    'website_url': { ru: 'Сайт URL', en: 'Website URL' },
    'repository_url': { ru: 'Репозиторий URL', en: 'Repository URL' },
    'published_flag': { ru: 'Опубликован', en: 'Published' },
    'accounts': { ru: 'Аккаунты', en: 'Accounts' },
    'posts': { ru: 'Посты', en: 'Posts' },
    'settings': { ru: 'Настройки сайта', en: 'Site settings' },
    'log': { ru: 'Журнал', en: 'Log' },
    'site_name': { ru: 'Название сайта', en: 'Site name' },
    'slogan': { ru: 'Слоган', en: 'Slogan' },
    'default_language': { ru: 'Язык по умолчанию', en: 'Default language' },
    'permissions': { ru: 'Разрешения', en: 'Permissions' },
    'project_access': { ru: 'Доступ к проектам (ID через запятую)', en: 'Project access (comma-separated IDs)' },
    'release_access': { ru: 'Доступ к релизам (ID через запятую)', en: 'Release access (comma-separated IDs)' },
    'account_active': { ru: 'Аккаунт активен', en: 'Account active' },
    'new_password_optional': { ru: 'Новый пароль (необязательно)', en: 'New password (optional)' },
    'back_accounts': { ru: '← Аккаунты', en: '← Accounts' },
    'role': { ru: 'Роль', en: 'Role' },
    'status': { ru: 'Статус', en: 'Status' },
    'search_username': { ru: 'Поиск по username', en: 'Search by username' }
  };

  /* Known content labels (project categories, tags, news categories, roles). */
  var contentMap = {
    'Game': { ru: 'Игра' },
    'Software / Experimental': { ru: 'Софт / Экспериментальное' },
    'Software / AI System': { ru: 'Софт / AI-система' },
    'Software': { ru: 'Софт' },
    'Project': { ru: 'Проект' },
    'Games': { ru: 'Игры' },
    'AI & Research': { ru: 'AI и исследования' },
    '2D': { ru: '2D' },
    'Mining': { ru: 'Добыча' },
    'Adventure': { ru: 'Приключение' },
    'Survival': { ru: 'Выживание' },
    'Strategy': { ru: 'Стратегия' },
    'CLI': { ru: 'CLI' },
    'Utility': { ru: 'Утилита' },
    'Experimental': { ru: 'Экспериментальный' },
    'Local-first': { ru: 'Local-first' },
    'AI': { ru: 'AI' },
    'Offline': { ru: 'Офлайн' },
    'Studio News': { ru: 'Новости студии' },
    'Game Updates': { ru: 'Обновления игр' },
    'All News': { ru: 'Все новости' },
    'Devlog': { ru: 'Devlog' },
    'Founder': { ru: 'Основатель' },
    'Co-founder': { ru: 'Соучредитель' },
    'Developer': { ru: 'Разработчик' },
    'Programmer': { ru: 'Программист' },
    'Artist': { ru: 'Художник' },
    'Composer': { ru: 'Композитор' },
    'Designer': { ru: 'Дизайнер' },
    'Writer': { ru: 'Сценарист' },
    'Community Manager': { ru: 'Комьюнити-менеджер' }
  };

  /* Existing project copy, translated without adding new claims. */
  var projectCopy = {
    'deep-mine': {
      ru: {
        description: 'Исследуйте подземные миры, находите ценные руды и развивайте своё горное приключение.',
        note: '2D-игра про добычу полезных ископаемых в разработке. Пробивайтесь сквозь пласты, находите ресурсы и улучшайте снаряжение.'
      },
      en: {
        description: 'Explore underground worlds, discover valuable ores and expand your mining adventure.',
        note: 'A 2D mining game currently in development. Dig through layers, discover resources and upgrade your equipment.'
      }
    },
    'after-zero': {
      ru: {
        description: 'Выживайте в мире после катастрофы, отстраивайте поселение и управляйте жизнью в постапокалиптической среде.',
        note: 'Постапокалиптическая игра на выживание и управление колонией.'
      },
      en: {
        description: 'Survive in a world shaped by catastrophe, rebuild a settlement and manage life in a post-apocalyptic environment.',
        note: 'A post-apocalyptic survival and colony management game.'
      }
    },
    'neko-ai': {
      ru: {
        description: 'Экспериментальная CLI-утилита, исследующая основы будущего персонального AI-ассистента.',
        note: 'Сейчас Neko AI — тестовая утилита. AI-функциональность ещё не реализована.'
      },
      en: {
        description: 'An experimental CLI utility exploring the foundations of a future personal AI assistant.',
        note: 'Neko AI is currently a test utility. Its AI functionality has not been implemented yet.'
      }
    },
    'neiron': {
      ru: {
        description: 'Новое поколение локального AI-софта, рассчитанного на работу офлайн и более глубокое взаимодействие с системой пользователя.',
        note: 'NEIRON разрабатывается с нуля как крупное переосмысление Neko AI. Продвинутые возможности — цели разработки, а не готовые функции.'
      },
      en: {
        description: "A new generation of local-first AI software, designed around offline operation and deeper interaction with the user's system.",
        note: 'NEIRON is being developed from scratch as a major reimagining of Neko AI. Advanced capabilities are development goals, not shipped features.'
      }
    }
  };

  var listeners = [];

  function readLang() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'ru' || saved === 'en') return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  var current = readLang();

  function t(key, vars) {
    var entry = translations[key];
    var text = entry ? (entry[current] || entry.ru || entry.en || key) : key;
    if (vars && typeof text === 'string') {
      text = text.replace(/\{(\w+)\}/g, function (all, name) {
        return vars[name] != null ? vars[name] : all;
      });
    }
    return text;
  }

  /* Translate a known content label; unknown labels are returned unchanged. */
  function content(value) {
    var entry = contentMap[value];
    if (!entry) return value;
    // Source labels in the data layer are English. Only the RU map overrides them.
    if (current === 'en') return entry.en || value;
    return entry.ru || entry.en || value;
  }

  /* Localized project description/note, falling back to the supplied source. */
  function projectText(id, field, fallback) {
    var entry = projectCopy[id] && projectCopy[id][current];
    return entry && entry[field] ? entry[field] : fallback;
  }

  function formatDate(value) {
    if (!value) return '';
    var date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    try {
      return new Intl.DateTimeFormat(current === 'ru' ? 'ru-RU' : 'en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      }).format(date);
    } catch (e) {
      return String(value);
    }
  }

  function translateElement(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.hasAttribute('data-i18n')) {
      node.innerHTML = t(node.getAttribute('data-i18n'));
    }
    if (node.hasAttribute('data-i18n-placeholder')) {
      node.setAttribute('placeholder', t(node.getAttribute('data-i18n-placeholder')));
    }
    if (node.hasAttribute('data-i18n-aria')) {
      node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria')));
    }
    if (node.hasAttribute('data-i18n-title')) {
      node.setAttribute('title', t(node.getAttribute('data-i18n-title')));
    }
  }

  function markSwitches() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function (button) {
      var active = button.getAttribute('data-lang') === current;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function apply(lang) {
    current = lang === 'en' ? 'en' : 'ru';
    try { window.localStorage.setItem(STORAGE_KEY, current); } catch (e) {}
    document.documentElement.setAttribute('lang', current);
    document.documentElement.setAttribute('data-lang', current);

    Array.prototype.forEach.call(
      document.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-aria], [data-i18n-title]'),
      translateElement
    );
    markSwitches();

    Array.prototype.forEach.call(listeners, function (listener) {
      try { listener(current); } catch (error) {
        if (window.console && console.error) console.error('[NekoStudios i18n] listener failed', error);
      }
    });

    if (typeof window.CustomEvent === 'function') {
      document.dispatchEvent(new window.CustomEvent('neko:langchange', { detail: { lang: current } }));
    }
  }

  function onChange(listener) {
    if (typeof listener === 'function') listeners.push(listener);
  }

  /* One delegated handler serves the header and footer switches. */
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-lang]');
    if (!button) return;
    var lang = button.getAttribute('data-lang');
    if (lang === current) return;
    apply(lang);
  });

  window.NekoI18n = {
    t: t,
    content: content,
    projectText: projectText,
    formatDate: formatDate,
    apply: apply,
    onChange: onChange,
    current: function () { return current; },
    defaultLang: DEFAULT_LANG
  };

  apply(current);
})();
