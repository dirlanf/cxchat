import * as UserRepository from '../../domain/ports/user-repository.port';
import * as PasswordHasher from '../../domain/ports/password-hasher.port';
import * as Jwt from '../../domain/ports/jwt.port';
import { Inject, UnauthorizedException } from '@nestjs/common';

export type LoginUserInput = { email: string; password: string };
export type LoginUserOutput = {
  access_token: string;
  user: { id: string; name: string; email: string };
};

export class LoginUserUseCase {
  constructor(
    @Inject(UserRepository.USERS_REPOSITORY)
    private readonly userRepository: UserRepository.UserRepositoryPort,
    @Inject(PasswordHasher.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher.PasswordHasherPort,
    @Inject(Jwt.JWT_PORT)
    private readonly jwt: Jwt.JwtPort,
  ) {}

  async execute({ email, password }: LoginUserInput): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await this.passwordHasher.compare(
      password,
      user.passwordHash,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.jwt.signAccess({ sub: user.id });
    return {
      access_token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
