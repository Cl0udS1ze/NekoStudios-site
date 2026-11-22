/*
 * One data-access layer for every page. Pages call this, never local data
 * files or fetch directly. Local mode keeps the site working with no API.
 */
(function () {
  'use strict';

  var config = window.NekoConfig || {};
  var api = window.NekoApi;

  function log(message) {
    if (window.console && console.warn) console.warn('[NekoStudios data] ' + message);
  }

  function localSource(name) {
    var source = window[name];
    if (!source) throw new Error('Local data source is missing: ' + name);
    return source;
  }

  // Map a Worker envelope ({success, projects/news/...}) or a plain array to
  // the shape used by the local data files.
  function unwrap(payload, keys) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return null;
    for (var i = 0; i < keys.length; i++) {
      if (Array.isArray(payload[keys[i]])) return payload[keys[i]];
      if (payload[keys[i]] && typeof payload[keys[i]] === 'object') return payload[keys[i]];
    }
    return null;
  }

  function artFromSlug(slug) {
    var map = {
      'deep-mine': 'mine', 'after-zero': 'after',
      'neko-ai': 'neko-ai', 'neiron': 'neiron'
    };
    return map[slug] || 'studio';
  }

  function projectCategory(raw) {
    var value = String(raw || '').toLowerCase();
    if (value.indexOf('game') !== -1) return { label: 'Game', categories: ['Games'], filters: ['games'] };
    if (value.indexOf('ai') !== -1 || value.indexOf('software') !== -1) {
      return { label: 'Software / AI System', categories: ['Software', 'AI & Research'],
        filters: ['software', 'ai-research'] };
    }
    return { label: String(raw || 'Project'), categories: ['Software'], filters: ['software'] };
  }

  function normalizeStatus(raw) {
    var value = String(raw || '').toLowerCase().replace(/_/g, ' ');
    if (value.indexOf('experiment') !== -1) return 'experimental';
    if (value.indexOf('release') !== -1) return 'released';
    if (value.indexOf('complet') !== -1) return 'completed';
    if (value.indexOf('soon') !== -1) return 'coming-soon';
    if (value.indexOf('clos') !== -1) return 'closed';
    return 'in-development';
  }

  function mapProject(row) {
    if (!row) return null;
    var category = projectCategory(row.category);
    var slug = row.slug || String(row.id || '');
    return {
      id: slug,
      slug: slug,
      title: row.name || row.title || slug,
      categoryLabel: category.label,
      categories: category.categories,
      description: row.short_description || row.description || '',
      status: normalizeStatus(row.status),
      note: row.short_description ? (row.description || '') : '',
      tags: [],
      filters: category.filters,
      art: artFromSlug(slug)
    };
  }

  function newsCategory(raw) {
    var value = String(raw || '').toLowerCase();
    if (value.indexOf('studio') !== -1) return 'studio';
    if (value.indexOf('game') !== -1) return 'games';
    if (value.indexOf('devlog') !== -1 || value.indexOf('development') !== -1) return 'devlog';
    if (value.indexOf('software') !== -1 || value.indexOf('ai') !== -1) return 'software';
    return 'studio';
  }

  function contentToBlocks(content) {
    if (Array.isArray(content)) return content;
    if (!content) return [];
    var blocks = [];
    var lines = String(content).split(/\r?\n/);
    var list = null;
    lines.forEach(function (line) {
      var text = String(line).trim();
      if (!text) return;
      if (text.indexOf('### ') === 0) { blocks.push({ type: 'h3', text: text.slice(4) }); return; }
      if (text.indexOf('## ') === 0) { blocks.push({ type: 'h2', text: text.slice(3) }); return; }
      if (/^[-*]\s+/.test(text)) {
        if (!list) { list = { type: 'ul', items: [] }; blocks.push(list); }
        list.items.push(text.replace(/^[-*]\s+/, ''));
        return;
      }
      if (/^\d+[.)]\s+/.test(text)) {
        if (!list || list.type !== 'ol') { list = { type: 'ol', items: [] }; blocks.push(list); }
        list.items.push(text.replace(/^\d+[.)]\s+/, ''));
        return;
      }
      list = null;
      blocks.push({ type: 'p', text: text });
    });
    return blocks;
  }

  function mapNews(row) {
    if (!row) return null;
    var slug = row.slug || String(row.id || '');
    var projectSlug = row.project_slug || row.project_id || null;
    return {
      id: slug,
      slug: slug,
      title: row.title || slug,
      category: newsCategory(row.category),
      date: row.published_at || null,
      dateLabel: row.published_at ? '' : 'Demo / no date',
      excerpt: row.excerpt || '',
      cover: artFromSlug(projectSlug || slug),
      projectId: row.project_slug || (typeof projectSlug === 'string' ? projectSlug : null),
      status: 'published',
      demo: false,
      featured: false,
      body: contentToBlocks(row.content)
    };
  }

  function mapVersion(row) {
    return {
      id: row.id,
      label: row.release_name ? (row.version_number + ' — ' + row.release_name) : row.version_number,
      version: row.version_number,
      date: row.release_date || ''
    };
  }

  // API mode with no configured URL falls back to local data so the site
  // never breaks just because the switch was flipped early.
  function resolve(endpointName, params, localFn, mapper, keys) {
    if (config.dataMode === 'api') {
      if (!api || !api.isConfigured()) {
        log('API mode requested but API_BASE_URL is empty — using local data');
        return Promise.resolve().then(localFn);
      }
      var path;
      try {
        path = api.endpoint(endpointName, params);
      } catch (error) {
        return Promise.reject(error);
      }
      return api.get(path).then(function (payload) {
        if (payload && payload.success === false) {
          throw new Error(payload.error || 'API returned an error');
        }
        var value = unwrap(payload, keys || []);
        return mapper ? mapper(value) : value;
      }).catch(function (error) {
        // A missing record is a normal "not found", not a load failure.
        if (error && error.status === 404) return null;
        throw error;
      });
    }
    return Promise.resolve().then(localFn);
  }

  var repository = {
    getProjects: function () {
      return resolve('projects', {}, function () { return localSource('NekoData').getProjects(); },
        function (rows) { return (rows || []).map(mapProject); }, ['projects', 'items', 'data']);
    },
    getProject: function (id) {
      return resolve('project', { id: id }, function () { return localSource('NekoData').getProject(id); },
        mapProject, ['project', 'data']);
    },
    getPosts: function () {
      return resolve('news', {}, function () { return localSource('NekoNews').getPosts(); },
        function (rows) { return (rows || []).map(mapNews); }, ['news', 'items', 'data']);
    },
    getPost: function (slug) {
      return resolve('article', { slug: slug }, function () { return localSource('NekoNews').getPost(slug); },
        mapNews, ['article', 'post', 'data']);
    },
    getFeaturedPost: function () {
      return repository.getPosts().then(function (list) {
        return list.filter(function (p) { return p.featured; })[0] || list[0] || null;
      });
    },
    getPublishedVersions: function (projectId) {
      // A 404 means there are no published releases for this project.
      return resolve('versions', { id: projectId }, function () { return []; },
        function (rows) { return (rows || []).map(mapVersion); }, ['versions', 'items', 'data'])
        .then(function (rows) { return rows || []; });
    },
    getStatusMeta: function (key) { return localSource('NekoData').getStatusMeta(key); },
    categoryLabel: function (id) { return localSource('NekoNews').categoryLabel(id); }
  };

  window.NekoRepository = repository;
})();
