export type Message = {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
};

export type ChatMessage = Message & {
  isSystemMessage?: boolean;
};

export type UserJoinedEvent = {
  userName: string;
  joinedAt: string;
};

export type UserLeftEvent = {
  userName: string;
  leftAt: string;
};

export type MessageListResponse = Message[];

export type SendMessagePayload = {
  text: string;
};

export type MessageListPayload = {
  limit: number;
};