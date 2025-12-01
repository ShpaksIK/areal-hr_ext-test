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
import { DepartmentService } from './department.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from 'src/schemas/department.schema';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from 'src/dto/department.dto';
import { HistoryService } from 'src/history/history.service';

@Controller('department')
export class DepartmentController {
  constructor(
    private departmentService: DepartmentService,
    private historyService: HistoryService,
  ) {}

  @Get('/:departmentId')
  async getById(@Param('departmentId') departmentId: number) {
    return await this.departmentService.getDepartmentById(departmentId);
  }

  @Get()
  async getAll() {
    return await this.departmentService.getDepartments();
  }

  @Post()
  @UsePipes(new ValidationPipe(createDepartmentSchema))
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const result =
      await this.departmentService.createDepartment(createDepartmentDto);
    return {
      message: 'Отдел создан успешно',
      data: result,
    };
  }

  @Put()
  @UsePipes(new ValidationPipe(updateDepartmentSchema))
  async update(@Body() updateDepartmentDto: UpdateDepartmentDto) {
    const updatedDepartment =
      await this.departmentService.updateDepartment(updateDepartmentDto);

    if (updatedDepartment.data) {
      await this.historyService.createHistory({
        user_id: null,
        entity_type: 'department',
        entity_id: updatedDepartment.data.id,
        changed_fields: updatedDepartment.changed_fields,
      });
    }

    return updatedDepartment.data;
  }

  @Delete('/:departmentId')
  async delete(@Param('departmentId') departmentId: number) {
    return await this.departmentService.deleteDepartment(departmentId);
  }
}
