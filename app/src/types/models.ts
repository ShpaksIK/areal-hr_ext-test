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
  organization_id: number;
  organization?: Organization | null;
  parentDepartment?: Department | null;
  parent_id?: number | null;
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

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  birth_date: string;
  passport_series: string;
  passport_number: string;
  passport_issue_date: string;
  passport_division_code: string;
  passport_issued_by: string;
  address_region: string;
  address_city: string;
  address_street: string;
  address_house: string;
  address_building?: string | null;
  address_apartment?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface File {
  id: number;
  name: string;
  employee_id: number;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface History {
  id: number;
  user_id: number;
  entity_type: EntityType;
  entity_id: number;
  changed_fields: string | string[];
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface EmploymentOperation {
  id: number;
  employee_id: number;
  department_id?: number | null;
  position_id?: number | null;
  employee_first_name: string;
  employee_last_name: string;
  employee_patronymic?: string | null;
  operation_type: OperationType;
  department_name?: string | null;
  position_name?: string | null;
  salary?: number | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export type OperationType = 'create' | 'salaryChanges' | 'departmentChanges' | 'dismissal';

export type EntityType =
  | 'organization'
  | 'department'
  | 'position'
  | 'employee'
  | 'file'
  | 'history'
  | 'employmentOperation';

export type Entity =
  | Organization
  | Department
  | Position
  | Employee
  | File
  | History
  | EmploymentOperation;

export type FieldFunction = (row: Entity) => string;

export interface SaveData {
  id: number;
  employee_id?: number | null;
  name?: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string | null;
  birth_date?: string;
  passport_series?: string;
  passport_number?: string;
  passport_issue_date?: string;
  passport_division_code?: string;
  passport_issued_by?: string;
  address_region?: string;
  address_city?: string;
  address_street?: string;
  address_house?: string;
  address_building?: string | null;
  address_apartment?: string | null;
  comment?: string;
  organization_id?: number | null;
  salary?: number | null;
  operation_type?: OperationType | null;
  department_id?: number | null;
  position_id?: number | null;
  entity_type?: EntityType | null;
  entity_id?: number | null;
  changed_fields?: string | string[];
  parent_id?: null | number;
}

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
  organization_id: number | null;
  parentDepartmentId?: number | null;
}

export interface PositionForm {
  name: string;
}
