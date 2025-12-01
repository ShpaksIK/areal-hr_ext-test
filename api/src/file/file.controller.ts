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
import { ValidationPipe } from 'src/validation/validation.pipe';
import { FileService } from './file.service';
import { createFileSchema, updateFileSchema } from 'src/schemas/file.schema';
import { CreateFileDto, UpdateFileDto } from 'src/dto/file.dto';
import { HistoryService } from 'src/history/history.service';

@Controller('file')
export class FileController {
  constructor(
    private fileService: FileService,
    private historyService: HistoryService,
  ) {}

  @Get('/:fileId')
  async getById(@Param('fileId') fileId: number) {
    return await this.fileService.getFileById(fileId);
  }

  @Get()
  async getAll() {
    return await this.fileService.getFiles();
  }

  @Post()
  @UsePipes(new ValidationPipe(createFileSchema))
  async create(@Body() createFileDto: CreateFileDto) {
    const result = await this.fileService.createFile(createFileDto);
    return {
      message: 'Файл создан успешно',
      data: result,
    };
  }

  @Put()
  @UsePipes(new ValidationPipe(updateFileSchema))
  async update(@Body() updateFileDto: UpdateFileDto) {
    const updatedFile = await this.fileService.updateFile(updateFileDto);

    if (updatedFile.data) {
      await this.historyService.createHistory({
        user_id: null,
        entity_type: 'employee',
        entity_id: updatedFile.data.id,
        changed_fields: updatedFile.changed_fields,
      });
    }

    return updatedFile.data;
  }

  @Delete('/:fileId')
  async delete(@Param('fileId') fileId: number) {
    return await this.fileService.deleteFile(fileId);
  }
}
