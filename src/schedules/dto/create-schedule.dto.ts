import { IsJSON, IsString, IsTimeZone } from "class-validator";
export class CreateScheduleDto {
    @IsString()
    description:string;

    @IsTimeZone()
    start_time;

    @IsTimeZone()
    end_time;

    @IsJSON()
    day_of_week;

}
