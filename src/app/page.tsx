"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, ChatResponse } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import DealerHeader from "@/components/DealerHeader";
import DealerSetupModal from "@/components/DealerSetupModal";
import EscalationModal from "@/components/EscalationModal";

const WELCOME_CONTENT =
  "Hallo! Ik ben de QWIC technische ondersteuningsassistent. Ik kan je helpen met vragen over foutcodes, handleidingen, onderhoud en technische specificaties van QWIC elektrische fietsen.\n\nWat kan ik voor je doen?";

const MOTOR_TYPES = ["Brose", "Bafang", "Hyena", "H501", "Signal"];
const ERROR_CODE_REGEX = /\b(foutcode|fout\s*code|error)\s*\d+\b/i;
const MOTOR_REGEX = /\b(brose|bafang|hyena|h501|signal)\b/i;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_CONTENT,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [dealerName, setDealerName] = useState<string>("");
  const [showDealerModal, setShowDealerModal] = useState(true);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [isOnline, setIsOnline] = useState(true);
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadingIdRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Check API health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health", { signal: AbortSignal.timeout(5000) });
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load dealer name from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("qwic_dealer_name");
    if (stored) {
      setDealerName(stored);
      setShowDealerModal(false);
    }
  }, []);

  const handleDealerSave = (name: string) => {
    setDealerName(name);
    localStorage.setItem("qwic_dealer_name", name);
    setShowDealerModal(false);
  };

  const handleDealerSkip = () => {
    setShowDealerModal(false);
  };

  const sendToBackend = useCallback(async (backendMessage: string) => {
    const loadingId = uuidv4();
    loadingIdRef.current = loadingId;
    const loadingMsg: Message = {
      id: loadingId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: backendMessage,
          session_id: sessionId,
          dealer_name: dealerName || undefined,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                content: data.answer,
                sources: data.sources,
                intent: data.intent,
                escalate: data.escalate,
                isLoading: false,
              }
            : msg
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message.includes("timeout")
            ? "Het verzoek duurde te lang. Probeer het opnieuw."
            : error.message.includes("fetch") || error.message.includes("Failed")
            ? "Kan geen verbinding maken met de server. Controleer of de backend actief is."
            : `Er is een fout opgetreden: ${error.message}`
          : "Er is een onbekende fout opgetreden.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                content: errorMessage,
                isLoading: false,
                escalate: true,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      loadingIdRef.current = null;
    }
  }, [sessionId, dealerName]);

  const handleSendMessage = useCallback(async (userMessage: string) => {
    if (isLoading) return;

    const userMsg: Message = {
      id: uuidv4(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    // Detect error code query without motor type → ask for clarification
    if (ERROR_CODE_REGEX.test(userMessage) && !MOTOR_REGEX.test(userMessage)) {
      const clarifyMsg: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Welk systeem heeft de fiets? Zo kan ik de juiste foutcode opzoeken.",
        timestamp: new Date(),
        quickReplies: MOTOR_TYPES,
      };
      setMessages((prev) => [...prev, userMsg, clarifyMsg]);
      setPendingUserMessage(userMessage);
      return;
    }

    setMessages((prev) => [...prev, userMsg]);
    await sendToBackend(userMessage);
  }, [isLoading, sendToBackend]);

  const handleQuickReply = useCallback((reply: string) => {
    const combinedMessage = pendingUserMessage
      ? `${pendingUserMessage} (systeem: ${reply})`
      : reply;

    setPendingUserMessage(null);

    // Remove quick-reply buttons from the clarify message
    setMessages((prev) =>
      prev.map((msg) =>
        msg.quickReplies ? { ...msg, quickReplies: undefined } : msg
      )
    );

    // Show user's selection as a chat message
    const userMsg: Message = {
      id: uuidv4(),
      role: "user",
      content: reply,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    sendToBackend(combinedMessage);
  }, [pendingUserMessage, sendToBackend]);

  const handleEscalate = () => {
    setShowEscalationModal(true);
  };

  const handleClearChat = () => {
    setPendingUserMessage(null);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: WELCOME_CONTENT,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <DealerHeader
        dealerName={dealerName}
        onChangeDealerName={() => setShowDealerModal(true)}
        isOnline={isOnline}
      />

      {/* Main chat area */}
      <main className="flex-1 overflow-hidden max-w-3xl w-full mx-auto flex flex-col">
        {/* Messages */}
        <div className="chat-messages flex-1 overflow-y-auto px-4 py-4 space-y-0">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onEscalate={handleEscalate}
              onQuickReply={handleQuickReply}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-gray-400">
              {messages.length > 1 ? `${messages.length - 1} bericht${messages.length - 1 !== 1 ? "en" : ""}` : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEscalate}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#E63A2A] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Menselijke ondersteuning
              </button>
              {messages.length > 1 && (
                <button
                  onClick={handleClearChat}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Wis gesprek
                </button>
              )}
            </div>
          </div>

          <ChatInput
            onSend={handleSendMessage}
            disabled={isLoading || !isOnline}
            placeholder={
              !isOnline
                ? "Geen verbinding met server..."
                : "Stel een vraag over QWIC fietsen..."
            }
          />
        </div>
      </main>

      {/* Modals */}
      {showDealerModal && (
        <DealerSetupModal
          currentName={dealerName}
          onSave={handleDealerSave}
          onSkip={handleDealerSkip}
        />
      )}

      {showEscalationModal && (
        <EscalationModal onClose={() => setShowEscalationModal(false)} />
      )}
    </div>
  );
}
