import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from 'src/dto/auth.dto';
import * as argon2 from 'argon2';
import { User } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async validateUser(login: string, password: string): Promise<User> {
    const user = await this.userService.getByLogin(login);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.verifyPassword(
      user.password_hash,
      password,
    );

    if (!isPasswordValid) {
      return null;
    }

    delete user.password_hash;
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
        hashLength: 32,
      });
      return hash;
    } catch {
      throw new Error('Ошибка при хешировании пароля');
    }
  }

  async verifyPassword(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; sessionToken: string }> {
    const user = await this.validateUser(loginDto.login, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const sessionToken = await this.generateSessionToken(user);

    return {
      user,
      sessionToken,
    };
  }

  private async generateSessionToken(user: any): Promise<string> {
    const timestamp = Date.now();
    const data = `${user.id}:${user.login}:${timestamp}`;

    return Buffer.from(data).toString('base64');
  }

  async validateSessionToken(token: string): Promise<any> {
    try {
      const decoded = Buffer.from(token, 'base64').toString('ascii');
      const decodedData = decoded.split(':');
      const userId = decodedData[0];
      const timestamp = decodedData[2];

      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 часа

      if (tokenAge > maxAge) {
        return null;
      }

      return await this.userService.getById(Number(userId));
    } catch {
      return null;
    }
  }
}
