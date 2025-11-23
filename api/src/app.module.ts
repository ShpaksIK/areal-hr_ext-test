import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { OrganizationService } from './organization/organization.service';
import { OrganizationModule } from './organization/organization.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [DatabaseModule, OrganizationModule, DepartmentModule],
  providers: [DatabaseService, OrganizationService],
})
export class AppModule {}
