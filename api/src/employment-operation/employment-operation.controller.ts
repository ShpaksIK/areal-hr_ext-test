import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { EmploymentOperationService } from './employment-operation.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import {
  CreateEmploymentOperationDto,
  EmploymentOperation,
} from 'src/dto/employment-operation.dto';
import { createEmploymentOperationSchema } from 'src/schemas/employment-operation.schema';
import { HistoryService } from 'src/history/history.service';
import { renameFields } from 'src/helpers/rename-fields';
import { ResponseDto } from 'src/dto/response.dto';
import { ParseIntPipe } from 'src/validation/parse-int.pipe';

@Controller('employment-operation')
export class EmploymentOperationController {
  constructor(
    private employmentOperationService: EmploymentOperationService,
    private historyService: HistoryService,
  ) {}

  @Get('/:employmentOperationId')
  async getById(
    @Param('employmentOperationId', new ParseIntPipe())
    employmentOperationId: number,
  ): Promise<ResponseDto<EmploymentOperation | null>> {
    const data =
      await this.employmentOperationService.getEmploymentOperationById(
        employmentOperationId,
      );

    if (!data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    const response: ResponseDto<EmploymentOperation> = {
      success: true,
      message: 'Успешно',
      data: data,
    };
    return response;
  }

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

    const dtoKeys = Object.keys(createDepartmentDto);
    const renamedFields = JSON.stringify(renameFields(dtoKeys));

    await this.historyService.createHistory({
      entity_type: 'employmentOperation',
      entity_id: createdEmploymentOperation.id,
      changed_fields: renamedFields,
    });

    const response: ResponseDto<EmploymentOperation> = {
      success: true,
      message: 'Успешно',
      data: createdEmploymentOperation,
    };

    return response;
  }

  @Delete('/:employmentOperationId')
  async delete(
    @Param('employmentOperationId', new ParseIntPipe())
    employmentOperationId: number,
  ): Promise<ResponseDto<EmploymentOperation>> {
    const deletedEmploymentOperation =
      await this.employmentOperationService.deleteEmploymentOperation(
        employmentOperationId,
      );

    const response: ResponseDto<EmploymentOperation> = {
      success: true,
      message: 'Успешно',
      data: deletedEmploymentOperation,
    };

    return response;
  }

  @Delete('/all')
  async deleteAll(): Promise<ResponseDto<EmploymentOperation[]>> {
    const deletedEmploymentOperations =
      await this.employmentOperationService.deleteEmploymentOperations();

    const response: ResponseDto<EmploymentOperation[]> = {
      success: true,
      message: 'Успешно',
      data: deletedEmploymentOperations,
    };

    return response;
  }
}
