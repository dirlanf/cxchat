import { Provider } from '@nestjs/common';
import { USERS_REPOSITORY } from '../domain/ports/user-repository.port';
import { PrismaUserRepository } from './adapters/prisma-users.repository';
import { PASSWORD_HASHER } from '../domain/ports/password-hasher.port';
import { BcryptHasher } from './adapters/bcrypt.hasher';
import { JWT_PORT } from '../domain/ports/jwt.port';
import { JwtSigner } from './adapters/jwt.signer';

export const authProviders: Provider[] = [
  { provide: USERS_REPOSITORY, useClass: PrismaUserRepository },
  { provide: PASSWORD_HASHER, useClass: BcryptHasher },
  { provide: JWT_PORT, useClass: JwtSigner },
];
