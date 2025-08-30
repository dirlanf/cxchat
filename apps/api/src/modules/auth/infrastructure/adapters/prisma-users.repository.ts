import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
  }
  async create(data: { name: string; email: string; passwordHash: string }) {
    return this.prisma.user.create({
      data,
      select: { id: true, name: true, email: true },
    });
  }
}
