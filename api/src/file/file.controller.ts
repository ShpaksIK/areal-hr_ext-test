import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { FileService } from './file.service';
import { createFileSchema, updateFileSchema } from 'src/schemas/file.schema';
import {
  CreateFileDto,
  File,
  UpdateFileDto,
  UploadFileDto,
} from 'src/dto/file.dto';
import { HistoryService } from 'src/history/history.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseDto } from 'src/dto/response.dto';
import { ParseIntPipe } from 'src/validation/parse-int.pipe';

@Controller('file')
export class FileController {
  constructor(
    private fileService: FileService,
    private historyService: HistoryService,
  ) {}

  @Get('/:fileId')
  async getById(
    @Param('fileId', new ParseIntPipe()) fileId: number,
  ): Promise<ResponseDto<File | null>> {
    const data = await this.fileService.getFileById(fileId);

    if (!data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    const response: ResponseDto<File> = {
      success: true,
      message: 'Успешно',
      data: data,
    };
    return response;
  }

  @Get()
  async getAll(): Promise<ResponseDto<File[]>> {
    const data = await this.fileService.getFiles();

    const response: ResponseDto<File[]> = {
      success: true,
      message: 'Успешно',
      data: data,
    };

    return response;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
    @Body(new ValidationPipe(createFileSchema)) createFileDto: CreateFileDto,
  ): Promise<ResponseDto<File>> {
    const uploadFileDto: UploadFileDto = {
      ...createFileDto,
      file,
    };

    const createdFile = await this.fileService.createFile(uploadFileDto);

    const response: ResponseDto<File> = {
      success: true,
      message: 'Успешно',
      data: createdFile,
    };

    return response;
  }

  @Put()
  @UsePipes(new ValidationPipe(updateFileSchema))
  async update(
    @Body() updateFileDto: UpdateFileDto,
  ): Promise<ResponseDto<File | null>> {
    const updatedFile = await this.fileService.updateFile(updateFileDto);

    if (!updatedFile.data) {
      const errorResponse: ResponseDto<null> = {
        success: false,
        message: 'Запись не найдена',
      };

      throw new NotFoundException(errorResponse);
    }

    await this.historyService.createHistory({
      user_id: updateFileDto.user_id,
      entity_type: 'file',
      entity_id: updatedFile.data.id,
      changed_fields: updatedFile.changed_fields,
    });

    const response: ResponseDto<File> = {
      success: true,
      message: 'Успешно',
      data: updatedFile.data,
    };

    return response;
  }

  @Delete('/:fileId')
  async delete(
    @Param('fileId', new ParseIntPipe()) fileId: number,
  ): Promise<ResponseDto<File>> {
    const deletedFile = await this.fileService.deleteFile(fileId);

    const response: ResponseDto<File> = {
      success: true,
      message: 'Успешно',
      data: deletedFile,
    };

    return response;
  }
}
