import { memo, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./message";
import type { ChatMessage } from "../types/message";

type MessageListProps = {
  messages: ChatMessage[];
};

function MessageListComponent({ messages }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <ScrollArea className="flex-1 border rounded p-3 max-h-[80vh] h-full">
      <div className="space-y-2">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}

export const MessageList = memo(MessageListComponent);
