export interface SourceDoc {
  title: string;
  url: string;
  file: string;
  relevance_score: number;
}

export interface ChatResponse {
  answer: string;
  sources: SourceDoc[];
  intent: string;
  escalate: boolean;
  filtered_message?: string;
}

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  sources?: SourceDoc[];
  intent?: string;
  escalate?: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

export type IntentType = "faq" | "error_code" | "manual" | "escalate" | "error" | string;
