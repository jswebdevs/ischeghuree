"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Hammer, Settings, Wrench, X } from "lucide-react";

interface MaintenanceGuardProps {
    isMaintenanceMode: boolean;
    message: string;
    /** ISO timestamps of the maintenance window, when one is set. */
    start?: string | null;
    end?: string | null;
    /** Store timezone; every customer sees the window in shop time. */
    timezone?: string;
    children: React.ReactNode;
}

const REFRESH_MS = 30_000;

const formatWhen = (ms: number, timeZone: string) =>
    new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone,
    }).format(ms);

// The end time alone when the window closes the same day in shop time.
const formatEnd = (start: number, end: number, timeZone: string) => {
    const day = (ms: number) => new Intl.DateTimeFormat("en-GB", { dateStyle: "short", timeZone }).format(ms);
    if (day(start) !== day(end)) return formatWhen(end, timeZone);
    return new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone }).format(end);
};

const formatDuration = (ms: number) => {
    const minutes = Math.round(ms / 60_000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    const unit = hours === 1 ? "hour" : "hours";
    return rest ? `${hours} ${unit} ${rest} min` : `${hours} ${unit}`;
};

// Downtime notice shown across the top of the live site while maintenance is
// booked for later. Dismissible per browser session, per booking.
function MaintenanceNotice({ start, end, timezone }: { start: number; end: number | null; timezone: string }) {
    const key = `ig-maintenance-notice-${start}`;
    const [dismissed, setDismissed] = useState(true);

    useEffect(() => {
        let seen = false;
        try {
            seen = sessionStorage.getItem(key) === "1";
        } catch {
            // Storage blocked: just show the notice.
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable client-side; hydration-safe reveal
        setDismissed(seen);
    }, [key]);

    if (dismissed) return null;

    const dismiss = () => {
        setDismissed(true);
        try {
            sessionStorage.setItem(key, "1");
        } catch {
            // Storage blocked: dismissed for this page view only.
        }
    };

    return (
        <div role="status" className="bg-destructive/10 border-b border-destructive/30 text-foreground">
            <div className="container mx-auto px-4 py-2.5 flex items-start gap-3 text-sm">
                <Wrench className="w-4 h-4 mt-0.5 shrink-0 text-destructive" aria-hidden="true" />
                <p className="flex-1 min-w-0">
                    <strong>রক্ষণাবেক্ষণের নোটিশ — Scheduled maintenance:</strong>{" "}
                    {formatWhen(start, timezone)}
                    {end ? ` to ${formatEnd(start, end, timezone)} (about ${formatDuration(end - start)})` : ""}.
                    {" "}The site will be unavailable during this time.
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss notice"
                    className="p-1 -m-1 shrink-0 rounded hover:bg-destructive/15 transition-colors cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function MaintenanceGuard({
    isMaintenanceMode,
    message,
    start,
    end,
    timezone = "Asia/Dhaka",
    children,
}: MaintenanceGuardProps) {
    const pathname = usePathname();

    // The layout is cached, so the window is judged in the browser against
    // the live clock: the site locks and reopens on time without a reload.
    // Null until mounted, so server and first client render agree.
    const [now, setNow] = useState<number | null>(null);
    useEffect(() => {
        const tick = () => setNow(Date.now());
        tick();
        const id = setInterval(tick, REFRESH_MS);
        return () => clearInterval(id);
    }, []);

    const startMs = start ? new Date(start).getTime() : null;
    const endMs = end ? new Date(end).getTime() : null;
    const inWindow = now !== null && startMs !== null && startMs <= now && (endMs === null || endMs > now);
    const isLocked = isMaintenanceMode || inWindow;
    const isUpcoming = !isMaintenanceMode && now !== null && startMs !== null && startMs > now;

    // 1. ALWAYS allow access to the login page and the admin dashboards
    const isDashboard = pathname.startsWith("/dashboard");
    const isSafeRoute = isDashboard || pathname.startsWith("/login");

    // 2. If maintenance is ON, and they are NOT on a safe route, show the lock screen
    if (isLocked && !isSafeRoute) {
        const backAt = endMs !== null && (now === null || endMs > now) ? endMs : null;
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">

                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <div className="w-24 h-24 bg-card border border-border rounded-3xl shadow-theme-2xl flex items-center justify-center relative z-10">
                        <Hammer className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <Settings className="w-8 h-8 text-muted-foreground absolute -bottom-2 -right-2 animate-[spin_4s_linear_infinite]" />
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">
                    We&apos;ll be right back.
                </h1>

                <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    {message || "We are currently performing scheduled maintenance to upgrade your shopping experience. Please check back in a few minutes!"}
                </p>

                {backAt !== null && (
                    <p className="mt-4 text-sm font-bold text-foreground">
                        ফিরে আসব — Expected back: {formatWhen(backAt, timezone)}
                    </p>
                )}

            </div>
        );
    }

    // 3. Otherwise, render the website normally, with a notice of any
    // upcoming downtime for customers.
    return (
        <>
            {isUpcoming && !isDashboard && startMs !== null && (
                <MaintenanceNotice start={startMs} end={endMs} timezone={timezone} />
            )}
            {children}
        </>
    );
}
