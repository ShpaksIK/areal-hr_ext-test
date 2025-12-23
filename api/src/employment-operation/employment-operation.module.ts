import { Module } from '@nestjs/common';
import { EmploymentOperationController } from './employment-operation.controller';
import { EmploymentOperationService } from './employment-operation.service';
import { HistoryModule } from 'src/history/history.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HistoryModule, AuthModule],
  controllers: [EmploymentOperationController],
  providers: [EmploymentOperationService],
})
export class EmploymentOperationModule {}
