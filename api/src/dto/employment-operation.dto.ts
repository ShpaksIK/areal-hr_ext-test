export type OperationType =
  | 'create'
  | 'salaryChanges'
  | 'departmentChanges'
  | 'dismissal';

export class CreateEmploymentOperationDto {
  readonly employee_id: number;
  readonly operation_type: OperationType;
  readonly department_id: number;
  readonly position_id: number;
  readonly salary: number;
}

export class UpdateEmploymentOperationDto extends CreateEmploymentOperationDto {
  readonly id: number;
}

export interface EmploymentOperation {
  id: number;
  employee_id: number;
  operation_type: OperationType;
  department_id: number;
  position_id: number;
  salary: number;
}
