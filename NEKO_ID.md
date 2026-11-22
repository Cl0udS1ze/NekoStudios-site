# Neko ID

Profile settings, security and centralized account management.

## User page

`settings.html` (linked from `profile.html`) — own profile, interface, privacy and security.

## API

- `GET /api/account/profile`, `PATCH /api/account/profile`
- `POST /api/account/password`, `POST /api/account/sessions/revoke-others`
- `GET /api/users/:uuid` — public profile, 404 when private
- `GET /api/settings` — public site settings
- `GET|POST /api/admin/settings`, `GET /api/admin/log` — admin only

## D1

`../nekostudios-worker/migrations/003_neko_id.sql` adds profile fields to `users`,
an `admin_log` table and `site_settings.default_language`. Existing UUIDs and data are kept.

## Notes

- Passwords: PBKDF2-HMAC-SHA256, 100000 iterations (Cloudflare Workers cap), random salt.
- Password change keeps the current session and revokes the others.
- Admin changes are written to `admin_log` without passwords, hashes, cookies or tokens.
- RU/EN dictionary (`js/i18n.js`) covers the new Neko ID and admin screens. Full site localization is not done yet.
- Only the `dark-purple` theme exists; `theme` is stored and applied as `data-theme` but there is no alternative theme yet.
- Public site settings are applied to elements with `data-setting-key` (hero/footer slogan).
