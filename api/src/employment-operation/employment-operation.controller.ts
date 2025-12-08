import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { EmploymentOperationService } from './employment-operation.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { CreateEmploymentOperationDto } from 'src/dto/employment-operation.dto';
import { createEmploymentOperationSchema } from 'src/schemas/employment-operation.schema';
import { HistoryService } from 'src/history/history.service';
import { renameFields } from 'src/helpers/rename-fields';

@Controller('employment-operation')
export class EmploymentOperationController {
  constructor(
    private employmentOperationService: EmploymentOperationService,
    private historyService: HistoryService,
  ) {}

  @Get('/:employmentOperationId')
  async getById(@Param('employmentOperationId') employmentOperationId: number) {
    return await this.employmentOperationService.getEmploymentOperationById(
      employmentOperationId,
    );
  }

  @Get()
  async getAll() {
    return await this.employmentOperationService.getEmploymentOperations();
  }

  @Post()
  @UsePipes(new ValidationPipe(createEmploymentOperationSchema))
  async create(@Body() createDepartmentDto: CreateEmploymentOperationDto) {
    const createdEmploymentOperation =
      await this.employmentOperationService.createEmploymentOperation(
        createDepartmentDto,
      );

    const dtoKeys = Object.keys(createDepartmentDto);
    const renamedFields = JSON.stringify(renameFields(dtoKeys));

    if (createdEmploymentOperation) {
      await this.historyService.createHistory({
        entity_type: 'employmentOperation',
        entity_id: createdEmploymentOperation.id,
        changed_fields: renamedFields,
      });
    }
    return {
      message: 'Кадровая операция создана успешно',
      data: createdEmploymentOperation,
    };
  }

  @Delete('/:employmentOperationId')
  async delete(@Param('employmentOperationId') employmentOperationId: number) {
    return await this.employmentOperationService.deleteEmploymentOperation(
      employmentOperationId,
    );
  }

  @Delete('/all')
  async deleteAll() {
    return await this.employmentOperationService.deleteEmploymentOperations();
  }
}
