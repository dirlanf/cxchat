export interface MessagesRepositoryPort {
  listRecent(limit: number): Promise<
    {
      id: string;
      text: string;
      createdAt: Date;
      userName: string;
    }[]
  >;
  create(data: { userId: string; text: string }): Promise<{
    id: string;
    text: string;
    createdAt: Date;
    userName: string;
  }>;
}

export const MESSAGES_REPOSITORY = Symbol('MESSAGES_REPOSITORY');
