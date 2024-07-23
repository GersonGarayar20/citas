import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsString, IsTimeZone } from 'class-validator';
export class CreateScheduleDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsTimeZone()
  start_time;

  @ApiProperty()
  @IsTimeZone()
  end_time;

  @ApiProperty()
  @IsJSON()
  day_of_week;
}
