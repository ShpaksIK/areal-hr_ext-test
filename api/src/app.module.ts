import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { OrganizationModule } from './organization/organization.module';
import { DepartmentModule } from './department/department.module';
import { PositionModule } from './position/position.module';
import { EmployeeModule } from './employee/employee.module';
import { FileModule } from './file/file.module';
import { HistoryModule } from './history/history.module';
import { EmploymentOperationModule } from './employment-operation/employment-operation.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule,
    OrganizationModule,
    DepartmentModule,
    PositionModule,
    EmployeeModule,
    FileModule,
    HistoryModule,
    EmploymentOperationModule,
    UserModule,
  ],
  providers: [DatabaseService],
})
export class AppModule {}
