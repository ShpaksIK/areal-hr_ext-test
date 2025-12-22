export class LoginDto {
  readonly login: string;
  readonly password: string;
}

export interface AuthResponseDto {
  readonly id: number;
  readonly last_name: string;
  readonly patronymic: string | null;
  readonly login: string;
  readonly password_hash: string;
  readonly role_id: number;
  readonly created_at: Date;
  readonly updated_at: Date | null;
  readonly deleted_at: Date | null;
  readonly sessionToken: string;
}
