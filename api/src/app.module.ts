import { Module } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { OrganizationService } from './organization/organization.service';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [DatabaseModule, OrganizationModule],
  providers: [DatabaseService, OrganizationService],
})
export class AppModule {}
