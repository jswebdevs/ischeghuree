import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupChatSocket } from './sockets/chat.socket';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

// Mirror the Express CORS allowlist so browsers accept the websocket
// upgrade with credentials. All entries env-driven; localhost is added
// automatically only outside production. Same env vars as the REST allowlist.
const splitCsv = (v: string | undefined): string[] =>
  (v || '').split(',').map((s) => s.trim()).filter(Boolean);

const isProd = process.env['NODE_ENV'] === 'production';

const allowedOrigins: string[] = [
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
    } catch {
      return null;
    }
  })
  .filter((r): r is RegExp => r !== null);

const allowAllOrigins = process.env['CORS_ALLOW_ALL'] === '1';

const isSocketOriginAllowed = (origin: string): boolean => {
  if (allowAllOrigins) return true;
  const o = origin.replace(/\/$/, '');
  if (allowedOrigins.some((a) => a.replace(/\/$/, '') === o)) return true;
  return allowedOriginPatterns.some((re) => re.test(o));
};

async function main() {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (isSocketOriginAllowed(origin)) return cb(null, true);
        console.warn('[Socket CORS] blocked origin:', origin);
        cb(null, false);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  app.set('io', io);
  setupChatSocket(io);

  try {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start', error);
    process.exit(1);
  }
}

main();
