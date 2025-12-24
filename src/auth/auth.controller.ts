import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!email || !password) {
      throw new BadRequestException('Email e senha são obrigatórios.');
    }

    return this.auth.login(email, password);
  }

  @Post('bootstrap')
  bootstrap() {
    return this.auth.bootstrapMaster();
  }
}
