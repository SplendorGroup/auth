export interface IJwt {
  encode(payload: any): string;
  verify<T>(token: any): T;
}