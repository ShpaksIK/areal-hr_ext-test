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
import { SessionAuthGuard } from 'src/guard/session-auth.guard';

@Controller('position')
export class PositionController {
  constructor(
    private positionService: PositionService,
    private historyService: HistoryService,
  ) {}

  @Get('/:positionId')
  @UseGuards(SessionAuthGuard)
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
  @UseGuards(SessionAuthGuard)
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
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe(createPositionSchema))
  async create(
    @Body() createPositionDto: CreatePositionDto,
    @Req() req: any,
  ): Promise<ResponseDto<Position>> {
    const createdPosition =
      await this.positionService.createPosition(createPositionDto);

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'position',
      entity_id: createdPosition.id,
      changed_fields: '["Создано"]',
    });

    const response: ResponseDto<Position> = {
      success: true,
      message: 'Успешно',
      data: createdPosition,
    };

    return response;
  }

  @Put()
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe(updatePositionSchema))
  async update(
    @Body() updatePositionDto: UpdatePositionDto,
    @Req() req: any,
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
      user_id: req.user.id,
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
  @UseGuards(SessionAuthGuard)
  async delete(
    @Param('positionId', new ParseIntPipe()) positionId: number,
    @Req() req: any,
  ): Promise<ResponseDto<Position>> {
    const deletedPosition =
      await this.positionService.deletePosition(positionId);

    await this.historyService.createHistory({
      user_id: req.user.id,
      entity_type: 'position',
      entity_id: positionId,
      changed_fields: '["Удалено"]',
    });

    const response: ResponseDto<Position> = {
      success: true,
      message: 'Успешно',
      data: deletedPosition,
    };

    return response;
  }
}
