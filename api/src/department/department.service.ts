import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import {
  CreateDepartmentDto,
  Department,
  UpdateDepartmentDto,
} from 'src/dto/department.dto';

@Injectable()
export class DepartmentService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getDepartmentById(id: number): Promise<Department> {
    const query = `
      SELECT *
      FROM "Department"
      WHERE id = $1;
    `;
    const values = [id];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getDepartments(): Promise<Department[]> {
    const query = `
      SELECT *
      FROM "Department";
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createDepartment(
    departmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    const query = `
    INSERT INTO "Department" (name, comment, organization_id, parent_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;
    const values = [
      departmentDto.name,
      departmentDto.comment,
      departmentDto.organization_id,
      departmentDto.parent_id,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateDepartment(
    departmentDto: UpdateDepartmentDto,
  ): Promise<Department | null> {
    const setKeys = Object.keys(departmentDto)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const valuesKeys = Object.values(departmentDto);

    const query = `
      UPDATE "Department"
      SET ${setKeys}
      WHERE id = $1
      RETURNING *;
    `;
    const values = [departmentDto.id, ...valuesKeys];

    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async deleteDepartment(departmentId: number) {
    const query = `
      UPDATE "Department"
      SET is_deleted = true
      WHERE id = $1
      RETURNING id, is_deleted;
    `;
    const values = [departmentId];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
}
