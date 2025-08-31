import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { chatProviders } from './infrastructure/providers';
import { ListMessagesUseCase } from './application/use-cases/list-messages.usecase';
import { SendMessageUseCase } from './application/use-cases/send-message.usecase';
import { ChatGateway } from './presentation/ws/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { JWT_PORT } from '../auth/domain/ports/jwt.port';
import { JwtSigner } from '../auth/infrastructure/adapters/jwt.signer';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_EXPIRES,
      },
    }),
  ],
  providers: [
    ...chatProviders,
    ListMessagesUseCase,
    SendMessageUseCase,
    { provide: JWT_PORT, useClass: JwtSigner },
    ChatGateway,
  ],
})
export class ChatModule {}
