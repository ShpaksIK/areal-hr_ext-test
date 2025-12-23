import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { HistoryModule } from 'src/history/history.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HistoryModule, AuthModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
