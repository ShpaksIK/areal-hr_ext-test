export interface Organization {
  id: number;
  name: string;
  comment?: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface Department {
  id: number;
  name: string;
  comment: string;
  organizationId: number;
  parentDepartmentId?: number | null;
  organization_id?: number | null;
  organization?: Organization | null;
  parentDepartment?: Department | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface Position {
  id: number;
  name: string;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export type EntityType = 'organization' | 'department' | 'position';

export type Entity = Organization | Department | Position;

export type FieldFunction = (row: Entity) => string;

export interface TableColumn {
  name: string;
  label: string;
  field: string | ((row: Entity) => string);
  align: 'left' | 'right' | 'center';
  sortable?: boolean;
}

export type ModalMode = 'add' | 'edit';

export interface OrganizationForm {
  name: string;
  comment?: string;
}

export interface DepartmentForm {
  name: string;
  comment: string;
  organizationId: number | null;
  parentDepartmentId?: number | null;
}

export interface PositionForm {
  name: string;
}