"use client";

import { useState } from "react";
import { SourceDoc } from "@/types/chat";

interface SourceListProps {
  sources: SourceDoc[];
}

export default function SourceList({ sources }: SourceListProps) {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  const displaySources = expanded ? sources : sources.slice(0, 2);

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {sources.length} bron{sources.length !== 1 ? "nen" : ""} uit kennisbank
      </button>

      {expanded && (
        <ul className="space-y-1">
          {displaySources.map((source, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline truncate block"
                    title={source.title}
                  >
                    {source.title || source.file}
                  </a>
                ) : (
                  <span className="text-gray-600 truncate block" title={source.title}>
                    {source.title || source.file}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
