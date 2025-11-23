import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { OrganizationService } from './organization/organization.service';
import { OrganizationModule } from './organization/organization.module';
import { DepartmentModule } from './department/department.module';
import { PositionModule } from './position/position.module';

@Module({
  imports: [
    DatabaseModule,
    OrganizationModule,
    DepartmentModule,
    PositionModule,
  ],
  providers: [DatabaseService, OrganizationService],
})
export class AppModule {}
