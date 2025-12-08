export class CreateDepartmentDto {
  readonly name: string;
  readonly comment: string | null;
  readonly organization_id: number;
  readonly parent_id: number | null;
}

export class UpdateDepartmentDto extends CreateDepartmentDto {
  readonly id: number;
}

export interface Department {
  id: number;
  name: string;
  comment: string | null;
  organizationId: number;
  parentId: number | null;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
