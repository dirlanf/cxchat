import { Inject, Injectable } from '@nestjs/common';
import * as MessagesRepository from '../../domain/ports/messages-repository.port';

@Injectable()
export class ListMessagesUseCase {
  constructor(
    @Inject(MessagesRepository.MESSAGES_REPOSITORY)
    private readonly messagesRepository: MessagesRepository.MessagesRepositoryPort,
  ) {}
  execute(limit = 50) {
    return this.messagesRepository.listRecent(limit);
  }
}
