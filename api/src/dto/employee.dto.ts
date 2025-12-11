export class CreateEmployeeDto {
  readonly first_name: string;
  readonly last_name: string;
  readonly patronymic: string | null;
  readonly birth_date: Date;
  readonly passport_series: string;
  readonly passport_number: string;
  readonly passport_issue_date: Date;
  readonly passport_division_code: string;
  readonly passport_issued_by: string;
  readonly address_region: string;
  readonly address_city: string;
  readonly address_street: string;
  readonly address_house: string;
  readonly address_building: string | null;
  readonly address_apartment: string;
}

export class UpdateEmployeeDto extends CreateEmployeeDto {
  readonly user_id: number;
  readonly id: number;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string | null;
  birth_date: Date;
  passport_series: string;
  passport_number: string;
  passport_issue_date: Date;
  passport_division_code: string;
  passport_issued_by: string;
  address_region: string;
  address_city: string;
  address_street: string;
  address_house: string;
  address_building: string | null;
  address_apartment: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
