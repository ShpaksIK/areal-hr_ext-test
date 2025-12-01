import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService, HistoryService],
})
export class DepartmentModule {}
