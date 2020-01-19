import { IsNotEmpty, IsString } from "class-validator";

export class DeleteOrderForm {

    @IsNotEmpty()
    id: number;

    @IsString()
    reason: string;

}