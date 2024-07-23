import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsDate } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {

    @IsNumber()
    clientId: number;
  
    @IsNumber()
    workerId: number;
  
    @IsNumber()
    serviceId: number;
  
    @IsDate()
    date: Date;
  
    @IsNotEmpty()
    reason?: string;
  
    @IsEnum(AppointmentStatus)
    status: AppointmentStatus;
}
