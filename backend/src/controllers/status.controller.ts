import { Request, Response } from 'express';
import prisma from '../config/prisma';

type ServiceState = 'active' | 'maintenance' | 'error';

interface ServiceStatus {
  state: ServiceState;
  message: string;
  checkedAt: Date;
  timezone: string;
  /** Maintenance window: when it starts (or started) and is expected to end. */
  maintenanceStart: Date | null;
  maintenanceEnd: Date | null;
  /** True when a window is booked for later and the site is still up. */
  maintenanceScheduled: boolean;
}

const DB_TIMEOUT_MS = 3000;

// Maintenance is on when the switch is on, or when now falls inside the
// scheduled window. A window with no end stays on until it is cleared.
const resolveState = (
  s: { maintenanceMode: boolean; maintenanceStart: Date | null; maintenanceEnd: Date | null },
  now: Date
) => {
  const { maintenanceStart: start, maintenanceEnd: end } = s;
  const inWindow = !!start && start <= now && (!end || end > now);
  return {
    active: s.maintenanceMode || inWindow,
    scheduled: !s.maintenanceMode && !!start && start > now,
  };
};

export const getServiceStatus = async (): Promise<ServiceStatus> => {
  const checkedAt = new Date();
  try {
    // Raced against a timeout: this runs on the health-check path, which must
    // answer quickly even when the database hangs rather than fails.
    const settings = await Promise.race([
      prisma.siteSettings.findUnique({
        where: { id: 'singleton' },
        select: {
          maintenanceMode: true,
          maintenanceMessage: true,
          maintenanceStart: true,
          maintenanceEnd: true,
          timezone: true,
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Database check timed out')), DB_TIMEOUT_MS)
      ),
    ]);

    const { active, scheduled } = settings
      ? resolveState(settings, checkedAt)
      : { active: false, scheduled: false };

    return {
      state: active ? 'maintenance' : 'active',
      message: active
        ? settings?.maintenanceMessage || 'The service is under scheduled maintenance.'
        : 'All systems are running normally.',
      checkedAt,
      timezone: settings?.timezone || 'Asia/Dhaka',
      maintenanceStart: settings?.maintenanceStart ?? null,
      maintenanceEnd: settings?.maintenanceEnd ?? null,
      maintenanceScheduled: scheduled,
    };
  } catch (error) {
    // Logged in full here; the public response never carries the details.
    console.error('Status check failed:', error);
    return {
      state: 'error',
      message: 'The API is running but cannot reach its database.',
      checkedAt,
      timezone: 'Asia/Dhaka',
      maintenanceStart: null,
      maintenanceEnd: null,
      maintenanceScheduled: false,
    };
  }
};

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

const formatTime = (d: Date, timeZone: string) => {
  try {
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(d);
  } catch {
    return d.toISOString();
  }
};

const LABELS: Record<ServiceState, { title: string; color: string }> = {
  active: { title: 'Active', color: '#16a34a' },
  maintenance: { title: 'Under maintenance', color: '#d97706' },
  error: { title: 'Error', color: '#dc2626' },
};

const renderPage = (s: ServiceStatus) => {
  const { title, color } = LABELS[s.state];
  const rows: [string, string][] = [];
  if (s.maintenanceStart) {
    const label = s.maintenanceScheduled ? 'Maintenance scheduled' : 'Maintenance started';
    if (s.maintenanceScheduled || s.state === 'maintenance') {
      rows.push([label, formatTime(s.maintenanceStart, s.timezone)]);
    }
  }
  if (s.maintenanceEnd && (s.maintenanceScheduled || s.state === 'maintenance')) {
    rows.push(['Expected back', formatTime(s.maintenanceEnd, s.timezone)]);
  }
  rows.push(['Checked', `${formatTime(s.checkedAt, s.timezone)} (${s.timezone})`]);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Ische Ghuree API: ${title}</title>
<style>
  :root { color-scheme: light dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 16px; box-sizing: border-box;
         font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: Canvas; color: CanvasText; }
  main { width: 100%; max-width: 420px; }
  h1 { font-size: 14px; font-weight: 600; margin: 0 0 16px; opacity: .7; }
  .state { display: flex; align-items: center; gap: 10px; font-size: 26px; font-weight: 700; }
  .dot { width: 14px; height: 14px; border-radius: 50%; background: ${color}; flex: none; }
  p { margin: 10px 0 20px; line-height: 1.5; }
  dl { margin: 0; font-size: 14px; border-top: 1px solid color-mix(in srgb, CanvasText 15%, transparent); padding-top: 12px; }
  dl div { display: flex; justify-content: space-between; gap: 16px; padding: 4px 0; }
  dt { opacity: .7; }
  dd { margin: 0; text-align: right; }
</style>
</head>
<body>
<main>
  <h1>Ische Ghuree API</h1>
  <div class="state"><span class="dot"></span>${title}</div>
  <p>${escapeHtml(s.message)}</p>
  <dl>${rows.map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`).join('')}</dl>
</main>
</body>
</html>`;
};

// GET / — human status page. Always 200, even when reporting an error:
// Coolify's health check calls this path, and a non-200 would mark the
// container unhealthy and take the page down exactly when it is needed.
// Monitors should use GET /api/v1/status, which does return 503.
export const statusPage = async (req: Request, res: Response): Promise<void> => {
  const status = await getServiceStatus();
  res.set('Cache-Control', 'no-store');
  if (req.accepts(['html', 'json']) === 'json') {
    res.json(status);
    return;
  }
  res.type('html').send(renderPage(status));
};

// GET /api/v1/status — machine-readable; 503 when the database is unreachable.
export const statusJson = async (_req: Request, res: Response): Promise<void> => {
  const status = await getServiceStatus();
  res.set('Cache-Control', 'no-store');
  res.status(status.state === 'error' ? 503 : 200).json(status);
};
