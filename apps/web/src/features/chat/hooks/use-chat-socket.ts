import { useEffect, useCallback } from "react";
import { useSocket } from "@/providers/socket-provider";
import type {
  Message,
  UserJoinedEvent,
  UserLeftEvent,
  MessageListPayload,
  SendMessagePayload,
} from "../types/message";

type UseChatSocketProps = {
  onMessageList: (messages: Message[]) => void;
  onNewMessage: (message: Message) => void;
  onUserJoined: (event: UserJoinedEvent) => void;
  onUserLeft: (event: UserLeftEvent) => void;
};

export function useChatSocket({
  onMessageList,
  onNewMessage,
  onUserJoined,
  onUserLeft,
}: UseChatSocketProps) {
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("message:list", { limit: 50 } as MessageListPayload);

    const onError = (error: Error) => {
      console.warn("[ws error]", error);
    };

    socket.on("message:list", onMessageList);
    socket.on("message:new", onNewMessage);
    socket.on("user:joined", onUserJoined);
    socket.on("user:left", onUserLeft);
    socket.on("error", onError);

    return () => {
      socket.off("message:list", onMessageList);
      socket.off("message:new", onNewMessage);
      socket.off("user:joined", onUserJoined);
      socket.off("user:left", onUserLeft);
      socket.off("error", onError);
    };
  }, [socket, onMessageList, onNewMessage, onUserJoined, onUserLeft]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !socket) return;
      socket.emit("message:send", { text } as SendMessagePayload);
    },
    [socket]
  );

  return {
    connected,
    sendMessage,
  };
}
