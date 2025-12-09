export interface ResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}
