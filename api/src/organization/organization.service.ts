import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from 'src/dto/organization.dto';
import { Organization } from 'src/dto/organization.dto';

@Injectable()
export class OrganizationService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getOrganizationById(id: number): Promise<Organization> {
    const query = `
      SELECT *
      FROM "organization"
      WHERE id = $1;
    `;
    const values = [id];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getOrganizations(): Promise<Organization[]> {
    const query = `
      SELECT *
      FROM "organization";
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createOrganization(
    organizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const query = `
      INSERT INTO "organization" (name, comment)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [organizationDto.name, organizationDto.comment];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateOrganization(
    organizationDto: UpdateOrganizationDto,
  ): Promise<Organization | null> {
    const setKeys = Object.keys(organizationDto)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const valuesKeys = Object.values(organizationDto);

    const query = `
      UPDATE "organization"
      SET ${setKeys}, updated_at = current_timestamp
      WHERE id = $1
      RETURNING *;
    `;
    const values = [organizationDto.id, ...valuesKeys];

    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async deleteOrganization(organizationId: number) {
    const query = `
      UPDATE "organization"
      SET deleted_at = current_timestamp
      WHERE id = $1
      RETURNING id, deleted_at;
    `;
    const values = [organizationId];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
}
