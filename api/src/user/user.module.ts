import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HistoryModule } from 'src/history/history.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HistoryModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
