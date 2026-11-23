# NekoStudios — website

Stage 1: responsive landing page for NekoStudios, an independent Game & Software Studio.

Projects section is data-driven (`js/data.js`) and includes games, software and AI-related projects with local category filters. No backend or database connection yet.

## Structure

```
NekoStudios/
├── index.html              Home page
├── projects.html           Projects catalog (filters + search)
├── project.html            Shared project detail template (?id=slug)
├── news.html               News / Devlog catalog (filters + search)
├── article.html            Shared article template (?slug=...)
├── css/
│   ├── tokens.css          Design tokens (colours, spacing, typography)
│   ├── base.css            Reset and shared defaults
│   ├── layout.css          Header, hero, sections, footer, responsive layout
│   ├── components.css      Buttons, brand, cards, CSS-generated artwork
│   ├── projects.css        Catalog, search and detail page styles
│   └── news.css            News list and article styles
├── js/
│   ├── site.js             Shared two-row header + footer for all pages
│   ├── i18n.js             Global RU/EN dictionary, storage and live switching
│   ├── config.js           Data mode + API base URL (no secrets)
│   ├── api.js              Single fetch wrapper with error handling
│   ├── repository.js       Data layer: projects, news, versions
│   ├── data.js             Local project + status data
│   ├── ui.js               Shared loading / error / empty / not-found panels
│   ├── components.js       Reusable markup (project card, status badge)
│   ├── main.js             Home page wiring (featured project, menu, filters)
│   ├── projects.js         Catalog filtering and search
│   ├── project.js          Detail page rendering by project id
│   ├── news-data.js        Central news publications (drafts/demo only)
│   ├── news-components.js  News cards and safe article body renderer
│   ├── news.js             News filtering and search
│   ├── article.js          Article rendering by slug
│   └── team.js             Public roster from /api/team
└── README.md
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
cd NekoStudios
python3 -m http.server 8000
# then open http://localhost:8000
```

No build step, dependencies, backend or database connection on this stage.

## Language and navigation

- Russian is the default language. The RU/EN switch in the header (and footer)
  stores the choice in `localStorage` under `neko_lang`; no account is needed.
- Static text uses `data-i18n` / `data-i18n-placeholder` / `data-i18n-aria`.
  Dynamic views subscribe with `NekoI18n.onChange()` and re-render on switch.
- The header has two rows: brand + main links, then Team / Devlog + RU/EN.
  On small screens the main links fold into the menu button.
- Content fields come from the API unchanged; known labels, project copy and
  dates are localized in `js/i18n.js` without inventing new claims.

## Switching to the future API

1. `js/config.js` already points to `https://nekostudios-api.cl0uds1ze.workers.dev`
   and `dataMode: 'api'`. Set `dataMode: 'local'` to use the bundled demo data.
2. The Worker must provide the endpoints listed in `config.endpoints` and return
   either a JSON array or `{ "items": [...] }`.
3. Pages do not change: they call `window.NekoRepository` methods only.
4. With an empty `API_BASE_URL`, API mode falls back to local data with a console
   warning, so the site still works.

Never put MySQL credentials, API tokens or database IDs in frontend files. The
Worker lives in the sibling folder `../nekostudios-worker/`. Account pages and
the PBKDF2 limitation are documented in `AUTH.md`; the admin panel in `ADMIN.md`.

## Notes for later stages

- Local data lives only in `js/data.js` (projects) and `js/news-data.js` (news).
- Versions have no local releases by design; the list is empty until the API returns data.
- The Worker, Hyperdrive binding and MySQL access are outside this frontend.
