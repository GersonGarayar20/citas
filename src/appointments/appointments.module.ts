import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ServicesModule } from '../services/services.module';
import { SchedulesModule } from 'src/schedules/schedules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    UsersModule,
    ServicesModule,
    SchedulesModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
