export class CreateUserDto {
  readonly first_name: string;
  readonly last_name: string;
  readonly patronymic: string | null;
  readonly login: string;
  readonly password: string;
  readonly role_id: number;
}

export class UpdateUserDto extends CreateUserDto {
  readonly id: number;
  readonly user_id: number;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string | null;
  login: string;
  password_hash: string;
  role_id: number;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
