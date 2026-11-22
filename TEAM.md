# NekoStudios Team

Public page `team.html` with a roster managed from the admin panel (Team tab).

## Data

D1 table `team_members` (`../nekostudios-worker/migrations/004_team.sql`) stores only
`user_id`, team role, description, sort order and timestamps. Username and display name
come from `users` via JOIN, so they update automatically. Removing from Team never deletes the Neko ID account.

## API

- `GET /api/team` — public roster (active accounts only, allowed fields)
- `GET /api/admin/team`, `GET /api/admin/team/users`, `POST /api/admin/team`,
  `PATCH /api/admin/team/:id`, `DELETE /api/admin/team/:id` — admin only, `manage_team` permission

Ordering: `sort_order ASC, created_at ASC, id ASC` (stable).
Admin actions are written to `admin_log` without secrets.
