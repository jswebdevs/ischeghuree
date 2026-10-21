// Record count shown beside a dashboard page title, e.g. "Products (25)".
// Renders nothing until the count is known so the title doesn't flash "0".
export default function CountBadge({ count, label }: { count: number | null | undefined; label: string }) {
  if (count === null || count === undefined) return null;
  return (
    <span
      className="inline-flex items-center justify-center min-w-8 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-black tabular-nums tracking-normal normal-case align-middle"
      title={`${count.toLocaleString()} ${label}`}
      aria-label={`${count.toLocaleString()} ${label}`}
    >
      {count.toLocaleString()}
    </span>
  );
}
