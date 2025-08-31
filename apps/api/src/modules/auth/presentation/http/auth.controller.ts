import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GetMeUseCase } from '../../application/use-cases/get-me.usecase';
import { LoginUserUseCase } from '../../application/use-cases/login-user.usecase';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import express from 'express';
import { JwtGuard } from './guards/jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly getMe: GetMeUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.registerUser.execute(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { access_token, user } = await this.loginUser.execute(dto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    return { access_token, user };
  }

  @Get('me')
  @ApiCookieAuth('access_token')
  @UseGuards(JwtGuard)
  async me(
    @Res({ passthrough: true })
    res: express.Response & { req: { userId: string } },
  ) {
    const { userId } = res.req;
    return this.getMe.execute(userId);
  }
}
