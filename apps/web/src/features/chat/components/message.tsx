import { memo } from "react";
import type { ChatMessage } from "../types/message";

type MessageProps = {
  message: ChatMessage;
};

function MessageComponent({ message }: MessageProps) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString();

  return (
    <div
      className={`flex w-full justify-between text-sm ${
        message.isSystemMessage ? "bg-slate-200" : "bg-white"
      } hover:bg-slate-100 p-1 pl-1.5 pr-1.5 rounded`}
    >
      <span className="w-full overflow-x-hidden">
        <span className="font-medium">{message.userName}</span>: {message.text}
      </span>
      <span className="ml-2 opacity-60 text-xs">{formattedTime}</span>
    </div>
  );
}

export const Message = memo(MessageComponent);
