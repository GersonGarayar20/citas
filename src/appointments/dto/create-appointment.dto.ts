import { IsEnum, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';
import { ApiProperty } from '@nestjs/swagger';

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
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  reason?: string;

  @ApiProperty()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
