import { Module } from '@nestjs/common';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { HistoryModule } from 'src/history/history.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HistoryModule, AuthModule],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
