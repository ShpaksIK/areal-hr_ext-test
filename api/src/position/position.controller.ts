import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import {
  CreatePositionDto,
  Position,
  UpdatePositionDto,
} from 'src/dto/position.dto';
import {
  createPositionSchema,
  updatePositionSchema,
} from 'src/schemas/position.schema';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { PositionService } from './position.service';
import { HistoryService } from 'src/history/history.service';
import { ResponseDto } from 'src/dto/response.dto';
import { ParseIntPipe } from 'src/validation/parse-int.pipe';

@Controller('position')
export class PositionController {
  constructor(
    private positionService: PositionService,
    private historyService: HistoryService,
  ) {}

  @Get('/:positionId')
  async getById(
    @Param('positionId', new ParseIntPipe()) positionId: number,
  ): Promise<ResponseDto<Position | null>> {
    const data = await this.positionService.getPositionById(positionId);

    if (!data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    const response: ResponseDto<Position> = {
      success: true,
      message: 'Успешно',
      data: data,
    };
    return response;
  }

  @Get()
  async getAll(): Promise<ResponseDto<Position[]>> {
    const data = await this.positionService.getPositions();

    const response: ResponseDto<Position[]> = {
      success: true,
      message: 'Успешно',
      data: data,
    };

    return response;
  }

  @Post()
  @UsePipes(new ValidationPipe(createPositionSchema))
  async create(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<ResponseDto<Position>> {
    const createdPosition =
      await this.positionService.createPosition(createPositionDto);

    const response: ResponseDto<Position> = {
      success: true,
      message: 'Успешно',
      data: createdPosition,
    };

    return response;
  }

  @Put()
  @UsePipes(new ValidationPipe(updatePositionSchema))
  async update(
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<ResponseDto<Position | null>> {
    const updatedPosition =
      await this.positionService.updatePosition(updatePositionDto);

    if (!updatedPosition.data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    await this.historyService.createHistory({
      user_id: updatePositionDto.user_id,
      entity_type: 'position',
      entity_id: updatedPosition.data.id,
      changed_fields: updatedPosition.changed_fields,
    });

    const response: ResponseDto<Position> = {
      success: true,
      message: 'Успешно',
      data: updatedPosition.data,
    };

    return response;
  }

  @Delete('/:positionId')
  async delete(
    @Param('positionId', new ParseIntPipe()) positionId: number,
  ): Promise<ResponseDto<Position>> {
    const deletedPosition =
      await this.positionService.deletePosition(positionId);

    const response: ResponseDto<Position> = {
      success: true,
      message: 'Успешно',
      data: deletedPosition,
    };

    return response;
  }
}
