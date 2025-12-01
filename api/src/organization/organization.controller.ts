import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from 'src/dto/organization.dto';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from 'src/schemas/organization.schema';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { OrganizationService } from './organization.service';
import { HistoryService } from 'src/history/history.service';

@Controller('organization')
export class OrganizationController {
  constructor(
    private organizationService: OrganizationService,
    private historyService: HistoryService,
  ) {}

  @Get('/:organizationId')
  async getById(@Param('organizationId') organizationId: number) {
    return await this.organizationService.getOrganizationById(organizationId);
  }

  @Get()
  async getAll() {
    return await this.organizationService.getOrganizations();
  }

  @Post()
  @UsePipes(new ValidationPipe(createOrganizationSchema))
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    const result = await this.organizationService.createOrganization(
      createOrganizationDto,
    );
    return {
      message: 'Организация создана успешно',
      data: result,
    };
  }

  @Put()
  @UsePipes(new ValidationPipe(updateOrganizationSchema))
  async update(@Body() updateOrganizationDto: UpdateOrganizationDto) {
    const updatedOrganization =
      await this.organizationService.updateOrganization(updateOrganizationDto);

    if (updatedOrganization.data) {
      await this.historyService.createHistory({
        user_id: null,
        entity_type: 'organization',
        entity_id: updatedOrganization.data.id,
        changed_fields: updatedOrganization.changed_fields,
      });
    }

    return updatedOrganization.data;
  }

  @Delete('/:organizationId')
  async delete(@Param('organizationId') organizationId: number) {
    return await this.organizationService.deleteOrganization(organizationId);
  }
}
