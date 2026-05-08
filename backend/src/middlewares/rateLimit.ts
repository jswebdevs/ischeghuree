import rateLimit from 'express-rate-limit';

// Tunable via env so ops can react to abuse without a code change.
const intFromEnv = (name: string, fallback: number): number => {
    const v = Number(process.env[name]);
    return Number.isFinite(v) && v > 0 ? v : fallback;
};

// Brute-force protection on auth surfaces. The error surface is small (one
// boolean answer per request), so the limit is intentionally tight.
export const authLimiter = rateLimit({
    windowMs: intFromEnv('AUTH_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    max: intFromEnv('AUTH_RATE_LIMIT_MAX', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many attempts. Please try again in a few minutes.',
    },
});

// Generous default for everything else; absorbs traffic spikes without
// blocking real customers, but still pads against scrapers.
export const apiLimiter = rateLimit({
    windowMs: intFromEnv('API_RATE_LIMIT_WINDOW_MS', 60 * 1000),
    max: intFromEnv('API_RATE_LIMIT_MAX', 200),
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Slow down.' },
});

// Stricter limit for write-heavy endpoints (custom-order intake, contact form,
// password reset) so abuse can't fill the inbox or DB.
export const writeLimiter = rateLimit({
    windowMs: intFromEnv('WRITE_RATE_LIMIT_WINDOW_MS', 60 * 1000),
    max: intFromEnv('WRITE_RATE_LIMIT_MAX', 30),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many submissions. Please wait a moment.',
    },
});
