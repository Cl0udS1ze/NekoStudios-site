# Project reviews and ratings

`project.html` renders a rating summary and a reviews section for the current project.

## Data

D1 table `project_reviews` (`../nekostudios-worker/migrations/005_project_reviews.sql`):
`project_id + user_id` is unique, rating is constrained 1..5, indexes on project/user.
Author name comes from `users` via JOIN, so renaming a Neko ID keeps authorship.

## API

- `GET /api/projects/:slug/rating` — server-side average + count; includes `my_review` for signed-in users
- `GET /api/projects/:slug/reviews?sort=new|high|low&limit&offset` — paginated public list
- `POST /api/projects/:slug/reviews`, `PATCH /api/reviews/:id`, `DELETE /api/reviews/:id` — Neko ID required, own review only
- `GET /api/admin/reviews`, `PATCH /api/admin/reviews/:id`, `DELETE /api/admin/reviews/:id` — admin, `manage_reviews`

Only published reviews on published projects count toward the public rating.
Basic anti-spam: one review action per account per 30 seconds.
Admin moderation is written to `admin_log` without passwords or tokens.
