import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { Historty } from 'src/dto/history.dto';
import { ResponseDto } from 'src/dto/response.dto';
import { ParseIntPipe } from 'src/validation/parse-int.pipe';

@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get('/:historyId')
  async getById(
    @Param('historyId', new ParseIntPipe()) historyId: number,
  ): Promise<ResponseDto<Historty | null>> {
    const data = await this.historyService.getHistoryById(historyId);

    if (!data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    const response: ResponseDto<Historty> = {
      success: true,
      message: 'Успешно',
      data: data,
    };
    return response;
  }

  @Get()
  async getAll(): Promise<ResponseDto<Historty[]>> {
    const data = await this.historyService.getHistories();

    const response: ResponseDto<Historty[]> = {
      success: true,
      message: 'Успешно',
      data: data,
    };

    return response;
  }

  @Delete('/:historyId')
  async delete(
    @Param('historyId', new ParseIntPipe()) historyId: number,
  ): Promise<ResponseDto<Historty>> {
    const deletedHistory = await this.historyService.deleteHistory(historyId);

    const response: ResponseDto<Historty> = {
      success: true,
      message: 'Успешно',
      data: deletedHistory,
    };

    return response;
  }

  @Delete('/all')
  async deleteAll(): Promise<ResponseDto<Historty[]>> {
    const deletedHistories = await this.historyService.deleteHistories();

    const response: ResponseDto<Historty[]> = {
      success: true,
      message: 'Успешно',
      data: deletedHistories,
    };

    return response;
  }
}
