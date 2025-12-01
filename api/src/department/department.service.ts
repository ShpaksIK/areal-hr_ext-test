import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import {
  CreateDepartmentDto,
  Department,
  UpdateDepartmentDto,
} from 'src/dto/department.dto';
import { renameFields } from 'src/helpers/rename-fields';

@Injectable()
export class DepartmentService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getDepartmentById(id: number): Promise<Department> {
    const query = `
      SELECT *
      FROM "department"
      WHERE id = $1;
    `;
    const values = [id];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getDepartments(): Promise<Department[]> {
    const query = `
      SELECT *
      FROM "department";
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createDepartment(
    departmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    const query = `
    INSERT INTO "department" (name, comment, organization_id, parent_id)
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
  ): Promise<{ data: Department | null; changed_fields: string }> {
    const dtoKeys = Object.keys(departmentDto);

    const setKeys = dtoKeys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const valuesKeys = Object.values(departmentDto);

    const query = `
      UPDATE "department"
      SET ${setKeys}, updated_at = current_timestamp
      WHERE id = $1
      RETURNING *;
    `;
    const values = [departmentDto.id, ...valuesKeys];

    const result = await this.pool.query(query, values);
    const renamedFields = JSON.stringify(renameFields(dtoKeys));

    return {
      data: result.rows[0] || null,
      changed_fields: renamedFields,
    };
  }

  async deleteDepartment(departmentId: number) {
    const query = `
      UPDATE "department"
      SET deleted_at = current_timestamp
      WHERE id = $1
      RETURNING id, deleted_at;
    `;
    const values = [departmentId];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
}
