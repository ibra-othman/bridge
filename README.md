# BRIDGE

Know your skills. Find your gap.

BRIDGE is a web app that compares the skills a student has with the skills a target job role needs, then turns the difference into a learning order to follow. The app UI is available in English and Arabic.

## What the app does

Based on the code in this repo:

- **My skills:** pick the skills you have and set a level (Beginner, Intermediate, Advanced). Add, rename or delete your own custom skills.
- **Careers:** five built-in roles, each with required skills and minimum levels: Frontend Developer, Backend Developer, UI/UX Designer, Data Analyst, Software Tester. Custom tracks can also be built.
- **Gap analysis:** a match score for the chosen role and a list of what is missing.
- **Roadmap:** missing skills in learning order (prerequisites first), with links to official docs or free courses.
- **Track and quizzes:** tick items off, take skill quizzes, and watch the score rise.
- **Progress:** streaks and per-skill stats.
- **Portfolio:** print it, export to PDF, or share it by link.
- **Accounts and cloud sync:** register or log in, password reset by email, optional Google and GitHub sign-in.
- **Daily reminders:** web push notifications through a service worker (`sw.js`).
- **Admin page:** manage quiz questions and career tracks.
- **Guided tour**, light and dark themes, print styles and reduced-motion support.

The match score reflects coverage of the skills in BRIDGE's own dataset. It is not a guarantee of job readiness.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | App shell |
| `script.js` | Front-end logic, translations, careers data, quizzes, API calls |
| `style.css` | Styles |
| `sw.js` | Service worker for push reminders |
| `server.js` | Back end: Express server, SQLite database and the `/api/*` endpoints. Also serves static files from a `public` folder |
| `package.json` | Node.js project definition and dependencies |
| `.env.example` | Template of the environment variables the server reads (placeholders only) |

## Tech

- Front end: plain HTML, CSS and JavaScript (no framework).
- Back end (`server.js`): Node.js 18+, Express, SQLite (`sqlite3`), JWT, bcryptjs, Helmet, express-rate-limit, Nodemailer, web-push.
- Tests: Jest and Supertest.

## Back end

`server.js` exports `createApp()` (used by tests) and starts the server when run directly. What it does:

- **Database:** a SQLite file, `bridge.db` next to `server.js` by default (set `DB_FILE` to change it). Tables are created on start: users, settings, saved state, password resets, quiz questions, careers, shared portfolios and push subscriptions.
- **Auth:** register, login and password reset by email (`/api/register`, `/api/login`, `/api/forgot`, `/api/reset`, `/api/me`), with bcrypt password hashes and JWT tokens. Google and GitHub sign-in are available when their client ID and secret are set (`/auth/:provider`). The admin role goes to the account whose email matches `ADMIN_EMAIL`; on a fresh development database with no `ADMIN_EMAIL`, the first account is admin. If `JWT_SECRET` is not set, a random secret is generated once and kept in the database.
- **User data:** `GET` and `PUT /api/state` store each user's progress for cloud sync.
- **Quizzes and resources:** `/api/questions/:skill` and `/api/resources/:skill`. If the questions table is empty, the server imports starter questions from a `questions.json` file when one is present.
- **Careers:** `/api/careers` for the public list, plus admin endpoints to edit them.
- **Admin:** `/api/admin/*` endpoints to manage questions and careers. `/admin.html` redirects to `/#admin`.
- **Sharing:** `POST` and `DELETE /api/share` create or remove a public portfolio link, served at `/p/:slug`.
- **Push reminders:** `/api/push/key` and `/api/push/subscribe`. VAPID keys are generated once and stored in the database. A daily reminder goes out at `REMINDER_HOUR` (server time, default 18).
- **Security:** Helmet with a Content Security Policy, JSON body limit of 100 kb, and rate limits on the API and on auth and reset routes (`RATE_API`, `RATE_AUTH`, `RATE_RESET`).
- **Static files:** serves static files from a `public` folder next to `server.js` (the front end files in this repo sit in the root, so they need to be copied into `public/` for the server to serve them), and returns a JSON 404 for unknown `/api` routes.

## Configuration

Copy `.env.example` to `.env` and fill in your own values. `.env` and the SQLite database are git-ignored. The variables `server.js` reads are: `PORT`, `PUBLIC_URL`, `ALLOWED_ORIGIN`, `NODE_ENV`, `TRUST_PROXY`, `DB_FILE`, `JWT_SECRET`, `ADMIN_EMAIL`, `SMTP_URL`, `MAIL_FROM`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `YOUTUBE_API_KEY`, `VAPID_SUBJECT`, `REMINDER_HOUR`, `RATE_API`, `RATE_AUTH` and `RATE_RESET`.

## Run

```bash
npm install
npm start
```

The front end calls the server's `/api/*` endpoints. Opened directly from a file, it looks for the server at `http://localhost:3000`.
