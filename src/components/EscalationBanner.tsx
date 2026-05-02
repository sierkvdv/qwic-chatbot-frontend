"use client";

interface EscalationBannerProps {
  onEscalate?: () => void;
}

export default function EscalationBanner({ onEscalate }: EscalationBannerProps) {
  return (
    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.194-.833-2.964 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-800 font-medium">Doorverwijzing aanbevolen</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Voor deze vraag is persoonlijke ondersteuning beschikbaar.
          </p>
        </div>
      </div>
      <button
        onClick={onEscalate}
        className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Doorverbinden met QWIC serviceteam
      </button>
    </div>
  );
}
