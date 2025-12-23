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
import { DepartmentService } from './department.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from 'src/schemas/department.schema';
import {
  CreateDepartmentDto,
  Department,
  UpdateDepartmentDto,
} from 'src/dto/department.dto';
import { HistoryService } from 'src/history/history.service';
import { ResponseDto } from 'src/dto/response.dto';
import { ParseIntPipe } from 'src/validation/parse-int.pipe';
import { SessionAuthGuard } from 'src/guard/session-auth.guard';

@Controller('department')
export class DepartmentController {
  constructor(
    private departmentService: DepartmentService,
    private historyService: HistoryService,
  ) {}

  @Get('/:departmentId')
  @UseGuards(SessionAuthGuard)
  async getById(
    @Param('departmentId', new ParseIntPipe()) departmentId: number,
  ): Promise<ResponseDto<Department | null>> {
    const data = await this.departmentService.getDepartmentById(departmentId);

    if (!data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    const response: ResponseDto<Department> = {
      success: true,
      message: 'Успешно',
      data: data,
    };

    return response;
  }

  @Get()
  @UseGuards(SessionAuthGuard)
  async getAll(): Promise<ResponseDto<Department[]>> {
    const data = await this.departmentService.getDepartments();

    const response: ResponseDto<Department[]> = {
      success: true,
      message: 'Успешно',
      data: data,
    };

    return response;
  }

  @Post()
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe(createDepartmentSchema))
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Req() req: any,
  ): Promise<ResponseDto<Department>> {
    const createdDepartment =
      await this.departmentService.createDepartment(createDepartmentDto);

    const response: ResponseDto<Department> = {
      success: true,
      message: 'Успешно',
      data: createdDepartment,
    };

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'department',
      entity_id: createdDepartment.id,
      changed_fields: '["Создано"]',
    });

    return response;
  }

  @Put()
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe(updateDepartmentSchema))
  async update(
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Req() req: any,
  ): Promise<ResponseDto<Department | null>> {
    const updatedDepartment =
      await this.departmentService.updateDepartment(updateDepartmentDto);

    if (!updatedDepartment.data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'department',
      entity_id: updatedDepartment.data.id,
      changed_fields: updatedDepartment.changed_fields,
    });

    const response: ResponseDto<Department> = {
      success: true,
      message: 'Успешно',
      data: updatedDepartment.data,
    };

    return response;
  }

  @Delete('/:departmentId')
  @UseGuards(SessionAuthGuard)
  async delete(
    @Param('departmentId', new ParseIntPipe()) departmentId: number,
    @Req() req: any,
  ): Promise<ResponseDto<Department>> {
    const deletedDepartment =
      await this.departmentService.deleteDepartment(departmentId);

    const response: ResponseDto<Department> = {
      success: true,
      message: 'Успешно',
      data: deletedDepartment,
    };

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'department',
      entity_id: departmentId,
      changed_fields: '["Удалено"]',
    });

    return response;
  }
}
