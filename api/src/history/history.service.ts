import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateHistortyDto, Historty } from 'src/dto/history.dto';

@Injectable()
export class HistoryService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getHistoryById(id: number): Promise<Historty> {
    const query = `
              SELECT *
              FROM "history"
              WHERE id = $1;
            `;
    const values = [id];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getHistories(): Promise<Historty[]> {
    const query = `
              SELECT *
              FROM "history";
            `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createHistory(historyDto: CreateHistortyDto): Promise<Historty> {
    const query = `
              INSERT INTO "history" (user_id, entity_type,
               entity_id, changed_fields)
              VALUES ($1, $2, $3, $4)
              RETURNING *;
            `;
    const values = [
      historyDto.user_id,
      historyDto.entity_type,
      historyDto.entity_id,
      historyDto.changed_fields,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteHistory(historyId: number) {
    const query = `
              UPDATE "history"
              SET deleted_at = current_timestamp
              WHERE id = $1
              RETURNING id, deleted_at;
            `;
    const values = [historyId];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteHistories() {
    const query = `
              UPDATE "history"
              SET deleted_at = current_timestamp
              RETURNING id, deleted_at;
            `;

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}
