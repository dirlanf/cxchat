import { useCallback } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useMessages } from "../hooks/use-messages";
import { useChatSocket } from "../hooks/use-chat-socket";
import { ChatHeader, MessageList, MessageInput } from "../components";

export function ChatPage() {
  const { user } = useAuth();
  const {
    messages,
    setMessageList,
    addMessage,
    addUserJoinedMessage,
    addUserLeftMessage,
  } = useMessages();

  const handleMessageList = useCallback(setMessageList, [setMessageList]);
  const handleNewMessage = useCallback(addMessage, [addMessage]);
  const handleUserJoined = useCallback(addUserJoinedMessage, [
    addUserJoinedMessage,
  ]);
  const handleUserLeft = useCallback(addUserLeftMessage, [addUserLeftMessage]);

  const { connected, sendMessage } = useChatSocket({
    onMessageList: handleMessageList,
    onNewMessage: handleNewMessage,
    onUserJoined: handleUserJoined,
    onUserLeft: handleUserLeft,
  });

  const handleSendMessage = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  return (
    <div className="max-w-3xl mx-auto h-dvh flex flex-col">
      <div className="p-4 border-b">
        <ChatHeader connected={connected} userName={user?.name} />
      </div>
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>
      <div className="p-4 border-t">
        <MessageInput onSendMessage={handleSendMessage} disabled={!connected} />
      </div>
    </div>
  );
}
