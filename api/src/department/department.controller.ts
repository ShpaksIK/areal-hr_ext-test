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

@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

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
    return await this.departmentService.updateDepartment(updateDepartmentDto);
  }

  @Delete('/:departmentId')
  async delete(@Param('departmentId') departmentId: number) {
    return await this.departmentService.deleteDepartment(departmentId);
  }
}
