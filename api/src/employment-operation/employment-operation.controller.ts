import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { EmploymentOperationService } from './employment-operation.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import {
  CreateEmploymentOperationDto,
  EmploymentOperation,
} from 'src/dto/employment-operation.dto';
import { createEmploymentOperationSchema } from 'src/schemas/employment-operation.schema';
import { ResponseDto } from 'src/dto/response.dto';

@Controller('employment-operation')
export class EmploymentOperationController {
  constructor(private employmentOperationService: EmploymentOperationService) {}

  @Get()
  async getAll(): Promise<ResponseDto<EmploymentOperation[]>> {
    const data =
      await this.employmentOperationService.getEmploymentOperations();

    const response: ResponseDto<EmploymentOperation[]> = {
      success: true,
      message: 'Успешно',
      data: data,
    };

    return response;
  }

  @Post()
  @UsePipes(new ValidationPipe(createEmploymentOperationSchema))
  async create(
    @Body() createDepartmentDto: CreateEmploymentOperationDto,
  ): Promise<ResponseDto<EmploymentOperation>> {
    const createdEmploymentOperation =
      await this.employmentOperationService.createEmploymentOperation(
        createDepartmentDto,
      );

    const response: ResponseDto<EmploymentOperation> = {
      success: true,
      message: 'Успешно',
      data: createdEmploymentOperation,
    };

    return response;
  }
}
