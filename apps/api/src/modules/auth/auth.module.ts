import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { AuthController } from './presentation/http/auth.controller';
import { authProviders } from './infrastructure/providers';
import { RegisterUserUseCase } from './application/use-cases/register-user.usecase';
import { LoginUserUseCase } from './application/use-cases/login-user.usecase';
import { GetMeUseCase } from './application/use-cases/get-me.usecase';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...authProviders,
    RegisterUserUseCase,
    LoginUserUseCase,
    GetMeUseCase,
  ],
  exports: [],
})
export class AuthModule {}
