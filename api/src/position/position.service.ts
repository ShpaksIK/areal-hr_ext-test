import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import {
  CreatePositionDto,
  Position,
  UpdatePositionDto,
} from 'src/dto/position.dto';
import { renameFields } from 'src/helpers/rename-fields';

@Injectable()
export class PositionService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getPositionById(id: number): Promise<Position> {
    const query = `
        SELECT *
        FROM "position"
        WHERE id = $1;
    `;
    const values = [id];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getPositions(): Promise<Position[]> {
    const query = `
        SELECT *
        FROM "position";
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createPosition(positionDto: CreatePositionDto): Promise<Position> {
    const query = `
        INSERT INTO "position" (name)
        VALUES ($1)
        RETURNING *;
    `;
    const values = [positionDto.name];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updatePosition(
    positionDto: UpdatePositionDto,
  ): Promise<{ data: Position | null; changed_fields: string }> {
    const dtoKeys = Object.keys(positionDto);

    const setKeys = dtoKeys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const valuesKeys = Object.values(positionDto);

    const query = `
        UPDATE "position"
        SET ${setKeys}, updated_at = current_timestamp
        WHERE id = $1
        RETURNING *;
    `;
    const values = [positionDto.id, ...valuesKeys];

    const result = await this.pool.query(query, values);
    const renamedFields = JSON.stringify(renameFields(dtoKeys));

    return {
      data: result.rows[0] || null,
      changed_fields: renamedFields,
    };
  }

  async deletePosition(positionId: number) {
    const query = `
        UPDATE "position"
        SET deleted_at = current_timestamp
        WHERE id = $1
        RETURNING id, deleted_at;
    `;
    const values = [positionId];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
}
