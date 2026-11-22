/* Shared site chrome: one header and one footer for every page. */
(function () {
  'use strict';

  function brand() {
    return '<a class="brand" href="' + (window.NekoChrome.base || '#home') + '" aria-label="NekoStudios — home">' +
      '<img class="brand-logo" src="assets/logo.png" alt="">' +
      '<span class="brand-name">Neko<span>Studios</span></span></a>';
  }

  function header(options) {
    options = options || {};
    var base = options.base || '';
    window.NekoChrome.base = base || 'index.html';
    var home = base ? base + '#home' : '#home';
    var about = base ? base + '#about' : '#about';
    var projects = options.onProjects ? '#catalog' : (base ? 'projects.html' : '#projects');
    var active = options.active || 'home';

    function navClass(id) { return id === active ? ' class="is-active" aria-current="page"' : ''; }

    return '' +
      '<header class="site-header" id="top">' +
        '<div class="container header-inner">' +
          brand() +
          '<nav class="site-nav" id="site-nav" aria-label="Main navigation">' +
            '<a href="' + home + '" data-nav="home"' + navClass('home') + '>Главная</a>' +
            '<a href="' + projects + '" data-nav="projects"' + navClass('projects') + '>Проекты</a>' +
            '<a href="' + about + '" data-nav="about"' + navClass('about') + '>О нас</a>' +
            '<a href="profile.html"' + navClass('account') + '>Аккаунт</a>' +
          '</nav>' +
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
          '<div class="footer-brand">' + brand() +
            '<p>An independent studio creating games, software and experimental AI systems.</p>' +
            '<p class="footer-slogan" data-setting-key="site_slogan">Small studio. Big worlds.</p>' +
          '</div>' +
          '<nav class="footer-nav" aria-label="Footer navigation">' +
            '<span class="footer-label">Navigate</span>' +
            '<a href="' + home + '">Home</a>' +
            '<a href="' + projects + '">Projects</a>' +
            '<a href="news.html">News / Devlog</a>' +
            '<a href="team.html" data-i18n="team">Team</a>' +
            '<a href="' + about + '">About</a>' +
          '</nav>' +
          '<div class="footer-contact">' +
            '<span class="footer-label" data-i18n="contact">Contact</span>' +
            '<a class="footer-link" href="mailto:nekostudios.mail@gmail.com">Email: nekostudios.mail@gmail.com</a>' +
            '<a class="footer-link" href="https://t.me/NekoStudiosBugs" target="_blank" rel="noopener noreferrer" data-i18n="bug_reports">Bug Reports</a>' +
            '<a class="footer-link" href="https://t.me/NekosStudios" target="_blank" rel="noopener noreferrer" data-i18n="channel">Channel</a>' +
          '</div>' +
        '</div>' +
        '<div class="container footer-bottom">' +
          '<span>© <span id="year">2026</span> NekoStudios</span>' +
          '<span>Independent Game &amp; Software Studio</span>' +
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
