# BRIDGE

Know your skills. Find your gap.

BRIDGE is a web app that compares the skills a student has with the skills a target job role needs, then turns the difference into a learning order to follow. The app UI is available in English and Arabic.

## What the app does

Based on the front-end code in this repo:

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
| `package.json` | Node.js project definition and dependencies |
| `.env.example` | Template of the environment variables the server reads (placeholders only) |

## Tech

- Front end: plain HTML, CSS and JavaScript (no framework).
- Back end (declared in `package.json`): Node.js 18+, Express, SQLite, JWT, bcryptjs, Helmet, express-rate-limit, Nodemailer, web-push.
- Tests: Jest and Supertest.

## Configuration

Copy `.env.example` to `.env` and fill in your own values (port, public URL, SMTP, optional Google and GitHub OAuth, optional YouTube API key, reminder hour). `.env` and the SQLite database are git-ignored.

## Run

```bash
npm install
npm start
```

The front end calls the server's `/api/*` endpoints. Opened directly from a file, it looks for the server at `http://localhost:3000`.

> Note: this repo currently holds the front end and project configuration. The server entry file (`server.js`) is not included yet.
