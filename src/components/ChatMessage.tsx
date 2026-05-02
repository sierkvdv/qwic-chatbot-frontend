"use client";

import { Message } from "@/types/chat";
import IntentBadge from "./IntentBadge";
import SourceList from "./SourceList";
import EscalationBanner from "./EscalationBanner";

interface ChatMessageProps {
  message: Message;
  onEscalate?: () => void;
  onQuickReply?: (reply: string) => void;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-2 px-1">
      <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
      <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
      <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
    </div>
  );
}

function formatContent(content: string): React.ReactNode {
  const lines = content.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
      }
      return <span key={partIdx}>{part}</span>;
    });
    return (
      <span key={lineIdx}>
        {formatted}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatMessage({ message, onEscalate, onQuickReply }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  if (isUser) {
    return (
      <div className="message-enter flex justify-end mb-4">
        <div className="max-w-[80%] sm:max-w-[70%]">
          <div className="bg-[#E63A2A] text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">
            {message.timestamp.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  }

  if (isAssistant) {
    return (
      <div className="message-enter flex justify-start mb-4">
        <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[75%]">
          {/* QWIC Avatar */}
          <div className="flex-shrink-0 w-8 h-8 bg-[#E63A2A] rounded-full flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
              {message.isLoading ? (
                <TypingIndicator />
              ) : (
                <>
                  {/* Intent badge */}
                  {message.intent && message.intent !== "faq" && (
                    <div className="mb-2">
                      <IntentBadge intent={message.intent} />
                    </div>
                  )}

                  {/* Message content */}
                  <div className="text-sm text-gray-800 leading-relaxed">
                    {formatContent(message.content)}
                  </div>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <SourceList sources={message.sources} />
                  )}

                  {/* Motor type quick-reply buttons */}
                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => onQuickReply?.(reply)}
                          className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E63A2A] text-[#E63A2A] rounded-full hover:bg-[#E63A2A] hover:text-white transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Escalation banner */}
                  {message.escalate && (
                    <EscalationBanner onEscalate={onEscalate} />
                  )}
                </>
              )}
            </div>

            {!message.isLoading && (
              <p className="text-xs text-gray-400 mt-1 ml-1">
                {message.timestamp.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
