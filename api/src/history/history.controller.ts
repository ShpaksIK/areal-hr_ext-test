import { Controller, Delete, Get, Param } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get('/:historyId')
  async getById(@Param('historyId') historyId: number) {
    return await this.historyService.getHistoryById(historyId);
  }

  @Get()
  async getAll() {
    return await this.historyService.getHistories();
  }

  @Delete('/:historyId')
  async delete(@Param('historyId') historyId: number) {
    return await this.historyService.deleteHistory(historyId);
  }

  @Delete('/all')
  async deleteAll() {
    return await this.historyService.deleteHistories();
  }
}
