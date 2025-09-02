import { memo } from "react";

type ChatHeaderProps = {
  connected: boolean;
  userName?: string;
};

function ChatHeaderComponent({ connected, userName }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between py-2">
      <h1 className="text-lg font-semibold text-gray-900">Chat</h1>
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`} />
        <span className="text-gray-600">
          {connected ? "Online" : "Offline"}
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-700 font-medium">{userName}</span>
      </div>
    </header>
  );
}

export const ChatHeader = memo(ChatHeaderComponent);
