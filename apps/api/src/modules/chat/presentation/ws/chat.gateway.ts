import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ListMessagesUseCase } from '../../application/use-cases/list-messages.usecase';
import * as Jwt from '../../../auth/domain/ports/jwt.port';
import { Inject } from '@nestjs/common';
import { SendMessageUseCase } from '../../application/use-cases/send-message.usecase';
import * as cookie from 'cookie';

@WebSocketGateway({
  namespace: '/chat',
  transports: ['websocket'],
  cors: { origin: process.env.CORS_ORIGIN?.split(','), credentials: true },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject(Jwt.JWT_PORT)
    private readonly jwt: Jwt.JwtPort,
    private readonly listMessages: ListMessagesUseCase,
    private readonly sendMessage: SendMessageUseCase,
  ) {}

  async handleConnection(client: Socket) {
    const raw = client.handshake.headers.cookie;
    const rawParsed = raw ? cookie.parse(raw) : undefined;
    const token = rawParsed ? rawParsed['access_token'] : undefined;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload: { sub: string } = await this.jwt.verifyAccess(token);
      (client as Record<string, any>).userId = payload.sub;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('message:list')
  async onList(@ConnectedSocket() client: Socket) {
    const data = await this.listMessages.execute();
    client.emit('message:list', data);
  }

  @SubscribeMessage('message:send')
  async onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() { text }: { text: string },
  ) {
    const userId = (client as Record<string, any>).userId as string;
    await this.sendMessage.execute({
      userId,
      text,
    });
  }
}
