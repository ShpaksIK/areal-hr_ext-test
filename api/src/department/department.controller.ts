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

@Controller('department')
export class DepartmentController {
  constructor(
    private departmentService: DepartmentService,
    private historyService: HistoryService,
  ) {}

  @Get('/:departmentId')
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
  @UsePipes(new ValidationPipe(createDepartmentSchema))
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<ResponseDto<Department>> {
    const createdDepartment =
      await this.departmentService.createDepartment(createDepartmentDto);

    const response: ResponseDto<Department> = {
      success: true,
      message: 'Успешно',
      data: createdDepartment,
    };

    return response;
  }

  @Put()
  @UsePipes(new ValidationPipe(updateDepartmentSchema))
  async update(
    @Body() updateDepartmentDto: UpdateDepartmentDto,
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
  async delete(
    @Param('departmentId', new ParseIntPipe()) departmentId: number,
  ): Promise<ResponseDto<Department>> {
    const deletedDepartment =
      await this.departmentService.deleteDepartment(departmentId);

    const response: ResponseDto<Department> = {
      success: true,
      message: 'Успешно',
      data: deletedDepartment,
    };

    return response;
  }
}
