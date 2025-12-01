import { Module } from '@nestjs/common';
import { EmploymentOperationController } from './employment-operation.controller';
import { EmploymentOperationService } from './employment-operation.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [EmploymentOperationController],
  providers: [EmploymentOperationService, HistoryService],
})
export class EmploymentOperationModule {}
