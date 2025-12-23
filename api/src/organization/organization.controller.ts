import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
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
import { SessionAuthGuard } from 'src/guard/session-auth.guard';

@Controller('organization')
export class OrganizationController {
  constructor(
    private organizationService: OrganizationService,
    private historyService: HistoryService,
  ) {}

  @Get('/:organizationId')
  @UseGuards(SessionAuthGuard)
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
  @UseGuards(SessionAuthGuard)
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
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe(createOrganizationSchema))
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Req() req: any,
  ): Promise<ResponseDto<Organization>> {
    const createdOrganization =
      await this.organizationService.createOrganization(createOrganizationDto);

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'organization',
      entity_id: createdOrganization.id,
      changed_fields: '["Создано"]',
    });

    const response: ResponseDto<Organization> = {
      success: true,
      message: 'Успешно',
      data: createdOrganization,
    };

    return response;
  }

  @Put()
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe(updateOrganizationSchema))
  async update(
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @Req() req: any,
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
      user_id: req.user.id,
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
  @UseGuards(SessionAuthGuard)
  async delete(
    @Param('organizationId', new ParseIntPipe()) organizationId: number,
    @Req() req: any,
  ): Promise<ResponseDto<Organization>> {
    const deletedOrganization =
      await this.organizationService.deleteOrganization(organizationId);

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'organization',
      entity_id: deletedOrganization.id,
      changed_fields: '["Удалено"]',
    });

    const response: ResponseDto<Organization> = {
      success: true,
      message: 'Успешно',
      data: deletedOrganization,
    };

    return response;
  }
}
