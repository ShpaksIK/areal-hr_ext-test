import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [FileController],
  providers: [FileService, HistoryService],
})
export class FileModule {}
