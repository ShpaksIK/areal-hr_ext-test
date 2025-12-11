import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import {
  CreateOrganizationDto,
  Organization,
  UpdateOrganizationDto,
} from 'src/dto/organization.dto';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from 'src/schemas/organization.schema';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { OrganizationService } from './organization.service';
import { HistoryService } from 'src/history/history.service';
import { ResponseDto } from 'src/dto/response.dto';
import { ParseIntPipe } from 'src/validation/parse-int.pipe';

@Controller('organization')
export class OrganizationController {
  constructor(
    private organizationService: OrganizationService,
    private historyService: HistoryService,
  ) {}

  @Get('/:organizationId')
  async getById(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
  ): Promise<ResponseDto<Organization | null>> {
    const data =
      await this.organizationService.getOrganizationById(organizationId);

    if (!data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    const response: ResponseDto<Organization> = {
      success: true,
      message: 'Успешно',
      data: data,
    };
    return response;
  }

  @Get()
  async getAll(): Promise<ResponseDto<Organization[]>> {
    const data = await this.organizationService.getOrganizations();

    const response: ResponseDto<Organization[]> = {
      success: true,
      message: 'Успешно',
      data: data,
    };

    return response;
  }

  @Post()
  @UsePipes(new ValidationPipe(createOrganizationSchema))
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<ResponseDto<Organization>> {
    const createdOrganization =
      await this.organizationService.createOrganization(createOrganizationDto);

    const response: ResponseDto<Organization> = {
      success: true,
      message: 'Успешно',
      data: createdOrganization,
    };

    return response;
  }

  @Put()
  @UsePipes(new ValidationPipe(updateOrganizationSchema))
  async update(
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<ResponseDto<Organization | null>> {
    const updatedOrganization =
      await this.organizationService.updateOrganization(updateOrganizationDto);

    if (!updatedOrganization.data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    await this.historyService.createHistory({
      user_id: updateOrganizationDto.user_id,
      entity_type: 'organization',
      entity_id: updatedOrganization.data.id,
      changed_fields: updatedOrganization.changed_fields,
    });

    const response: ResponseDto<Organization> = {
      success: true,
      message: 'Успешно',
      data: updatedOrganization.data,
    };

    return response;
  }

  @Delete('/:organizationId')
  async delete(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
  ): Promise<ResponseDto<Organization>> {
    const deletedOrganization =
      await this.organizationService.deleteOrganization(organizationId);

    const response: ResponseDto<Organization> = {
      success: true,
      message: 'Успешно',
      data: deletedOrganization,
    };

    return response;
  }
}
