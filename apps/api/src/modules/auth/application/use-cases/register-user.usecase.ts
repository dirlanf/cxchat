import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as UserRepository from '../../domain/ports/user-repository.port';
import * as PasswordHasher from '../../domain/ports/password-hasher.port';

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};
export type RegisterUserOutput = { id: string; name: string; email: string };

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(UserRepository.USERS_REPOSITORY)
    private readonly userRepository: UserRepository.UserRepositoryPort,
    @Inject(PasswordHasher.PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher.PasswordHasherPort,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUserInput): Promise<RegisterUserOutput> {
    const exists = await this.userRepository.findByEmail(email);
    if (exists) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.passwordHasher.hash(password);
    return this.userRepository.create({
      email,
      name,
      passwordHash,
    });
  }
}
