import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateFileDto, File, UpdateFileDto } from 'src/dto/file.dto';
import { renameFields } from 'src/helpers/rename-fields';

@Injectable()
export class FileService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getFileById(id: number): Promise<File> {
    const query = `
          SELECT *
          FROM "file"
          WHERE id = $1;
        `;
    const values = [id];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getFiles(): Promise<File[]> {
    const query = `
          SELECT *
          FROM "file";
        `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createFile(fileDto: CreateFileDto): Promise<File> {
    const query = `
          INSERT INTO "file" (name, employee_id)
          VALUES ($1, $2)
          RETURNING *;
        `;
    const values = [fileDto.name, fileDto.employee_id];

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
          RETURNING id, deleted_at;
        `;
    const values = [fileId];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
}
