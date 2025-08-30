import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as UserRepository from '../../domain/ports/user-repository.port';

export type GetMeOutput = { id: string; name: string; email: string };

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(UserRepository.USERS_REPOSITORY)
    private readonly users: UserRepository.UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<GetMeOutput> {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
