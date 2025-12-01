import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from 'src/dto/employee.dto';
import { renameFields } from 'src/helpers/rename-fields';

@Injectable()
export class EmployeeService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getEmployeeById(id: number): Promise<Employee> {
    const query = `
          SELECT *
          FROM "employee"
          WHERE id = $1;
        `;
    const values = [id];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getEmployees(): Promise<Employee[]> {
    const query = `
          SELECT *
          FROM "employee";
        `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createEmployee(employeeDto: CreateEmployeeDto): Promise<Employee> {
    const query = `
          INSERT INTO "employee" (first_name, last_name, patronymic, 
            birth_date, passport_series, passport_number, 
            passport_issue_date, passport_division_code, 
            passport_issued_by, address_region, address_city, 
            address_street, address_house, address_building, address_apartment)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 
            $9, $10, $11, $12, $13, $14, $15)
          RETURNING *;
        `;
    const values = [
      employeeDto.first_name,
      employeeDto.last_name,
      employeeDto.patronymic,
      employeeDto.birth_date,
      employeeDto.passport_series,
      employeeDto.passport_number,
      employeeDto.passport_issue_date,
      employeeDto.passport_division_code,
      employeeDto.passport_issued_by,
      employeeDto.address_region,
      employeeDto.address_city,
      employeeDto.address_street,
      employeeDto.address_house,
      employeeDto.address_building,
      employeeDto.address_apartment,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateEmployee(
    employeeDto: UpdateEmployeeDto,
  ): Promise<{ data: Employee | null; changed_fields: string }> {
    const dtoKeys = Object.keys(employeeDto);

    const setKeys = dtoKeys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const valuesKeys = Object.values(employeeDto);

    const query = `
          UPDATE "employee"
          SET ${setKeys}, updated_at = current_timestamp
          WHERE id = $1
          RETURNING *;
        `;
    const values = [employeeDto.id, ...valuesKeys];

    const result = await this.pool.query(query, values);
    const renamedFields = JSON.stringify(renameFields(dtoKeys));

    return {
      data: result.rows[0] || null,
      changed_fields: renamedFields,
    };
  }

  async deleteEmployee(employeeId: number) {
    const query = `
          UPDATE "employee"
          SET deleted_at = current_timestamp
          WHERE id = $1
          RETURNING id, deleted_at;
        `;
    const values = [employeeId];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
}
