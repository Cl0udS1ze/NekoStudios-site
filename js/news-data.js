/*
 * Single source of News / Devlog publications.
 * Demo content only: drafts, no real dates, no official announcements.
 * The shape is API-ready: a future backend can return the same fields.
 */
(function () {
  'use strict';

  var CATEGORIES = [
    { id: 'all',      label: 'All News' },
    { id: 'studio',   label: 'Studio News' },
    { id: 'games',    label: 'Game Updates' },
    { id: 'software', label: 'Software' },
    { id: 'devlog',   label: 'Devlog' }
  ];

  var DEMO_NOTE = '==Demonstration material.== This publication is a draft created to test the news interface. It is not an official studio announcement.';

  var posts = [
    {
      id: 'post-001',
      slug: 'welcome-to-nekostudios',
      title: 'Welcome to NekoStudios',
      category: 'studio',
      date: null,
      dateLabel: 'Demo material',
      excerpt: 'A short introduction to the studio, its direction and the kind of projects we build.',
      cover: 'studio',
      projectId: null,
      status: 'draft',
      demo: true,
      featured: true,
      body: [
        { type: 'p', text: DEMO_NOTE },
        { type: 'p', text: 'NekoStudios is an independent game and software studio. We build games, software utilities and experimental technology — from small ideas to long-term projects.' },
        { type: 'h2', text: 'What we work on' },
        { type: 'ul', items: [
          'Original 2D games and interactive worlds',
          'Software tools and utilities',
          'Experimental AI-related systems and research'
        ] },
        { type: 'p', text: 'This section will collect studio news, project updates and development notes in one place.' }
      ]
    },
    {
      id: 'post-002',
      slug: 'deep-mine-development-update',
      title: 'DEEP MINE Development Update',
      category: 'games',
      date: null,
      dateLabel: 'Demo material',
      excerpt: 'A look at the current direction of DEEP MINE: mining, progression and the feel of digging deeper.',
      cover: 'mine',
      projectId: 'deep-mine',
      status: 'draft',
      demo: true,
      featured: false,
      body: [
        { type: 'p', text: DEMO_NOTE },
        { type: 'p', text: 'DEEP MINE is a 2D mining game in development. The current focus is exploration, resource discovery and equipment progression.' },
        { type: 'figure', art: 'mine', caption: 'Original CSS illustration — not a game screenshot.' },
        { type: 'h2', text: 'Current focus' },
        { type: 'ul', items: [
          'Digging and resource collection',
          'Backpack and pickaxe progression',
          'A dark, readable underground world'
        ] },
        { type: 'p', text: 'More details are available on the [DEEP MINE project page](project.html?id=deep-mine).' }
      ]
    },
    {
      id: 'post-003',
      slug: 'after-zero-post-apocalyptic-world',
      title: 'AFTER ZERO: Building a Post-Apocalyptic World',
      category: 'devlog',
      date: null,
      dateLabel: 'Demo material',
      excerpt: 'Notes on the survival and colony management systems being explored in AFTER ZERO.',
      cover: 'after',
      projectId: 'after-zero',
      status: 'draft',
      demo: true,
      featured: false,
      body: [
        { type: 'p', text: DEMO_NOTE },
        { type: 'p', text: 'AFTER ZERO is a post-apocalyptic survival and colony management game in development.' },
        { type: 'figure', art: 'after', caption: 'Original CSS illustration — not a game screenshot.' },
        { type: 'h2', text: 'Design notes' },
        { type: 'ol', items: [
          'Survival systems and daily decisions',
          'Settlement building and colonist needs',
          'A world shaped by a past catastrophe'
        ] },
        { type: 'p', text: 'See the [AFTER ZERO project page](project.html?id=after-zero) for the current description.' }
      ]
    },
    {
      id: 'post-004',
      slug: 'neko-ai-experimental-utility',
      title: 'Neko AI: Experimental Utility',
      category: 'software',
      date: null,
      dateLabel: 'Demo material',
      excerpt: 'An honest look at Neko AI as a test utility — and what is still unimplemented.',
      cover: 'neko-ai',
      projectId: 'neko-ai',
      status: 'draft',
      demo: true,
      featured: false,
      body: [
        { type: 'p', text: DEMO_NOTE },
        { type: 'p', text: 'Neko AI is an experimental CLI utility exploring the foundations of a future personal AI assistant. It is currently a test utility; its AI functionality has not been implemented yet.' },
        { type: 'h3', text: 'Scope' },
        { type: 'ul', items: [
          'Experimenting with local tooling',
          'Testing utility workflows',
          'No shipped intelligent assistant functionality yet'
        ] },
        { type: 'p', text: 'Project details: [Neko AI](project.html?id=neko-ai).' }
      ]
    },
    {
      id: 'post-005',
      slug: 'introducing-neiron',
      title: 'Introducing NEIRON',
      category: 'software',
      date: null,
      dateLabel: 'Demo material',
      excerpt: 'Why NEIRON is being built from scratch as a local-first AI system — and which ideas are still goals.',
      cover: 'neiron',
      projectId: 'neiron',
      status: 'draft',
      demo: true,
      featured: false,
      body: [
        { type: 'p', text: DEMO_NOTE },
        { type: 'p', text: 'NEIRON is a major reimagining of Neko AI, developed from scratch. It is designed around offline operation and deeper interaction with the user’s system.' },
        { type: 'figure', art: 'neiron', caption: 'Original CSS illustration — not a product screenshot.' },
        { type: 'h2', text: 'Development goals' },
        { type: 'ul', items: [
          'Local-first operation',
          'Offline-capable workflows',
          'Deeper local system interaction'
        ] },
        { type: 'p', text: 'These are goals in progress, not completed features. See the [NEIRON project page](project.html?id=neiron).' }
      ]
    }
  ];

  function copy(post) {
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      category: post.category,
      date: post.date,
      dateLabel: post.dateLabel,
      excerpt: post.excerpt,
      cover: post.cover,
      projectId: post.projectId,
      status: post.status,
      demo: post.demo,
      featured: post.featured,
      body: post.body.map(function (block) {
        var result = { type: block.type, text: block.text, art: block.art, caption: block.caption };
        if (block.items) result.items = block.items.slice();
        return result;
      })
    };
  }

  window.NekoNews = {
    getCategories: function () { return CATEGORIES.map(function (c) { return { id: c.id, label: c.label }; }); },
    getPosts: function () { return posts.map(copy); },
    getPost: function (slug) {
      var found = posts.filter(function (p) { return p.slug === slug; })[0];
      return found ? copy(found) : null;
    },
    getFeatured: function () {
      var found = posts.filter(function (p) { return p.featured; })[0];
      return found ? copy(found) : null;
    },
    categoryLabel: function (id) {
      var found = CATEGORIES.filter(function (c) { return c.id === id; })[0];
      return found ? found.label : 'News';
    }
  };
})();
