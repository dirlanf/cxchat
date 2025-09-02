import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ListMessagesUseCase } from '../../application/use-cases/list-messages.usecase';
import * as Jwt from '../../../auth/domain/ports/jwt.port';
import { Inject, UseFilters, UsePipes } from '@nestjs/common';
import { SendMessageUseCase } from '../../application/use-cases/send-message.usecase';
import * as cookie from 'cookie';
import { WsAllExceptionsFilter } from '../common/ws/ws-exception.filter';
import { MessageListSchema, MessageSendSchema } from './schemas';
import { ZodWsPipe } from '../common/ws/zod-ws.pipe';

@WebSocketGateway({
  namespace: '/chat',
  transports: ['websocket'],
  cors: { origin: process.env.CORS_ORIGIN?.split(','), credentials: true },
})
@UseFilters(WsAllExceptionsFilter)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
      const payload: { sub: string; name: string } =
        await this.jwt.verifyAccess(token);
      (client as Record<string, any>).userId = payload.sub;
      (client as Record<string, any>).userName = payload.name;
      this.server.emit('user:joined', {
        userName: payload.name,
        joinedAt: Date.now(),
      });
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const raw = client.handshake.headers.cookie;
    const rawParsed = raw ? cookie.parse(raw) : undefined;
    const token = rawParsed ? rawParsed['access_token'] : undefined;
    if (token) {
      try {
        const payload: { sub: string; name: string } =
          await this.jwt.verifyAccess(token);

        this.server.emit('user:left', {
          userName: payload.name,
          leftAt: Date.now(),
        });
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  @SubscribeMessage('message:list')
  @UsePipes(new ZodWsPipe(MessageListSchema))
  async onList(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { limit?: number },
  ) {
    const data = await this.listMessages.execute(body.limit);
    client.emit('message:list', data);
  }

  @SubscribeMessage('message:send')
  @UsePipes(new ZodWsPipe(MessageSendSchema))
  async onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() { text }: { text: string },
  ) {
    const userId = (client as Record<string, any>).userId as string;
    const message = await this.sendMessage.execute({
      userId,
      text,
    });
    this.server.emit('message:new', message);
  }
}
