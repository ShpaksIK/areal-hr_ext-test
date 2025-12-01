import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, HistoryService],
})
export class EmployeeModule {}
