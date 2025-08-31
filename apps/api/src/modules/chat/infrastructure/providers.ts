import { Provider } from '@nestjs/common';
import { MESSAGES_REPOSITORY } from '../domain/ports/messages-repository.port';
import { PrismaMessagesRepository } from './adapters/prisma.messages.repository';

export const chatProviders: Provider[] = [
  { provide: MESSAGES_REPOSITORY, useClass: PrismaMessagesRepository },
];
