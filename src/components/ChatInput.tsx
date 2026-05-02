"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const SUGGESTED_QUESTIONS = [
  "Wat betekent foutcode E01?",
  "Hoe vervang ik de Brose interne riem?",
  "BA00130 accu laadt niet op",
  "Elan zadelpen past niet goed",
];

export default function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    setInput("");
    setShowSuggestions(false);
    onSend(trimmed);
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSuggestion = (question: string) => {
    setShowSuggestions(false);
    onSend(question);
  };

  return (
    <div className="space-y-2">
      {/* Suggested questions */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 px-1">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(q)}
              disabled={disabled}
              className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-[#E63A2A] hover:text-[#E63A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 focus-within:border-[#E63A2A] focus-within:ring-1 focus-within:ring-[#E63A2A] transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder || "Stel een vraag over QWIC fietsen..."}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent min-h-[24px] max-h-[120px] disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="flex-shrink-0 w-8 h-8 bg-[#E63A2A] hover:bg-[#c42d1e] disabled:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          aria-label="Verstuur bericht"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center">
        Druk op Enter om te versturen · Shift+Enter voor nieuwe regel
      </p>
    </div>
  );
}
