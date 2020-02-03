import { IsString } from "class-validator";

export class CredentialsForm {


    @IsString()
    CLIENT_ID: string;
    
    @IsString()
    CLIENT_SECRET: string;

}