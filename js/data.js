/*
 * Single source of project data. The shape matches what a future API could
 * return, so replacing this source later does not require changing components.
 * No DB connection, secrets or network calls here.
 */
(function () {
  'use strict';

  // Status values are keys, not hardcoded labels in components.
  // `versions` follows the planned visibility rules for detail pages.
  var STATUSES = {
    'in-development': { label: 'In Development', className: 'status--dev', versions: false },
    'experimental':   { label: 'Experimental',   className: 'status--experimental', versions: true },
    'completed':      { label: 'Completed',      className: 'status--completed', versions: true },
    'released':       { label: 'Released',       className: 'status--released', versions: true },
    'coming-soon':    { label: 'Coming Soon',    className: 'status--soon', versions: false },
    'closed':         { label: 'Closed',         className: 'status--closed', versions: false }
  };

  var projects = [
    {
      id: 'deep-mine',
      title: 'DEEP MINE',
      categoryLabel: 'Game',
      categories: ['Games'],
      description: 'Explore underground worlds, discover valuable ores and expand your mining adventure.',
      status: 'in-development',
      note: 'A 2D mining game currently in development.',
      tags: ['2D', 'Mining', 'Adventure'],
      filters: ['games'],
      art: 'mine'
    },
    {
      id: 'after-zero',
      title: 'AFTER ZERO',
      categoryLabel: 'Game',
      categories: ['Games'],
      description: 'Survive in a world shaped by catastrophe, rebuild a settlement and manage life in a post-apocalyptic environment.',
      status: 'in-development',
      note: 'A post-apocalyptic survival and colony management game.',
      tags: ['2D', 'Survival', 'Strategy'],
      filters: ['games'],
      art: 'after'
    },
    {
      id: 'neko-ai',
      title: 'Neko AI',
      categoryLabel: 'Software / Experimental',
      categories: ['Software', 'AI & Research'],
      description: 'An experimental CLI utility exploring the foundations of a future personal AI assistant.',
      status: 'experimental',
      note: 'Neko AI is currently a test utility. Its AI functionality has not been implemented yet.',
      tags: ['CLI', 'Utility', 'Experimental'],
      filters: ['software', 'ai-research'],
      art: 'neko-ai'
    },
    {
      id: 'neiron',
      title: 'NEIRON',
      categoryLabel: 'Software / AI System',
      categories: ['Software', 'AI & Research'],
      description: "A new generation of local-first AI software, designed around offline operation and deeper interaction with the user's system.",
      status: 'in-development',
      note: 'NEIRON is being developed from scratch as a major reimagining of Neko AI. Advanced capabilities are development goals, not shipped features.',
      tags: ['Local-first', 'AI', 'Offline'],
      filters: ['software', 'ai-research'],
      art: 'neiron'
    }
  ];

  function copy(project) {
    return {
      id: project.id,
      title: project.title,
      categoryLabel: project.categoryLabel,
      categories: project.categories.slice(),
      description: project.description,
      status: project.status,
      note: project.note,
      tags: project.tags.slice(),
      filters: project.filters.slice(),
      art: project.art
    };
  }

  window.NekoData = {
    getStatusMeta: function (key) {
      return STATUSES[key] || { label: 'Unknown', className: 'status--dev', versions: false };
    },
    getStatusKeys: function () { return Object.keys(STATUSES); },
    getProjects: function () { return projects.map(copy); },
    getProject: function (id) {
      var found = projects.filter(function (p) { return p.id === id; })[0];
      return found ? copy(found) : null;
    }
  };
})();
