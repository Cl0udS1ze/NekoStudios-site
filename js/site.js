/* Shared site chrome: one two-row header and one footer for every page. */
(function () {
  'use strict';

  function brand(href) {
    return '<a class="brand" href="' + href + '" aria-label="NekoStudios — home" data-i18n-aria="brand_home">' +
      '<img class="brand-logo" src="assets/logo.png" alt="">' +
      '<span class="brand-name">Neko<span>Studios</span></span></a>';
  }

  function langSwitch(modifier) {
    return '<div class="lang-switch' + (modifier ? ' ' + modifier : '') +
      '" role="group" aria-label="Language" data-i18n-aria="lang_label">' +
      '<button type="button" class="lang-switch__btn" data-lang="ru" aria-pressed="false">RU</button>' +
      '<button type="button" class="lang-switch__btn" data-lang="en" aria-pressed="false">EN</button>' +
      '</div>';
  }

  function header(options) {
    options = options || {};
    var base = options.base || '';
    window.NekoChrome.base = base || 'index.html';
    var home = base ? base + '#home' : '#home';
    var about = base ? base + '#about' : '#about';
    var projects = options.onProjects ? '#catalog' : (base ? 'projects.html' : '#projects');
    var active = options.active || 'home';

    function navClass(id) {
      return id === active ? ' class="is-active" aria-current="page"' : '';
    }

    return '' +
      '<header class="site-header" id="top">' +
        '<div class="header-main">' +
          '<div class="container header-inner">' +
            brand(base || '#home') +
            '<button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" ' +
              'aria-controls="site-nav" aria-label="Открыть меню" data-i18n-aria="menu_open">' +
              '<span></span><span></span><span></span>' +
            '</button>' +
            '<nav class="site-nav site-nav--primary" id="site-nav" aria-label="Main navigation" data-i18n-aria="nav_main">' +
              '<a href="' + home + '" data-nav="home" data-i18n="nav_home"' + navClass('home') + '>Главная</a>' +
              '<a href="' + projects + '" data-nav="projects" data-i18n="nav_projects"' + navClass('projects') + '>Проекты</a>' +
              '<a href="' + about + '" data-nav="about" data-i18n="nav_about"' + navClass('about') + '>О нас</a>' +
              '<a href="profile.html" data-i18n="nav_account"' + navClass('account') + '>Аккаунт</a>' +
            '</nav>' +
          '</div>' +
        '</div>' +
        '<div class="header-sub">' +
          '<div class="container header-sub-inner">' +
            '<nav class="site-nav site-nav--secondary" aria-label="Secondary navigation" data-i18n-aria="nav_secondary">' +
              '<a href="team.html" data-i18n="nav_team"' + navClass('team') + '>Команда</a>' +
              '<a href="news.html" data-i18n="nav_news"' + navClass('news') + '>Devlog</a>' +
            '</nav>' +
            langSwitch() +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function footer(options) {
    options = options || {};
    var base = options.base || '';
    var home = base ? base + '#home' : '#home';
    var about = base ? base + '#about' : '#about';
    var projects = options.onProjects ? 'projects.html' : (base ? 'projects.html' : '#projects');

    return '' +
      '<footer class="site-footer">' +
        '<div class="container footer-inner">' +
          '<div class="footer-brand">' + brand(base || '#home') +
            '<p data-i18n="footer_about">Независимая студия, создающая игры, программы и экспериментальные AI-системы.</p>' +
            '<p class="footer-slogan" data-i18n="site_slogan">Маленькая студия. Большие миры.</p>' +
          '</div>' +
          '<nav class="footer-nav" aria-label="Footer navigation" data-i18n-aria="nav_footer">' +
            '<span class="footer-label" data-i18n="footer_navigate">Навигация</span>' +
            '<a href="' + home + '" data-i18n="nav_home">Главная</a>' +
            '<a href="' + projects + '" data-i18n="nav_projects">Проекты</a>' +
            '<a href="news.html" data-i18n="footer_news">Новости / Devlog</a>' +
            '<a href="team.html" data-i18n="nav_team">Команда</a>' +
            '<a href="' + about + '" data-i18n="nav_about">О нас</a>' +
          '</nav>' +
          '<div class="footer-contact">' +
            '<span class="footer-label" data-i18n="footer_contact">Контакты</span>' +
            '<a class="footer-link" href="mailto:nekostudios.mail@gmail.com">Email: nekostudios.mail@gmail.com</a>' +
            '<a class="footer-link" href="https://t.me/NekoStudiosBugs" target="_blank" rel="noopener noreferrer" data-i18n="bug_reports">Сообщить об ошибке</a>' +
            '<a class="footer-link" href="https://t.me/NekosStudios" target="_blank" rel="noopener noreferrer" data-i18n="channel">Канал</a>' +
          '</div>' +
        '</div>' +
        '<div class="container footer-bottom">' +
          '<span>© <span id="year">2026</span> NekoStudios</span>' +
          '<span data-i18n="footer_role">Независимая игровая и программная студия</span>' +
          langSwitch('lang-switch--footer') +
        '</div>' +
      '</footer>';
  }

  function mount() {
    var slots = document.querySelectorAll('[data-site-header]');
    Array.prototype.forEach.call(slots, function (slot) {
      var active = slot.getAttribute('data-active') || 'home';
      var base = slot.getAttribute('data-base') || '';
      slot.outerHTML = header({ active: active, base: base, onProjects: active === 'projects' });
    });
    slots = document.querySelectorAll('[data-site-footer]');
    Array.prototype.forEach.call(slots, function (slot) {
      slot.outerHTML = footer({ base: slot.getAttribute('data-base') || '',
        onProjects: slot.getAttribute('data-active') === 'projects' });
    });
  }

  window.NekoChrome = { header: header, footer: footer, mount: mount, base: '' };
  mount();
})();
