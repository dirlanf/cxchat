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
        message.isSystemMessage 
          ? "bg-blue-50 border-l-2 border-blue-300" 
          : "bg-gray-50 hover:bg-gray-100"
      } p-3 rounded-lg transition-colors duration-150`}
    >
      <div className="flex-1 min-w-0">
        <span className="font-medium text-gray-900">{message.userName}</span>
        <span className="text-gray-600">: </span>
        <span className="text-gray-800 break-words">{message.text}</span>
      </div>
      <span className="ml-3 opacity-60 text-xs text-gray-500 flex-shrink-0 self-start">
        {formattedTime}
      </span>
    </div>
  );
}

export const Message = memo(MessageComponent);
