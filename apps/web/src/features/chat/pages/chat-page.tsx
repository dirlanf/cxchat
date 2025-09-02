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
    <div className="max-w-3xl mx-auto p-4 grid gap-4 h-dvh">
      <ChatHeader connected={connected} userName={user?.name} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} disabled={!connected} />
    </div>
  );
}
