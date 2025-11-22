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
} from 'src/schemas/create-organization.schema';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

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
    return await this.organizationService.updateOrganization(
      updateOrganizationDto,
    );
  }

  @Delete('/:organizationId')
  async delete(@Param('organizationId') organizationId: number) {
    return await this.organizationService.deleteOrganization(organizationId);
  }
}
