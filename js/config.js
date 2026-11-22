/*
 * Central runtime configuration. No secrets, tokens or credentials here.
 * Production uses the deployed Worker. Set `dataMode: 'local'` for offline demo data.
 */
(function () {
  'use strict';

  window.NekoConfig = {
    // 'local' — existing JS data files; 'api' — Cloudflare Worker endpoints.
    dataMode: 'api',

    // Deployed Cloudflare Worker. Data mode stays 'local' until verified.
    API_BASE_URL: 'https://nekostudios-api.cl0uds1ze.workers.dev',

    requestTimeoutMs: 10000,

    // Admin panel paths are built from this single base.
    ADMIN_BASE_URL: '/api/admin',

    // Endpoint paths are relative to API_BASE_URL. Placeholders {id}/{slug}
    // are replaced by the repository.
    endpoints: {
      projects: '/api/projects',
      project: '/api/projects/{id}',
      news: '/api/news',
      article: '/api/news/{slug}',
      versions: '/api/projects/{id}/versions',
      authRegister: '/api/auth/register',
      authLogin: '/api/auth/login',
      authLogout: '/api/auth/logout',
      authMe: '/api/auth/me'
    }
  };
})();
