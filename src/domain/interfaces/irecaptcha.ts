export interface IRecaptcha {
    verify(token: string): Promise<boolean>
}