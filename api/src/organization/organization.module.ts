import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { HistoryService } from 'src/history/history.service';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, HistoryService],
})
export class OrganizationModule {}
