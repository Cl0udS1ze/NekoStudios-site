# NekoStudios accounts

## Frontend

- `login.html`, `register.html`, `profile.html` use the shared header/footer.
- Tokens are **never** stored in localStorage. Sessions live in HttpOnly/Secure/SameSite=None cookies set by the Worker.
- `js/auth.js` keeps the current user in memory and calls `/api/auth/me` on every page load.
- `js/api.js` sends `credentials: 'include'` for auth calls and surfaces only safe server messages.

## Endpoints

- `POST /api/auth/register` — username (3–24), email, password (min 10); `is_admin` is always 0.
- `POST /api/auth/login` — username or email + password; sets session cookie, updates `last_login`.
- `POST /api/auth/logout` — revokes the current session and clears the cookie.
- `GET /api/auth/me` — current user or 401.

CORS credentials require the site origin in `ALLOWED_ORIGINS` in `../nekostudios-worker/wrangler.toml`.
Localhost is allowed by default. No wildcard origin is used with credentials.

## Password hashing limitation

The requirement was PBKDF2-HMAC-SHA256 with 600000 iterations. Cloudflare Workers
caps PBKDF2 at **100000** iterations (both WebCrypto and `node:crypto`); a custom
600000-iteration loop takes ~12 s per request in V8 and is not viable in a Worker.
The implementation therefore uses the platform maximum of 100000 iterations with
a random 16-byte salt. This is a documented deviation, not a silent downgrade.

## First administrator

There is no public admin endpoint and no automatic admin on registration.
To promote one existing account, run a manual, approved D1 command, e.g.:

```sh
wrangler d1 execute nekostudios --remote --command \
  "UPDATE users SET is_admin=1 WHERE uuid='USER_UUID'"
```

Only do this for a verified account. Admin rights are always checked on the server from D1.
