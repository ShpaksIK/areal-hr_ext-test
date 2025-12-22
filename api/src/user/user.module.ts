import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HistoryService } from 'src/history/history.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, HistoryService, AuthService],
  exports: [UserService],
})
export class UserModule {}
