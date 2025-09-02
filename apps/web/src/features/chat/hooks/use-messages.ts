import { useState, useCallback } from "react";
import type {
  ChatMessage,
  Message,
  UserJoinedEvent,
  UserLeftEvent,
} from "../types/message";

export function useMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const setMessageList = useCallback((list: Message[]) => {
    setMessages(list.slice().reverse());
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const addUserJoinedMessage = useCallback((event: UserJoinedEvent) => {
    const systemMessage: ChatMessage = {
      id: `system-joined-${Date.now()}`,
      userName: event.userName,
      createdAt: event.joinedAt,
      text: "Entrou na sala",
      isSystemMessage: true,
    };
    setMessages((prev) => [...prev, systemMessage]);
  }, []);

  const addUserLeftMessage = useCallback((event: UserLeftEvent) => {
    const systemMessage: ChatMessage = {
      id: `system-left-${Date.now()}`,
      userName: event.userName,
      createdAt: event.leftAt,
      text: "Deixou a sala",
      isSystemMessage: true,
    };
    setMessages((prev) => [...prev, systemMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    setMessageList,
    addMessage,
    addUserJoinedMessage,
    addUserLeftMessage,
    clearMessages,
  };
}