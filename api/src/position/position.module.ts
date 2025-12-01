import { Module } from '@nestjs/common';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [PositionController],
  providers: [PositionService, HistoryService],
})
export class PositionModule {}
