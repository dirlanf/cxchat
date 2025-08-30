import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import * as Jwt from '../../../domain/ports/jwt.port';
import { Request } from 'express';

export class JwtGuard implements CanActivate {
  constructor(
    @Inject(Jwt.JWT_PORT)
    private readonly jwt: Jwt.JwtPort,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { userId: string }>();
    const token: string | undefined =
      (req.cookies?.['access_token'] as string) ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Missing Token');
    }

    try {
      const payload: { sub: string } = await this.jwt.verifyAccess(token);
      req.userId = payload.sub;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
