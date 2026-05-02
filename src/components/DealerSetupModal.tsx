"use client";

import { useState } from "react";

interface DealerSetupModalProps {
  currentName?: string;
  onSave: (name: string) => void;
  onSkip: () => void;
}

export default function DealerSetupModal({ currentName, onSave, onSkip }: DealerSetupModalProps) {
  const [name, setName] = useState(currentName || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#E63A2A] rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Welkom bij QWIC Support</h2>
            <p className="text-xs text-gray-500">Dealer identificatie</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Vul je dealernaam in zodat we je beter kunnen helpen. Dit is optioneel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Naam van je dealerbedrijf"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E63A2A] focus:ring-1 focus:ring-[#E63A2A] transition-all"
            autoFocus
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Overslaan
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2.5 bg-[#E63A2A] hover:bg-[#c42d1e] disabled:bg-gray-200 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Start chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
