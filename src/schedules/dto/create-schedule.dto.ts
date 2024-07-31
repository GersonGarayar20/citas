import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Description of the schedule, providing additional details.',
    example: 'Morning shift',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Days of the week when the worker is available.',
    example: ['Monday', 'Tuesday', 'Wednesday'],
  })
  @IsArray()
  @IsString({ each: true })
  days: string[];

  @ApiProperty({
    description: 'Start time of the schedule in HH:MM:SS format.',
    example: '09:00:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the schedule in HH:MM:SS format.',
    example: '17:00:00',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'The unique identifier of the worker.',
    example: 1,
  })
  @IsNumber()
  workerId: number;
}
