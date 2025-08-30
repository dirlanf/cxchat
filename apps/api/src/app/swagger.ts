import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const cfg = new DocumentBuilder()
    .setTitle('CX Chat API')
    .setDescription('Auth + Chat (JWT cookie HttpOnly)')
    .setVersion('1.0.0')
    .addCookieAuth('access_token')
    .build();

  const doc = SwaggerModule.createDocument(app, cfg);
  SwaggerModule.setup('/doc', app, doc);
}
