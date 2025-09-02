import { memo } from "react";

type ChatHeaderProps = {
  connected: boolean;
  userName?: string;
};

function ChatHeaderComponent({ connected, userName }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between max-h-10">
      <h1 className="text-xl font-semibold">Chat</h1>
      <div className="text-sm opacity-70">
        {connected ? "Online" : "Offline"} • {userName}
      </div>
    </header>
  );
}

export const ChatHeader = memo(ChatHeaderComponent);
