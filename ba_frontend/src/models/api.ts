export interface IResponse<T> {
  message: string;
  success: boolean;
  data: T;
}
