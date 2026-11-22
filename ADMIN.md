# NekoStudios admin panel

`admin.html` — tabs: Информация, Аккаунты, Проекты, Посты. Visible only for accounts with `role = 'admin'`; every request is re-checked by the Worker.

## Roles and permissions

- `user` — regular account
- `tester` — can be granted access to specific projects/releases
- `admin` — admin panel access, with per-account permissions

Permissions: `manage_projects`, `manage_releases`, `manage_news`, `manage_devblogs`, `manage_users`, `manage_roles`.
An admin with an empty permission list keeps full access; an explicit list restricts them. The last admin cannot be demoted.

Tester access is stored in `tester_projects` and `tester_versions`. No public endpoint was changed: published projects/releases still work as before.

## D1 migration

`../nekostudios-worker/migrations/002_admin_roles.sql` adds `users.role`, `users.permissions`,
`news.post_type`, and the two tester-access tables. Existing data is preserved.

## Endpoints (all require session + admin role + permission)

- `GET /api/admin/stats`
- `GET /api/admin/users`, `GET|POST /api/admin/users/:id`
- `GET /api/admin/projects`, `GET|POST /api/admin/projects/:id`
- `GET|POST /api/admin/projects/:id/versions`, `POST /api/admin/versions/:id`
- `GET|POST /api/admin/posts`, `POST|DELETE /api/admin/posts/:id`

State-changing requests require an allowed `Origin`; SQL uses prepared statements; errors are generic.

## First administrator

There is no public promotion endpoint. Promote a verified account manually:

```sh
wrangler d1 execute nekostudios --remote --command \
  "UPDATE users SET role='admin', is_admin=1, permissions='' WHERE username='VERIFIED_USER'"
```
