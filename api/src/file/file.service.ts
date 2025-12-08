import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { File, UpdateFileDto, UploadFileDto } from 'src/dto/file.dto';
import { renameFields } from 'src/helpers/rename-fields';
import { unlink } from 'fs';

@Injectable()
export class FileService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }

    const fileExtension = extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const filePath = join(this.uploadDir, uniqueFileName);

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);

      writeStream.write(file.buffer);
      writeStream.end();

      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', () => {
        reject(new InternalServerErrorException('Ошибка при сохранении файла'));
      });
    });
  }

  async getFileById(id: number): Promise<File> {
    const query = `
          SELECT id, name, employee_id, original_name, mime_type, size
          FROM "file"
          WHERE id = $1;
        `;
    const values = [id];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getFiles(): Promise<File[]> {
    const query = `
          SELECT id, name, employee_id, original_name, mime_type, size
          FROM "file";
        `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createFile(uploadFileDto: UploadFileDto): Promise<File> {
    const employeeDir = join(
      this.uploadDir,
      uploadFileDto.employee_id.toString(),
    );
    if (!existsSync(employeeDir)) {
      mkdirSync(employeeDir, { recursive: true });
    }

    const filePath = await this.saveFile(uploadFileDto.file);

    const query = `
          INSERT INTO "file" (name, employee_id, file_path, original_name, mime_type, size)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING name, employee_id, file_path, original_name, mime_type, size;
        `;
    const values = [
      uploadFileDto.name,
      uploadFileDto.employee_id,
      filePath,
      uploadFileDto.file.originalname,
      uploadFileDto.file.mimetype,
      uploadFileDto.file.size,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateFile(
    fileDto: UpdateFileDto,
  ): Promise<{ data: File | null; changed_fields: string }> {
    const dtoKeys = Object.keys(fileDto);

    const setKeys = dtoKeys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const valuesKeys = Object.values(fileDto);

    const query = `
          UPDATE "file"
          SET ${setKeys}, updated_at = current_timestamp
          WHERE id = $1
          RETURNING *;
        `;
    const values = [fileDto.id, ...valuesKeys];

    const result = await this.pool.query(query, values);
    const renamedFields = JSON.stringify(renameFields(dtoKeys));

    return {
      data: result.rows[0] || null,
      changed_fields: renamedFields,
    };
  }

  async deleteFile(fileId: number) {
    const query = `
          UPDATE "file"
          SET deleted_at = current_timestamp
          WHERE id = $1
          RETURNING id, file_path, deleted_at;
        `;
    const values = [fileId];

    const result = await this.pool.query(query, values);

    await unlink(result.rows[0].file_path, (error) => {
      console.error('Ошибка удалния файла:', error);
    });

    return result.rows[0];
  }
}
