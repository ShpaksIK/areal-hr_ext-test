export type EntityType =
  | 'organization'
  | 'department'
  | 'position'
  | 'employee'
  | 'employmentOperation'
  | 'file'
  | 'user';

export class CreateHistortyDto {
  readonly user_id: number;
  readonly entity_type: EntityType;
  readonly entity_id: number;
  readonly changed_fields: string;
}

export interface Historty {
  id: number;
  user_id: number;
  entity_type: EntityType;
  entity_id: number;
  changed_fields: any;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
