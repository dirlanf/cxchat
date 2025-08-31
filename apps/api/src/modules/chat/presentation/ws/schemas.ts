import { z } from 'zod';

export const MessageSendSchema = z.object({
  text: z.string().trim().min(1, 'text is required').max(1000, 'text too long'),
});
export type MessageSendDto = z.infer<typeof MessageSendSchema>;

export const MessageListSchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(50),
  })
  .partial()
  .transform((v) => ({ limit: v.limit ?? 50 }));
export type MessageListDto = z.infer<typeof MessageListSchema>;
