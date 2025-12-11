import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [UserController],
  providers: [UserService, HistoryService],
})
export class UserModule {}
