import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  forwardRef,
} from '@nestjs/common';
import { Pool } from 'pg';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto, UpdateUserDto, User } from 'src/dto/user.dto';
import { renameFields } from 'src/helpers/rename-fields';
import { config } from 'dotenv';

config();

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @Inject('DATABASE_POOL') private readonly pool: Pool,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async onApplicationBootstrap() {
    const shouldCreateTestUser = process.env.CREATE_TEST_USER;
    if (shouldCreateTestUser === 'true') {
      try {
        await this.createUser({
          last_name: 'Иванов',
          first_name: 'Иван',
          patronymic: 'Иванович',
          login: 'admin',
          password: 'admin',
          role_id: 1,
        });
      } catch {
        console.log('Тестовый пользователь уже создан');
      }
    }
  }

  async getByLogin(login: string): Promise<User> {
    const query = `
      SELECT
          "user".id, first_name, last_name, patronymic,
          login, password_hash, role_id, "role".name,
          "user".created_at, updated_at, deleted_at
      FROM "user"
      JOIN "role" ON "user".role_id = "role".id
      WHERE "user".login = $1;
    `;
    const values = [login];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getById(id: number): Promise<Omit<User, 'password'>> {
    const query = `
      SELECT
          "user".id, first_name, last_name, patronymic,
          login, role_id, "role".name,
          "user".created_at, updated_at, deleted_at
      FROM "user"
      JOIN "role" ON "user".role_id = "role".id
      WHERE "user".id = $1;
    `;
    const values = [id];

    const result = await this.pool.query(query, values);
    return result.rows[0];
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
    const hashedPassword = await this.authService.hashPassword(
      userDto.password,
    );
    const userData = {
      ...userDto,
      hashedPassword,
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
      userData.hashedPassword,
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
