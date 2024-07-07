export interface IOAuth {
  verify(token: string): Promise<OAuth.Response>;
}