import { IsString } from "class-validator";

export class VerifyAccessTokenDTO {
    @IsString()
    access_token: string
}