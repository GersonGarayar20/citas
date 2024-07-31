import {
  IsEnum,
  IsNumber,
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsNumber()
  workerId: number;

  @ApiProperty()
  @IsNumber()
  serviceId: number;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @ApiProperty({
    description: 'Start time of the schedule in HH:MM:SS format.',
    example: '09:00:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsOptional()
  reason?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
