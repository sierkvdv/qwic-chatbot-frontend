"use client";

import { IntentType } from "@/types/chat";

interface IntentBadgeProps {
  intent: IntentType;
}

const intentConfig: Record<string, { label: string; color: string }> = {
  faq: { label: "FAQ", color: "bg-blue-100 text-blue-700" },
  error_code: { label: "Foutcode", color: "bg-orange-100 text-orange-700" },
  manual: { label: "Handleiding", color: "bg-green-100 text-green-700" },
  escalate: { label: "Doorverwijzing", color: "bg-red-100 text-red-700" },
};

export default function IntentBadge({ intent }: IntentBadgeProps) {
  const config = intentConfig[intent] || { label: intent, color: "bg-gray-100 text-gray-700" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
