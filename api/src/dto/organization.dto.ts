export class CreateOrganizationDto {
  readonly name: string;
  readonly comment: string | null;
}

export class UpdateOrganizationDto extends CreateOrganizationDto {
  readonly user_id: number;
  readonly id: number;
}

export interface Organization {
  id: number;
  name: string;
  comment: string | null;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
