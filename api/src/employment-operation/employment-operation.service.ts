import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import {
  CreateEmploymentOperationDto,
  EmploymentOperation,
  UpdateEmploymentOperationDto,
} from 'src/dto/employment-operation.dto';
import { renameFields } from 'src/helpers/rename-fields';

@Injectable()
export class EmploymentOperationService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getEmploymentOperationById(id: number): Promise<EmploymentOperation> {
    const query = `
            SELECT *
            FROM "employment_operation"
            WHERE id = $1;
        `;
    const values = [id];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getEmploymentOperations(): Promise<EmploymentOperation[]> {
    const query = `
            SELECT "employment_operation".id, operation_type, salary,
              employee_id, department_id, position_id,
              "department".name as department_name,
              "position".name as position_name,
              "employee".first_name as employee_first_name,
              "employee".last_name as employee_last_name,
              "employee".patronymic as employee_patronymic
            FROM "employment_operation"
            JOIN "department" ON "employment_operation"."department_id" = "department".id
            JOIN "position" ON "employment_operation".position_id = "position".id
            JOIN "employee" ON "employment_operation".employee_id = "employee".id;
        `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createEmploymentOperation(
    employeeDto: CreateEmploymentOperationDto,
  ): Promise<EmploymentOperation> {
    const query = `
            INSERT INTO "employment_operation" (employee_id, operation_type, 
            department_id, position_id, salary)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
    const values = [
      employeeDto.employee_id,
      employeeDto.operation_type,
      employeeDto.department_id,
      employeeDto.position_id,
      employeeDto.salary,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateEmploymentOperation(
    employmentOperationDto: UpdateEmploymentOperationDto,
  ): Promise<{ data: EmploymentOperation | null; changed_fields: string }> {
    const dtoKeys = Object.keys(employmentOperationDto);

    const setKeys = dtoKeys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const valuesKeys = Object.values(employmentOperationDto);

    const query = `
            UPDATE "employment_operation"
            SET ${setKeys}, updated_at = current_timestamp
            WHERE id = $1
            RETURNING *;
          `;
    const values = [employmentOperationDto.id, ...valuesKeys];

    const result = await this.pool.query(query, values);
    const renamedFields = JSON.stringify(renameFields(dtoKeys));

    return {
      data: result.rows[0] || null,
      changed_fields: renamedFields,
    };
  }

  async deleteEmploymentOperation(employmentOperationId: number) {
    const query = `
            UPDATE "employment_operation"
            SET deleted_at = current_timestamp
            WHERE id = $1
            RETURNING id, deleted_at;
        `;
    const values = [employmentOperationId];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteEmploymentOperations() {
    const query = `
              UPDATE "employment_operation"
              SET deleted_at = current_timestamp
              RETURNING id, deleted_at;
            `;

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}
