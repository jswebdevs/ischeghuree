"use client";

import { useState } from "react";
import MediaManager from "@/components/dashboard/shared/media/MediaManager";
import CountBadge from "@/components/dashboard/shared/CountBadge";

export default function MediaLibraryPage() {
  const [count, setCount] = useState<number | null>(null);

  return (
    <div className="p-4 md:p-6 max-w-400 mx-auto animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-1 flex items-center gap-3">
          Media Library
          <CountBadge count={count} label="files" />
        </h1>
        <p className="text-sm text-muted-foreground">Manage your images, icons, and files.</p>
      </div>

      {/* Render the core component - passing no props means it acts purely as a manager, not a picker */}
      <MediaManager onCountChange={setCount} />
    </div>
  );
}