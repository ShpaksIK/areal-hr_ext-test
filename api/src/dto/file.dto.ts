export class CreateFileDto {
  readonly name: string;
  readonly employee_id: number;
}

export class UpdateFileDto extends CreateFileDto {
  readonly id: number;
}

export interface File {
  id: number;
  name: string;
  employee_id: number;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
