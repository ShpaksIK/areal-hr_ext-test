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
import { CreatePositionDto, UpdatePositionDto } from 'src/dto/position.dto';
import {
  createPositionSchema,
  updatePositionSchema,
} from 'src/schemas/position.schema';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { PositionService } from './position.service';
import { HistoryService } from 'src/history/history.service';

@Controller('position')
export class PositionController {
  constructor(
    private positionService: PositionService,
    private historyService: HistoryService,
  ) {}

  @Get('/:positionId')
  async getById(@Param('positionId') positionId: number) {
    return await this.positionService.getPositionById(positionId);
  }

  @Get()
  async getAll() {
    return await this.positionService.getPositions();
  }

  @Post()
  @UsePipes(new ValidationPipe(createPositionSchema))
  async create(@Body() createPositionDto: CreatePositionDto) {
    const result = await this.positionService.createPosition(createPositionDto);
    return {
      message: 'Должность создана успешно',
      data: result,
    };
  }

  @Put()
  @UsePipes(new ValidationPipe(updatePositionSchema))
  async update(@Body() updatePositionDto: UpdatePositionDto) {
    const updatedPosition =
      await this.positionService.updatePosition(updatePositionDto);

    if (updatedPosition.data) {
      await this.historyService.createHistory({
        entity_type: 'position',
        entity_id: updatedPosition.data.id,
        changed_fields: updatedPosition.changed_fields,
      });
    }

    return updatedPosition.data;
  }

  @Delete('/:positionId')
  async delete(@Param('positionId') positionId: number) {
    return await this.positionService.deletePosition(positionId);
  }
}
