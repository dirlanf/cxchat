import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPort } from '../../domain/ports/jwt.port';

@Injectable()
export class JwtSigner implements JwtPort {
  constructor(private readonly jwt: JwtService) {}
  signAccess(payload: object): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
  }
  verifyAccess<T extends object = any>(token: string): Promise<T> {
    return this.jwt.verifyAsync<T>(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }
}
