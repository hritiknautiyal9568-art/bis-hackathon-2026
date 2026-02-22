"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export function DemoBanner({ message }: { message?: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-amber-100 p-1.5 rounded-lg shrink-0 mt-0.5">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800">Demo Mode</p>
        <p className="text-xs text-amber-600 mt-0.5">
          {message || "AI quota exceeded — showing realistic sample data for demonstration purposes. Live AI will resume when quota resets."}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-600 transition-colors shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
