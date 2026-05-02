"use client";

interface DealerHeaderProps {
  dealerName?: string;
  onChangeDealerName?: () => void;
  isOnline?: boolean;
}

export default function DealerHeader({ dealerName, onChangeDealerName, isOnline = true }: DealerHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo area */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E63A2A] rounded-xl flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                QWIC <span className="text-[#E63A2A]">Dealer</span> Support
              </h1>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <p className="text-xs text-gray-500">
                  {isOnline ? 'Technische kennisbank actief' : 'Verbinding verbroken'}
                </p>
              </div>
            </div>
          </div>

          {/* Dealer info */}
          <div className="flex items-center gap-2">
            {dealerName ? (
              <button
                onClick={onChangeDealerName}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#E63A2A] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">{dealerName}</span>
              </button>
            ) : (
              <button
                onClick={onChangeDealerName}
                className="text-xs text-[#E63A2A] hover:text-[#c42d1e] font-medium transition-colors"
              >
                Dealer instellen
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
