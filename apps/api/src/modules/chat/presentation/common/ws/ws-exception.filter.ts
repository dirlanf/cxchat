import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

interface WsClient {
  emit(event: string, data: any): void;
}

interface WsData {
  event: string;
}

type ExceptionResponse = {
  code: string;
  message: string;
};

@Catch(Error)
export class WsAllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | WsException | Error, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<WsClient>();
    const event = ctx?.getData<WsData>()?.event;

    let payload: ExceptionResponse = {
      code: 'WS_INTERNAL_ERROR',
      message: 'Unexpected error',
    };

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        payload = res as ExceptionResponse;
      } else {
        payload = { code: 'WS_HTTP_ERROR', message: String(res) };
      }
    } else if (exception instanceof WsException) {
      const err = exception.getError();
      if (typeof err === 'object' && err !== null) {
        payload = err as ExceptionResponse;
      } else {
        payload = { code: 'WS_EXCEPTION', message: String(err) };
      }
    }

    client.emit('error', { event, ...payload });
  }
}
