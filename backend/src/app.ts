import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/global.error.handler';
import { apiLimiter } from './middlewares/rateLimit';
import routes from './routes';

const app: Application = express();

// 1. Global Middleware — CORS
//
// All allowlist entries come from env vars. No hardcoded fallbacks (apart
// from localhost when NODE_ENV !== "production", to keep dev ergonomic).
//
//   CORS_ALLOWED_ORIGINS         comma-separated exact origins
//                                e.g. "https://app.example.com,https://x.example.com"
//   CORS_ALLOWED_ORIGIN_PATTERNS comma-separated JS regex sources (case-insensitive)
//                                e.g. "^https://.*\\.example\\.com$"
//   CORS_ALLOW_ALL=1             allow any origin (echo it back) — debugging only
//   CLIENT_URL                   single primary frontend origin (also accepted;
//                                legacy typo Client_URL and CORS_ORIGIN honored too)
//
// Throwing inside cors's origin callback strips the response of CORS headers
// (browsers then report "No Access-Control-Allow-Origin header"), so on
// rejection we resolve `false` instead — the browser still sees a clean
// HTTP error with the correct status.

const splitCsv = (v: string | undefined): string[] =>
  (v || '').split(',').map((s) => s.trim()).filter(Boolean);

const isProd = process.env['NODE_ENV'] === 'production';

const allowedOrigins: string[] = [
  // Localhost is auto-allowed only outside production so devs aren't blocked.
  ...(isProd ? [] : [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ]),
  process.env['CLIENT_URL'] || '',
  process.env['Client_URL'] || '', // legacy typo'd env name, kept as fallback
  process.env['CORS_ORIGIN'] || '',
  ...splitCsv(process.env['CORS_ALLOWED_ORIGINS']),
].filter(Boolean);

const allowedOriginPatterns: RegExp[] = splitCsv(process.env['CORS_ALLOWED_ORIGIN_PATTERNS'])
  .map((src) => {
    try {
      return new RegExp(src, 'i');
    } catch (e) {
      console.warn('[CORS] invalid regex in CORS_ALLOWED_ORIGIN_PATTERNS:', src, e);
      return null;
    }
  })
  .filter((r): r is RegExp => r !== null);

const allowAllOrigins = process.env['CORS_ALLOW_ALL'] === '1';

if (isProd && allowedOrigins.length === 0 && allowedOriginPatterns.length === 0 && !allowAllOrigins) {
  console.error(
    '[CORS] FATAL: no origins configured for production. Set CORS_ALLOWED_ORIGINS, CORS_ALLOWED_ORIGIN_PATTERNS, or CLIENT_URL.'
  );
}

const isOriginAllowed = (origin: string): boolean => {
  if (allowAllOrigins) return true;
  const o = origin.replace(/\/$/, '');
  if (allowedOrigins.some((a) => a.replace(/\/$/, '') === o)) return true;
  return allowedOriginPatterns.some((re) => re.test(o));
};

console.log('[CORS] static origins:', allowedOrigins);
console.log('[CORS] origin patterns:', allowedOriginPatterns.map((r) => r.source));
if (allowAllOrigins) console.warn('[CORS] CORS_ALLOW_ALL is on — every origin is accepted');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // server-to-server / curl / native apps
    if (isOriginAllowed(origin)) return callback(null, true);
    console.warn('[CORS] blocked origin:', origin);
    return callback(null, false); // resolve cleanly so headers/status reach the browser
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-guest-session',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 204,
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
// Trust the first proxy hop (Vercel/Cloudflare) so rate limiting and
// req.ip use the real client IP from X-Forwarded-For instead of the proxy.
app.set('trust proxy', 1);

// 2. API Routes — wrapped in a generous global rate limiter so a single
// IP can't exhaust the function. Tight limits on /auth are applied per-route.
app.use('/api/v1', apiLimiter, routes);

app.get('/test', (req, res) => res.send('Router is working'));

// 3. Health Check (Good for Docker)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Ische Ghuree API running' });
});

// 4. Global Error Handler (Must be last)
app.use(globalErrorHandler);

export default app;