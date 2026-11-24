'use strict';

const express = require('express');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const webpush = require('web-push');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// ---------- small helpers ----------
const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');
const hashPw = pw => new Promise((ok, no) => bcrypt.hash(pw, 10, (e, h) => (e ? no(e) : ok(h))));
const checkPw = (pw, h) => new Promise((ok, no) => bcrypt.compare(pw, h, (e, r) => (e ? no(e) : ok(r))));
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const isStr = (v, min, max) => typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
const json = (s, fallback) => { try { return JSON.parse(s); } catch (e) { return fallback; } };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BUILT_IN_TRACKS = ['frontend', 'backend', 'uiux', 'data', 'tester'];   // ids used by script.js itself
const QTYPES = ['single', 'multi', 'order', 'code'];

function createApp(opts = {}) {
  const env = opts.env || process.env;
  const prod = env.NODE_ENV === 'production';
  const doFetch = opts.fetch || (typeof fetch === 'function' ? fetch : null);
  const app = express();

  app.disable('x-powered-by');
  if (env.TRUST_PROXY) app.set('trust proxy', /^\d+$/.test(env.TRUST_PROXY) ? Number(env.TRUST_PROXY) : env.TRUST_PROXY);
  else if (env.RENDER) app.set('trust proxy', 1);   // Render sits behind a proxy

  // ---------- database (sqlite3 wrapped in promises) ----------
  const raw = new sqlite3.Database(opts.dbFile || env.DB_FILE || path.join(__dirname, 'bridge.db'));
  raw.serialize();
  const db = {
    run: (sql, p = []) => new Promise((ok, no) => raw.run(sql, p, function (e) { e ? no(e) : ok({ changes: this.changes, lastID: this.lastID }); })),
    get: (sql, p = []) => new Promise((ok, no) => raw.get(sql, p, (e, r) => (e ? no(e) : ok(r)))),
    all: (sql, p = []) => new Promise((ok, no) => raw.all(sql, p, (e, r) => (e ? no(e) : ok(r)))),
    exec: sql => new Promise((ok, no) => raw.exec(sql, e => (e ? no(e) : ok()))),
    close: () => new Promise(ok => raw.close(() => ok()))
  };
  app.db = db;

  let SECRET = env.JWT_SECRET || '';
  let VAPID = null;

  async function setting(k, make) {
    const row = await db.get('SELECT v FROM settings WHERE k = ?', [k]);
    if (row) return row.v;
    const v = make();
    await db.run('INSERT OR IGNORE INTO settings (k, v) VALUES (?, ?)', [k, v]);
    return v;
  }

  async function importStarterQuestions() {
    const { n } = await db.get('SELECT COUNT(*) AS n FROM questions');
    if (n > 0) return;
    let list = [];
    try { list = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8')); } catch (e) { return; }
    for (const q of list) {
      const v = validateQuestion(q);
      if (v.error) continue;
      await db.run('INSERT INTO questions (skill, t, q, o, a, code, active, created) VALUES (?,?,?,?,?,?,1,?)',
        [v.q.skill, v.q.t, v.q.q, JSON.stringify(v.q.o), JSON.stringify(v.q.a), v.q.code, Date.now()]);
    }
  }

  const ready = (async () => {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user');
      CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS states (user_id INTEGER PRIMARY KEY, data TEXT NOT NULL, updated INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS resets (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, hash TEXT NOT NULL, expires INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, skill TEXT NOT NULL, t TEXT NOT NULL, q TEXT NOT NULL, o TEXT NOT NULL DEFAULT '[]', a TEXT NOT NULL DEFAULT '[]', code TEXT NOT NULL DEFAULT '', active INTEGER NOT NULL DEFAULT 1, created INTEGER NOT NULL DEFAULT 0);
      CREATE INDEX IF NOT EXISTS idx_questions_skill ON questions (skill);
      CREATE TABLE IF NOT EXISTS careers (id TEXT PRIMARY KEY, title_en TEXT NOT NULL, title_ar TEXT NOT NULL DEFAULT '', skills TEXT NOT NULL, projects TEXT NOT NULL DEFAULT '[]', active INTEGER NOT NULL DEFAULT 1, updated INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS shares (user_id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, snapshot TEXT NOT NULL, created INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS push_subs (endpoint TEXT PRIMARY KEY, user_id INTEGER NOT NULL, sub TEXT NOT NULL);
    `);
    // the secret is never in the code: from JWT_SECRET, or random once and kept in the database
    if (!SECRET) SECRET = await setting('jwt_secret', () => crypto.randomBytes(48).toString('hex'));
    const keys = json(await setting('vapid', () => JSON.stringify(webpush.generateVAPIDKeys())), null);
    VAPID = keys;
    await importStarterQuestions();
  })();
  app.ready = ready;
  ready.catch(e => { if (e.code !== 'SQLITE_MISUSE') console.error('Startup failed:', e); });

  // ---------- mail ----------
  let mailer = opts.mailer;
  const mailConfigured = !!(mailer || env.SMTP_URL);
  if (!mailer) {
    if (env.SMTP_URL) {
      const transport = nodemailer.createTransport(env.SMTP_URL);
      mailer = { send: m => transport.sendMail({ from: env.MAIL_FROM || 'BRIDGE <no-reply@localhost>', ...m }) };
    } else mailer = { send: async m => console.log(`[mail not configured] to ${m.to}\n${m.text}`) };
  }

  const publicBase = req => (env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');

  // ---------- security: Helmet + CSP ----------
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        'default-src': ["'self'"],
        // the app uses inline onclick handlers, so inline scripts must be allowed (see README, known limit)
        'script-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
        'script-src-attr': ["'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': ["'self'", 'data:', 'blob:'],
        'connect-src': ["'self'"],
        'worker-src': ["'self'"],
        'manifest-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        ...(prod ? { 'upgrade-insecure-requests': [] } : {})
      }
    },
    hsts: prod
  }));

  // ---------- CORS: open in development, locked to ALLOWED_ORIGIN in production ----------
  app.use('/api', (req, res, next) => {
    const allow = prod ? env.ALLOWED_ORIGIN : '*';
    if (allow) {
      res.set('Access-Control-Allow-Origin', allow);
      res.set('Vary', 'Origin');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // ---------- rate limits ----------
  const limiter = (max, minutes) => rateLimit({
    windowMs: minutes * 60 * 1000, limit: Number(max), standardHeaders: true, legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' }
  });
  app.use('/api', limiter(env.RATE_API || 300, 15));
  const authLimit = limiter(env.RATE_AUTH || 20, 15);
  const forgotLimit = limiter(env.RATE_RESET || 5, 60);
  const resetLimit = limiter(env.RATE_RESET || 5, 60);

  // ---------- CSRF rule + body parsing ----------
  // The API reads a Bearer token from a header (never cookies) and accepts only JSON bodies,
  // so a form posted from another site cannot act for a logged-in user.
  app.use('/api', (req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.headers['content-type'] && !req.is('json'))
      return res.status(415).json({ error: 'Only JSON requests are accepted.' });
    next();
  });
  app.use(express.json({ limit: '100kb' }));
  app.use((req, res, next) => ready.then(() => next(), next));   // wait for the database to be ready

  // ---------- auth helpers ----------
  const publicUser = u => ({ id: u.id, email: u.email, name: u.name, role: u.role });
  const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

  async function promoteIfAdmin(u) {
    if (env.ADMIN_EMAIL && u.email === env.ADMIN_EMAIL.trim().toLowerCase() && u.role !== 'admin') {
      await db.run("UPDATE users SET role = 'admin' WHERE id = ?", [u.id]);
      u.role = 'admin';
    }
    return u;
  }
  const signToken = u => jwt.sign({ id: u.id }, SECRET, { expiresIn: '30d' });

  async function createUser(email, name, password) {
    const { n } = await db.get('SELECT COUNT(*) AS n FROM users');
    const first = n === 0 && !prod && !env.ADMIN_EMAIL;           // first account is admin on a fresh dev database
    const hash = await hashPw(password);
    const r = await db.run('INSERT INTO users (email, name, hash, role) VALUES (?, ?, ?, ?)', [email, name, hash, first ? 'admin' : 'user']);
    return promoteIfAdmin({ id: r.lastID, email, name, role: first ? 'admin' : 'user' });
  }

  const auth = wrap(async (req, res, next) => {
    const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
    if (!m) return res.status(401).json({ error: 'Please log in.' });
    let payload;
    try { payload = jwt.verify(m[1], SECRET); } catch (e) { return res.status(401).json({ error: 'Session expired. Please log in again.' }); }
    const u = await db.get('SELECT id, email, name, role FROM users WHERE id = ?', [payload.id]);
    if (!u) return res.status(401).json({ error: 'Account not found.' });
    req.user = u;
    next();
  });
  const admin = [auth, (req, res, next) => (req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Admins only.' }))];

  // ---------- accounts ----------
  app.post('/api/register', authLimit, wrap(async (req, res) => {
    const b = req.body || {};
    const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
    if (!EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (typeof b.password !== 'string' || b.password.length < 8 || b.password.length > 128) return res.status(400).json({ error: 'Password must be 8 to 128 characters.' });
    const name = (typeof b.name === 'string' && b.name.trim() ? b.name.trim() : email.split('@')[0]).slice(0, 40);
    if (await db.get('SELECT id FROM users WHERE lower(email) = ?', [email])) return res.status(409).json({ error: 'This email is already registered.' });
    let u;
    try { u = await createUser(email, name, b.password); }
    catch (e) { if (/CONSTRAINT/.test(String(e.code || e.message))) return res.status(409).json({ error: 'This email is already registered.' }); throw e; }
    res.json({ token: signToken(u), user: publicUser(u) });
  }));

  app.post('/api/login', authLimit, wrap(async (req, res) => {
    const b = req.body || {};
    const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
    const u = await db.get('SELECT * FROM users WHERE lower(email) = ?', [email]);
    const ok = await checkPw(typeof b.password === 'string' ? b.password : '', u ? u.hash : DUMMY_HASH);   // same work for unknown emails
    if (!u || !ok) return res.status(401).json({ error: 'Wrong email or password.' });
    await promoteIfAdmin(u);
    res.json({ token: signToken(u), user: publicUser(u) });
  }));

  app.get('/api/me', auth, (req, res) => res.json(publicUser(req.user)));

  // ---------- password reset ----------
  app.post('/api/forgot', forgotLimit, wrap(async (req, res) => {
    const email = typeof (req.body || {}).email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const out = { ok: true };
    const u = EMAIL_RE.test(email) ? await db.get('SELECT id, email FROM users WHERE lower(email) = ?', [email]) : null;
    if (u) {
      const token = crypto.randomBytes(32).toString('hex');
      await db.run('INSERT INTO resets (user_id, hash, expires) VALUES (?, ?, ?)', [u.id, sha256(token), Date.now() + 3600 * 1000]);   // only the hash is stored
      const link = `${publicBase(req)}/?reset=${token}`;
      try {
        await mailer.send({ to: u.email, subject: 'BRIDGE: reset your password', text: `Open this link within one hour to choose a new password:\n\n${link}\n\nIf you did not ask for this, ignore this email.` });
      } catch (e) { console.error('Mail failed:', e.message); }
      if (!mailConfigured && !prod) { console.log('Reset link (dev):', link); out.devLink = link; }
    }
    res.json(out);   // same answer for known and unknown emails
  }));

  app.post('/api/reset', resetLimit, wrap(async (req, res) => {
    const b = req.body || {};
    if (typeof b.password !== 'string' || b.password.length < 8 || b.password.length > 128) return res.status(400).json({ error: 'Password must be 8 to 128 characters.' });
    const bad = () => res.status(400).json({ error: 'This reset link is invalid or has expired.' });
    if (typeof b.token !== 'string' || !/^[a-f0-9]{64}$/.test(b.token)) return bad();
    const h = sha256(b.token);
    const row = await db.get('SELECT id, user_id FROM resets WHERE hash = ? AND used = 0 AND expires > ?', [h, Date.now()]);
    if (!row) return bad();
    const claim = await db.run('UPDATE resets SET used = 1 WHERE id = ? AND used = 0', [row.id]);   // single use, even with two clicks at once
    if (!claim.changes) return bad();
    await db.run('UPDATE users SET hash = ? WHERE id = ?', [await hashPw(b.password), row.user_id]);
    await db.run('DELETE FROM resets WHERE user_id = ?', [row.user_id]);
    res.json({ ok: true });
  }));

  // ---------- Google / GitHub sign-in ----------
  const PROVIDERS = {
    google: { id: env.GOOGLE_CLIENT_ID, secret: env.GOOGLE_CLIENT_SECRET },
    github: { id: env.GITHUB_CLIENT_ID, secret: env.GITHUB_CLIENT_SECRET }
  };
  const configured = p => !!(PROVIDERS[p] && PROVIDERS[p].id && PROVIDERS[p].secret);
  const oauthStates = new Map();   // one-time `state` values: state -> { provider, expires }

  app.get('/api/auth/providers', (req, res) => res.json(Object.keys(PROVIDERS).filter(configured)));

  app.get('/auth/:provider', (req, res) => {
    const p = req.params.provider;
    if (!configured(p)) return res.status(404).send('Provider not configured.');
    for (const [k, v] of oauthStates) if (v.expires < Date.now()) oauthStates.delete(k);
    const state = crypto.randomBytes(16).toString('hex');
    oauthStates.set(state, { provider: p, expires: Date.now() + 10 * 60 * 1000 });
    const redirect = encodeURIComponent(`${publicBase(req)}/auth/${p}/callback`);
    const url = p === 'google'
      ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(PROVIDERS.google.id)}&redirect_uri=${redirect}&response_type=code&scope=${encodeURIComponent('openid email profile')}&state=${state}`
      : `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(PROVIDERS.github.id)}&redirect_uri=${redirect}&scope=${encodeURIComponent('read:user user:email')}&state=${state}`;
    res.redirect(url);
  });

  async function oauthProfile(p, code, redirectUri) {
    const form = o => new URLSearchParams(o).toString();
    if (p === 'google') {
      const t = await (await doFetch('https://oauth2.googleapis.com/token', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form({ code, client_id: PROVIDERS.google.id, client_secret: PROVIDERS.google.secret, redirect_uri: redirectUri, grant_type: 'authorization_code' })
      })).json();
      if (!t.access_token) throw new Error('no token');
      const u = await (await doFetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: 'Bearer ' + t.access_token } })).json();
      if (!u.email || !u.email_verified) throw new Error('unverified email');
      return { email: u.email, name: u.name };
    }
    const t = await (await doFetch('https://github.com/login/oauth/access_token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: form({ code, client_id: PROVIDERS.github.id, client_secret: PROVIDERS.github.secret, redirect_uri: redirectUri })
    })).json();
    if (!t.access_token) throw new Error('no token');
    const h = { Authorization: 'Bearer ' + t.access_token, Accept: 'application/vnd.github+json', 'User-Agent': 'bridge-app' };
    const u = await (await doFetch('https://api.github.com/user', { headers: h })).json();
    const emails = await (await doFetch('https://api.github.com/user/emails', { headers: h })).json();
    const e = Array.isArray(emails) && emails.find(x => x.primary && x.verified);
    if (!e) throw new Error('no verified email');
    return { email: e.email, name: u.name || u.login };
  }

  app.get('/auth/:provider/callback', wrap(async (req, res) => {
    const p = req.params.provider, state = String(req.query.state || ''), code = String(req.query.code || '');
    const st = oauthStates.get(state);
    oauthStates.delete(state);                                    // one time only
    if (!configured(p) || !st || st.provider !== p || st.expires < Date.now() || !code) return res.status(400).send('Invalid or expired sign-in request. Please try again.');
    let prof;
    try { prof = await oauthProfile(p, code, `${publicBase(req)}/auth/${p}/callback`); }
    catch (e) { return res.status(502).send('Sign-in with ' + p + ' failed. Please try again.'); }
    const email = String(prof.email).trim().toLowerCase();
    let u = await db.get('SELECT * FROM users WHERE lower(email) = ?', [email]);
    if (!u) u = await createUser(email, String(prof.name || email.split('@')[0]).slice(0, 40), crypto.randomBytes(24).toString('hex'));
    else await promoteIfAdmin(u);
    res.redirect(`${env.PUBLIC_URL ? env.PUBLIC_URL.replace(/\/+$/, '') : ''}/#auth=${signToken(u)}`);
  }));

  // ---------- cloud copy of progress ----------
  app.get('/api/state', auth, wrap(async (req, res) => {
    const r = await db.get('SELECT data, updated FROM states WHERE user_id = ?', [req.user.id]);
    res.json(r ? { data: json(r.data, null), updated: r.updated } : { data: null, updated: 0 });
  }));
  app.put('/api/state', auth, wrap(async (req, res) => {
    const { data, updated } = req.body || {};
    if (!data || typeof data !== 'object' || Array.isArray(data)) return res.status(400).json({ error: 'Invalid data.' });
    const when = Number.isFinite(updated) ? updated : Date.now();
    await db.run('INSERT INTO states (user_id, data, updated) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated = excluded.updated', [req.user.id, JSON.stringify(data), when]);
    res.json({ ok: true });
  }));

  // ---------- questions ----------
  function validateQuestion(b) {
    const err = error => ({ error });
    if (!b || typeof b !== 'object') return err('Invalid question.');
    if (!isStr(b.skill, 1, 60)) return err('Skill name is required (up to 60 characters).');
    if (!QTYPES.includes(b.t)) return err('Unknown question type.');
    if (!isStr(b.q, 1, 500)) return err('Question text is required (up to 500 characters).');
    const q = { skill: b.skill.trim(), t: b.t, q: b.q.trim(), o: [], a: [], code: '' };
    const lines = (arr, min, max) => Array.isArray(arr) && arr.length >= min && arr.length <= max && arr.every(x => isStr(x, 1, 200)) ? arr.map(x => x.trim()) : null;
    if (b.t === 'single' || b.t === 'multi') {
      q.o = lines(b.o, 2, 8);
      if (!q.o) return err('Give 2 to 8 options.');
      const a = Array.isArray(b.a) ? [...new Set(b.a)] : [];
      if (!a.length || !a.every(i => Number.isInteger(i) && i >= 0 && i < q.o.length)) return err('Pick the correct answer(s) from the options.');
      if (b.t === 'single' && a.length !== 1) return err('A single-choice question has exactly one correct answer.');
      q.a = a.sort((x, y) => x - y);
    } else if (b.t === 'order') {
      q.o = lines(b.o, 2, 8);
      if (!q.o) return err('Give 2 to 8 steps in the correct order.');
    } else {
      if (!isStr(b.code, 1, 1000)) return err('The code to fix is required.');
      q.code = b.code.trim();
      q.a = lines(b.a, 1, 10);
      if (!q.a) return err('Give at least one accepted answer.');
    }
    return { q };
  }
  const rowToAdmin = r => ({ id: r.id, skill: r.skill, t: r.t, q: r.q, o: json(r.o, []), a: json(r.a, []), code: r.code, active: !!r.active });

  app.get('/api/questions/:skill', wrap(async (req, res) => {
    const rows = await db.all('SELECT * FROM questions WHERE skill = ? AND active = 1 ORDER BY id', [req.params.skill]);
    res.json(rows.map(r => {
      const o = json(r.o, []), a = json(r.a, []);
      if (r.t === 'single') return { t: 'single', q: r.q, o, a: o[a[0]] };    // students get the answer as text
      if (r.t === 'multi') return { t: 'multi', q: r.q, o, a };
      if (r.t === 'order') return { t: 'order', q: r.q, o };
      return { t: 'code', q: r.q, code: r.code, a };
    }));
  }));

  app.get('/api/admin/skills', admin, wrap(async (req, res) => {
    res.json(await db.all('SELECT skill, COUNT(*) AS n FROM questions GROUP BY skill ORDER BY skill'));
  }));
  app.get('/api/admin/questions', admin, wrap(async (req, res) => {
    const skill = typeof req.query.skill === 'string' && req.query.skill ? req.query.skill : null;
    const rows = skill ? await db.all('SELECT * FROM questions WHERE skill = ? ORDER BY id', [skill]) : await db.all('SELECT * FROM questions ORDER BY skill, id');
    res.json(rows.map(rowToAdmin));
  }));
  app.post('/api/admin/questions', admin, wrap(async (req, res) => {
    const v = validateQuestion(req.body);
    if (v.error) return res.status(400).json({ error: v.error });
    const active = (req.body || {}).active === false ? 0 : 1;
    const r = await db.run('INSERT INTO questions (skill, t, q, o, a, code, active, created) VALUES (?,?,?,?,?,?,?,?)',
      [v.q.skill, v.q.t, v.q.q, JSON.stringify(v.q.o), JSON.stringify(v.q.a), v.q.code, active, Date.now()]);
    res.status(201).json({ id: r.lastID });
  }));
  app.put('/api/admin/questions/:id', admin, wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || !(await db.get('SELECT id FROM questions WHERE id = ?', [id]))) return res.status(404).json({ error: 'Question not found.' });
    const v = validateQuestion(req.body);
    if (v.error) return res.status(400).json({ error: v.error });
    const active = (req.body || {}).active === false ? 0 : 1;
    await db.run('UPDATE questions SET skill=?, t=?, q=?, o=?, a=?, code=?, active=? WHERE id=?',
      [v.q.skill, v.q.t, v.q.q, JSON.stringify(v.q.o), JSON.stringify(v.q.a), v.q.code, active, id]);
    res.json({ ok: true, id });
  }));
  app.delete('/api/admin/questions/:id', admin, wrap(async (req, res) => {
    const r = await db.run('DELETE FROM questions WHERE id = ?', [Number(req.params.id)]);
    if (!r.changes) return res.status(404).json({ error: 'Question not found.' });
    res.json({ ok: true });
  }));

  // ---------- career tracks ----------
  const careerOut = r => ({ id: r.id, title: { en: r.title_en, ar: r.title_ar }, skills: json(r.skills, []), projects: json(r.projects, []), active: !!r.active });

  app.get('/api/careers', wrap(async (req, res) => {
    const rows = await db.all('SELECT * FROM careers WHERE active = 1 ORDER BY updated, id');
    res.json(rows.map(r => { const c = careerOut(r); return { id: c.id, title: { en: c.title.en, ar: c.title.ar || c.title.en }, skills: c.skills, projects: c.projects }; }));
  }));
  app.get('/api/admin/careers', admin, wrap(async (req, res) => {
    res.json((await db.all('SELECT * FROM careers ORDER BY updated, id')).map(careerOut));
  }));
  app.put('/api/admin/careers', admin, wrap(async (req, res) => {
    const b = req.body || {};
    const bad = error => res.status(400).json({ error });
    if (typeof b.id !== 'string' || !/^[a-z0-9][a-z0-9-]{1,29}$/.test(b.id)) return bad('Track id: 2 to 30 characters, lowercase letters, digits and dashes.');
    if (BUILT_IN_TRACKS.includes(b.id) || b.id.startsWith('u-')) return bad('This id is reserved. Choose another one.');
    const t = b.title || {};
    if (!isStr(t.en, 1, 60)) return bad('English title is required (up to 60 characters).');
    if (t.ar != null && t.ar !== '' && !isStr(t.ar, 1, 60)) return bad('Arabic title is too long.');
    if (!Array.isArray(b.skills) || b.skills.length < 2 || b.skills.length > 15) return bad('A track needs 2 to 15 skills.');
    const seen = new Set(), skills = [];
    for (const s of b.skills) {
      if (!Array.isArray(s) || !isStr(s[0], 1, 40) || !Number.isInteger(s[1]) || s[1] < 1 || s[1] > 3) return bad('Each skill needs a name and a level from 1 to 3.');
      const name = s[0].trim();
      if (seen.has(name.toLowerCase())) return bad('Duplicate skill: ' + name);
      seen.add(name.toLowerCase());
      skills.push([name, s[1]]);
    }
    const projects = (Array.isArray(b.projects) ? b.projects : []).filter(p => typeof p === 'string' && p.length <= 400 && p.split('|').length === 3 && p.split('|').every(x => x.trim())).map(p => p.split('|').map(x => x.trim()).join('|')).slice(0, 10);
    const active = b.active === false ? 0 : 1;
    await db.run(`INSERT INTO careers (id, title_en, title_ar, skills, projects, active, updated) VALUES (?,?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET title_en=excluded.title_en, title_ar=excluded.title_ar, skills=excluded.skills, projects=excluded.projects, active=excluded.active, updated=excluded.updated`,
      [b.id, t.en.trim(), (t.ar || '').trim(), JSON.stringify(skills), JSON.stringify(projects), active, Date.now()]);
    res.json(careerOut(await db.get('SELECT * FROM careers WHERE id = ?', [b.id])));
  }));
  app.delete('/api/admin/careers/:id', admin, wrap(async (req, res) => {
    const r = await db.run('DELETE FROM careers WHERE id = ?', [req.params.id]);
    if (!r.changes) return res.status(404).json({ error: 'Track not found.' });
    res.json({ ok: true });
  }));

  // ---------- public portfolio ----------
  app.post('/api/share', auth, wrap(async (req, res) => {
    const snap = (req.body || {}).snapshot;
    if (!snap || typeof snap !== 'object' || Array.isArray(snap)) return res.status(400).json({ error: 'Invalid portfolio.' });
    const text = JSON.stringify(snap);
    if (text.length > 60000) return res.status(413).json({ error: 'Portfolio is too large.' });
    const old = await db.get('SELECT slug FROM shares WHERE user_id = ?', [req.user.id]);
    const slug = old ? old.slug : crypto.randomBytes(8).toString('hex');
    await db.run('INSERT INTO shares (user_id, slug, snapshot, created) VALUES (?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET snapshot = excluded.snapshot, created = excluded.created', [req.user.id, slug, text, Date.now()]);
    res.json({ url: `${publicBase(req)}/p/${slug}` });
  }));
  app.delete('/api/share', auth, wrap(async (req, res) => {
    await db.run('DELETE FROM shares WHERE user_id = ?', [req.user.id]);
    res.json({ ok: true });
  }));

  app.get('/p/:slug', wrap(async (req, res) => {
    const row = /^[a-f0-9]{16}$/.test(req.params.slug) ? await db.get('SELECT snapshot FROM shares WHERE slug = ?', [req.params.slug]) : null;
    res.set('X-Robots-Tag', 'noindex, nofollow');
    if (!row) return res.status(404).type('html').send('<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Not found</title><p style="font-family:sans-serif;padding:40px">This portfolio is not available.</p>');
    const s = json(row.snapshot, {});
    const skills = (Array.isArray(s.skills) ? s.skills : []).slice(0, 30).map(k => `<li><b>${esc(k && k.n)}</b> <span>${esc(k && k.min)}${k && k.self ? ' · self-checked' : ''}</span><i style="width:${Math.max(0, Math.min(100, Number(k && k.pct) || 0))}%"></i><em>${Math.max(0, Math.min(100, Number(k && k.pct) || 0))}%</em></li>`).join('');
    const projects = (Array.isArray(s.projects) ? s.projects : []).slice(0, 10).map(p => { const [t, d, k] = String(p).split('|'); return `<div class="p"><h3>${esc(t)}</h3><p>${esc(d)}</p><small>${esc(k)}</small></div>`; }).join('');
    const git = typeof s.git === 'string' && /^https:\/\//i.test(s.git) ? `<a href="${esc(s.git)}" rel="noopener nofollow">${esc(s.git)}</a>` : esc(s.git);
    res.type('html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(s.name || 'Portfolio')} | BRIDGE</title>
<style>body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;margin:0;padding:24px}main{max-width:760px;margin:auto}h1{margin:0}h2{margin-top:28px;color:#22d3ee}.role{color:#a5b4fc}ul{list-style:none;padding:0}li{position:relative;display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #1e293b}li b{min-width:150px}li span{color:#94a3b8;flex:1}li i{display:block;height:6px;background:#6366f1;border-radius:3px;max-width:120px;flex:0 0 auto}li em{font-style:normal;width:44px;text-align:end}.p{background:#1e293b;border-radius:10px;padding:12px 16px;margin:10px 0}.p h3{margin:0 0 4px}.p p{margin:0 0 6px;color:#cbd5e1}small{color:#22d3ee}a{color:#22d3ee}</style></head>
<body><main><h1>${esc(s.name || 'Portfolio')}</h1><p class="role">${esc(s.role)}</p><p>${esc(s.bio)}</p><p>${git} ${esc(s.mail)}</p>
<h2>Skills</h2><ul>${skills}</ul><h2>Projects</h2>${projects}<p style="margin-top:32px;color:#64748b">Made with BRIDGE</p></main></body></html>`);
  }));

  // ---------- learning resources ----------
  const resCache = new Map();
  app.get('/api/resources/:skill', wrap(async (req, res) => {
    const skill = String(req.params.skill).slice(0, 60), q = encodeURIComponent(skill + ' tutorial for beginners');
    const courses = [
      { title: 'YouTube', url: 'https://www.youtube.com/results?search_query=' + q },
      { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/search?query=' + q },
      { title: 'Coursera', url: 'https://www.coursera.org/search?query=' + encodeURIComponent(skill) }
    ];
    let videos = [];
    if (env.YOUTUBE_API_KEY && doFetch) {
      const hit = resCache.get(skill);
      if (hit && hit.expires > Date.now()) videos = hit.videos;
      else {
        try {
          const r = await (await doFetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${q}&key=${encodeURIComponent(env.YOUTUBE_API_KEY)}`)).json();
          videos = (r.items || []).filter(i => i.id && i.id.videoId).map(i => ({ title: i.snippet.title, channel: i.snippet.channelTitle, url: 'https://www.youtube.com/watch?v=' + i.id.videoId }));
          resCache.set(skill, { videos, expires: Date.now() + 6 * 3600 * 1000 });
        } catch (e) { videos = []; }
      }
    }
    res.json({ videos, courses });
  }));

  // ---------- push reminders ----------
  app.get('/api/push/key', wrap(async (req, res) => res.json({ key: VAPID.publicKey })));
  app.post('/api/push/subscribe', auth, wrap(async (req, res) => {
    const s = req.body || {};
    if (typeof s.endpoint !== 'string' || !/^https:\/\//.test(s.endpoint) || !s.keys || typeof s.keys.p256dh !== 'string' || typeof s.keys.auth !== 'string') return res.status(400).json({ error: 'Invalid subscription.' });
    await db.run('INSERT INTO push_subs (endpoint, user_id, sub) VALUES (?,?,?) ON CONFLICT(endpoint) DO UPDATE SET user_id = excluded.user_id, sub = excluded.sub',
      [s.endpoint, req.user.id, JSON.stringify({ endpoint: s.endpoint, keys: { p256dh: s.keys.p256dh, auth: s.keys.auth } })]);
    res.json({ ok: true });
  }));

  async function sendReminders() {
    await ready;
    const subject = env.VAPID_SUBJECT || (/^https:\/\//.test(env.PUBLIC_URL || '') ? env.PUBLIC_URL : 'mailto:admin@example.com');
    const payload = JSON.stringify({ title: 'BRIDGE', body: 'Time to continue your learning track.' });
    for (const r of await db.all('SELECT endpoint, sub FROM push_subs')) {
      try { await webpush.sendNotification(json(r.sub, {}), payload, { vapidDetails: { subject, publicKey: VAPID.publicKey, privateKey: VAPID.privateKey } }); }
      catch (e) { if (e.statusCode === 404 || e.statusCode === 410) await db.run('DELETE FROM push_subs WHERE endpoint = ?', [r.endpoint]); }
    }
  }
  app.sendReminders = sendReminders;

  // ---------- pages, 404, errors ----------
  app.get('/admin.html', (req, res) => res.redirect(302, '/#admin'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

  app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status === 413 ? 'Request is too large.' : status === 400 ? 'Bad request.' : status >= 500 ? 'Server error.' : err.message });
  });

  app.start = (port = env.PORT || 3000) => {
    const server = app.listen(port, () => console.log(`BRIDGE running on port ${port}`));
    const hour = Number.isInteger(Number(env.REMINDER_HOUR)) && env.REMINDER_HOUR !== '' && env.REMINDER_HOUR != null ? Number(env.REMINDER_HOUR) : 18;
    let lastDay = '';
    const timer = setInterval(() => {                       // once a day at REMINDER_HOUR (server time)
      const now = new Date(), day = now.toDateString();
      if (now.getHours() === hour && day !== lastDay) { lastDay = day; sendReminders().catch(e => console.error('Reminders failed:', e.message)); }
    }, 60 * 1000);
    timer.unref();
    server.on('close', () => clearInterval(timer));
    return server;
  };

  return app;
}

if (require.main === module) createApp().start();

module.exports = { createApp };
