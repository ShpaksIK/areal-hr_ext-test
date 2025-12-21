import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateUserDto, UpdateUserDto, User } from 'src/dto/user.dto';
import { renameFields } from 'src/helpers/rename-fields';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async hashPassword(password: string): Promise<string> {
    try {
      const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
        hashLength: 32,
      });
      return hash;
    } catch {
      throw new ConflictException('Ошибка при хешировании пароля');
    }
  }

  async getUsers() {
    const query = `
            SELECT
                "user".id, first_name, last_name, patronymic,
                login, role_id, "role".name,
                "user".created_at, updated_at, deleted_at
            FROM "user"
            JOIN "role" ON "user".role_id = "role".id;
        `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getRoles() {
    const query = `SELECT id, name FROM "role";`;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(userDto.password);
    const userData = {
      ...userDto,
      password: hashedPassword,
    };

    const query = `
            INSERT INTO "user" (first_name, last_name, patronymic,
                login, password_hash, role_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, first_name, last_name, patronymic,
                login, role_id, created_at, updated_at,
                deleted_at;
        `;
    const values = [
      userData.first_name,
      userData.last_name,
      userData.patronymic,
      userData.login,
      userData.password,
      userData.role_id,
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
