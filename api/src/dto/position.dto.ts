export class CreatePositionDto {
  readonly name: string;
}

export class UpdatePositionDto extends CreatePositionDto {
  readonly user_id: number;
  readonly id: number;
}

export interface Position {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
