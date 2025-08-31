import { PrismaService } from 'src/core/prisma/prisma.service';
import { MessagesRepositoryPort } from '../../domain/ports/messages-repository.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMessagesRepository implements MessagesRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async listRecent(limit: number) {
    const rows = await this.prisma.message.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return rows.map(({ id, text, createdAt, user }) => ({
      id,
      text,
      createdAt,
      userName: user.name,
    }));
  }

  async create(data: { userId: string; text: string }): Promise<{
    id: string;
    text: string;
    createdAt: Date;
    userName: string;
  }> {
    const { id, text, createdAt, user } = await this.prisma.message.create({
      data: { userId: data.userId, text: data.text },
      include: { user: { select: { name: true } } },
    });
    return { id, text, createdAt, userName: user.name };
  }
}
