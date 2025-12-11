import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateUserDto, UpdateUserDto, User } from 'src/dto/user.dto';
import { renameFields } from 'src/helpers/rename-fields';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getUsers() {
    const query = `
            SELECT
                id, first_name, last_name, patronymic,
                login, role_id, created_at, updated_at,
                deleted_at
            FROM "user";
        `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const query = `
            INSERT INTO "user" (first_name, last_name, patronymic,
                login, password_hash, role_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, first_name, last_name, patronymic,
                login, role_id, created_at, updated_at,
                deleted_at;
        `;
    const values = [
      userDto.first_name,
      userDto.last_name,
      userDto.patronymic,
      userDto.login,
      userDto.password,
      userDto.role_id,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateUser(
    userDto: UpdateUserDto,
  ): Promise<{ data: User | null; changed_fields: string }> {
    const dto = { ...userDto };
    delete dto.user_id;

    const dtoKeys = Object.keys(dto);

    const setKeys = dtoKeys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const valuesKeys = Object.values(dto);

    const query = `
            UPDATE "user"
            SET ${setKeys}, updated_at = current_timestamp
            WHERE id = $1
            RETURNING id, first_name, last_name, patronymic,
                login, role_id, created_at, updated_at,
                deleted_at;
        `;
    const values = [dto.id, ...valuesKeys];

    const result = await this.pool.query(query, values);
    const renamedFields = JSON.stringify(renameFields(dtoKeys));

    return {
      data: result.rows[0] || null,
      changed_fields: renamedFields,
    };
  }

  async deleteUser(userId: number) {
    const query = `
            UPDATE "user"
            SET deleted_at = current_timestamp
            WHERE id = $1
            RETURNING id, deleted_at;
        `;
    const values = [userId];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
}
