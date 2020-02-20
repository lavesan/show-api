import { IsString, Matches, IsNumber } from "class-validator";

export class SaveScheduledTimeForm {

    orderId: number;

    @IsString()
    @Matches(/^\d{2}\/\d{2}\/\d{4}$/)
    date: string;

    @IsString()
    @Matches(/^\d{2}:\d{2}$/)
    time: string;

}