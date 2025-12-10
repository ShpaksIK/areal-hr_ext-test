import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import {
  CreateEmploymentOperationDto,
  EmploymentOperation,
} from 'src/dto/employment-operation.dto';

@Injectable()
export class EmploymentOperationService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

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
            LEFT JOIN "department" ON "employment_operation"."department_id" = "department".id
            LEFT JOIN "position" ON "employment_operation".position_id = "position".id
            LEFT JOIN "employee" ON "employment_operation".employee_id = "employee".id;
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
}
