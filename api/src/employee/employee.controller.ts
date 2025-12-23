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
import { EmployeeService } from './employee.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from 'src/schemas/employee.schema';
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from 'src/dto/employee.dto';
import { HistoryService } from 'src/history/history.service';
import { ResponseDto } from 'src/dto/response.dto';
import { ParseIntPipe } from 'src/validation/parse-int.pipe';
import { SessionAuthGuard } from 'src/guard/session-auth.guard';

@Controller('employee')
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private historyService: HistoryService,
  ) {}

  @Get('/:employeeId')
  @UseGuards(SessionAuthGuard)
  async getById(
    @Param('employeeId', new ParseIntPipe()) employeeId: number,
  ): Promise<ResponseDto<Employee | null>> {
    const data = await this.employeeService.getEmployeeById(employeeId);

    if (!data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    const response: ResponseDto<Employee> = {
      success: true,
      message: 'Успешно',
      data: data,
    };
    return response;
  }

  @Get()
  @UseGuards(SessionAuthGuard)
  async getAll(): Promise<ResponseDto<Employee[]>> {
    const data = await this.employeeService.getEmployees();

    const response: ResponseDto<Employee[]> = {
      success: true,
      message: 'Успешно',
      data: data,
    };

    return response;
  }

  @Post()
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe(createEmployeeSchema))
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Req() req: any,
  ): Promise<ResponseDto<Employee>> {
    const createdEmployee =
      await this.employeeService.createEmployee(createEmployeeDto);

    const response: ResponseDto<Employee> = {
      success: true,
      message: 'Успешно',
      data: createdEmployee,
    };

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'employee',
      entity_id: createdEmployee.id,
      changed_fields: '["Создано"]',
    });

    return response;
  }

  @Put()
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe(updateEmployeeSchema))
  async update(
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Req() req: any,
  ): Promise<ResponseDto<Employee | null>> {
    const updatedEmployee =
      await this.employeeService.updateEmployee(updateEmployeeDto);

    if (!updatedEmployee.data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'employee',
      entity_id: updatedEmployee.data.id,
      changed_fields: updatedEmployee.changed_fields,
    });

    const response: ResponseDto<Employee> = {
      success: true,
      message: 'Успешно',
      data: updatedEmployee.data,
    };

    return response;
  }

  @Delete('/:employeeId')
  @UseGuards(SessionAuthGuard)
  async delete(
    @Param('employeeId', new ParseIntPipe()) employeeId: number,
    @Req() req: any,
  ): Promise<ResponseDto<Employee>> {
    const deletedEmployee =
      await this.employeeService.deleteEmployee(employeeId);

    const response: ResponseDto<Employee> = {
      success: true,
      message: 'Успешно',
      data: deletedEmployee,
    };

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'employee',
      entity_id: employeeId,
      changed_fields: '["Удалено"]',
    });

    return response;
  }
}
