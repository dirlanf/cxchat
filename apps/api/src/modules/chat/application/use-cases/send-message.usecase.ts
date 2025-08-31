import { Inject, Injectable } from '@nestjs/common';
import * as MessagesRepository from '../../domain/ports/messages-repository.port';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(MessagesRepository.MESSAGES_REPOSITORY)
    private readonly messagesRepository: MessagesRepository.MessagesRepositoryPort,
  ) {}
  execute(data: { userId: string; text: string }) {
    return this.messagesRepository.create(data);
  }
}
