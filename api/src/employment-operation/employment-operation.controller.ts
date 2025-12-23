import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EmploymentOperationService } from './employment-operation.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import {
  CreateEmploymentOperationDto,
  EmploymentOperation,
} from 'src/dto/employment-operation.dto';
import { createEmploymentOperationSchema } from 'src/schemas/employment-operation.schema';
import { ResponseDto } from 'src/dto/response.dto';
import { SessionAuthGuard } from 'src/guard/session-auth.guard';
import { HistoryService } from 'src/history/history.service';

@Controller('employment-operation')
export class EmploymentOperationController {
  constructor(
    private employmentOperationService: EmploymentOperationService,
    private historyService: HistoryService,
  ) {}

  @Get()
  @UseGuards(SessionAuthGuard)
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
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe(createEmploymentOperationSchema))
  async create(
    @Body() createDepartmentDto: CreateEmploymentOperationDto,
    @Req() req: any,
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

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'employmentOperation',
      entity_id: createdEmploymentOperation.id,
      changed_fields: '["Создано"]',
    });

    return response;
  }
}
