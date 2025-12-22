import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto } from 'src/dto/auth.dto';
import { ResponseDto } from 'src/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ResponseDto<AuthResponseDto>> {
    const { user, sessionToken } = await this.authService.login(loginDto);

    const response: ResponseDto<AuthResponseDto> = {
      success: true,
      message: 'Успешный вход',
      data: {
        ...user,
        sessionToken,
      },
    };

    return response;
  }

  @Post('logout')
  async logout(): Promise<ResponseDto<void>> {
    return {
      success: true,
      message: 'Успешный выход из системы',
      data: null,
    };
  }

  @Post('validate-session')
  async validateSession(
    @Body('token') token: string,
  ): Promise<ResponseDto<any>> {
    const user = await this.authService.validateSessionToken(token);

    if (!user) {
      return {
        success: false,
        message: 'Невалидный токен',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Токен валиден',
      data: user,
    };
  }
}
