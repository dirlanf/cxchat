import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request, { agent as supertestAgent } from 'supertest';
import type { Server } from 'http';

import { AppModule } from 'src/app/app.module';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ensureTestDatabase } from './utils/create-test-db';

describe('Auth E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: Server;

  beforeAll(async () => {
    await ensureTestDatabase();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "Message" RESTART IDENTITY CASCADE`,
    );
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`,
    );
    await app.close();
  });

  it('POST /auth/register - should create a user (201)', async () => {
    const email = `alice+${Date.now()}@example.com`;

    type RegisterResponse = { id: string; name: string; email: string };

    const res = await request(httpServer)
      .post('/auth/register')
      .send({ name: 'Alice', email, password: 'secret123' })
      .expect(201);

    const body = res.body as unknown as RegisterResponse;
    expect(body).toEqual(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(String),
        name: 'Alice',
        email,
      }),
    );
  });

  it('POST /auth/login - should login and set cookie (200)', async () => {
    const email = `bob+${Date.now()}@example.com`;
    const password = 'secret123';

    await request(httpServer)
      .post('/auth/register')
      .send({ name: 'Bob', email, password })
      .expect(201);

    const res = await request(httpServer)
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    const cookies = res.get('set-cookie');
    expect(Array.isArray(cookies) && cookies.length > 0).toBeTruthy();
  });

  it('GET /auth/me - should return user (200) when authenticated by cookie', async () => {
    const email = `carol+${Date.now()}@example.com`;
    const password = 'secret123';

    await request(httpServer)
      .post('/auth/register')
      .send({ name: 'Carol', email, password })
      .expect(201);

    const agent = supertestAgent(httpServer);

    await agent.post('/auth/login').send({ email, password }).expect(200);

    type MeResponse = { id: string; name: string; email: string };

    const me = await agent.get('/auth/me').expect(200);
    const body = me.body as unknown as MeResponse;

    expect(body).toEqual(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(String),
        name: 'Carol',
        email,
      }),
    );
  });

  it('POST /auth/register - should return 409 when email already exists', async () => {
    const email = `duplicate+${Date.now()}@example.com`;
    const userData = { name: 'Duplicate', email, password: 'secret123' };

    await request(httpServer).post('/auth/register').send(userData).expect(201);

    await request(httpServer).post('/auth/register').send(userData).expect(409);
  });

  it('POST /auth/login - should return 401 for invalid credentials', async () => {
    await request(httpServer)
      .post('/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'wrongpassword' })
      .expect(401);
  });
});
