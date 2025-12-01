import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { OrganizationService } from './organization/organization.service';
import { OrganizationModule } from './organization/organization.module';
import { DepartmentModule } from './department/department.module';
import { PositionModule } from './position/position.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    DatabaseModule,
    OrganizationModule,
    DepartmentModule,
    PositionModule,
    HistoryModule,
  ],
  providers: [DatabaseService, OrganizationService],
})
export class AppModule {}
