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
import { EmployeeService } from './employee.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from 'src/schemas/employee.schema';
import { CreateEmployeeDto, UpdateEmployeeDto } from 'src/dto/employee.dto';
import { HistoryService } from 'src/history/history.service';

@Controller('employee')
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private historyService: HistoryService,
  ) {}

  @Get('/:employeeId')
  async getById(@Param('employeeId') employeeId: number) {
    return await this.employeeService.getEmployeeById(employeeId);
  }

  @Get()
  async getAll() {
    return await this.employeeService.getEmployees();
  }

  @Post()
  @UsePipes(new ValidationPipe(createEmployeeSchema))
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const result = await this.employeeService.createEmployee(createEmployeeDto);
    return {
      message: 'Сотрудник создан успешно',
      data: result,
    };
  }

  @Put()
  @UsePipes(new ValidationPipe(updateEmployeeSchema))
  async update(@Body() updateEmployeeDto: UpdateEmployeeDto) {
    const updatedEmployee =
      await this.employeeService.updateEmployee(updateEmployeeDto);

    if (updatedEmployee.data) {
      await this.historyService.createHistory({
        user_id: null,
        entity_type: 'employee',
        entity_id: updatedEmployee.data.id,
        changed_fields: updatedEmployee.changed_fields,
      });
    }

    return updatedEmployee.data;
  }

  @Delete('/:employeeId')
  async delete(@Param('employeeId') employeeId: number) {
    return await this.employeeService.deleteEmployee(employeeId);
  }
}
