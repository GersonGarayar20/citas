import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enum/role.enum';
import { ServicesService } from 'src/services/services.service';
import {
  calculateEndTime,
  isDateValidAndAvailable,
  isTimeRangeWithinAvailableRange,
} from 'src/common/utils/time';
import { SchedulesService } from 'src/schedules/schedules.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
    private readonly schedulesService: SchedulesService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { clientId, workerId, serviceId, startTime, date, ...rest } =
      createAppointmentDto;

    const client = await this.usersService.findClient(clientId);
    const worker = await this.usersService.findWorker(workerId);

    const service = await this.servicesService.findWorkerService(
      worker.id,
      serviceId,
    );

    const schedule = await this.schedulesService.findOneByWorker(worker.id);

    const endTime = calculateEndTime(startTime, service.durationMin);

    // Verificar si el rango de tiempo está disponible en el horario del trabajador
    const isAvailableTime = isTimeRangeWithinAvailableRange(
      startTime,
      endTime,
      schedule.startTime,
      schedule.endTime,
    );

    if (!isAvailableTime) {
      throw new BadRequestException(
        `La hora de la cita (${startTime} - ${endTime}) no está disponible dentro del horario laboral del trabajador (${schedule.startTime} - ${schedule.endTime}).`,
      );
    }

    // Verificar si la fecha de la cita está disponible en el horario del trabajador
    const isAvailableDate = isDateValidAndAvailable(date, schedule.days);

    if (!isAvailableDate) {
      const availableDays = schedule.days.join(', ');
      throw new BadRequestException(
        `La fecha seleccionada (${date.toDateString()}) no está disponible. El trabajador solo está disponible en los siguientes días: ${availableDays}.`,
      );
    }

    // Verificar si la hora de la cita ya está tomada
    const existingAppointments = await this.appointmentRepository.find({
      where: { worker: { id: workerId }, date },
    });

    const isOverlapping = existingAppointments.some((appointment) => {
      const resultado = isTimeRangeWithinAvailableRange(
        startTime,
        endTime,
        appointment.startTime,
        appointment.endTime,
      );

      return resultado;
    });

    if (isOverlapping) {
      throw new BadRequestException(
        `La hora de la cita seleccionada (${startTime} - ${endTime}) ya está ocupada por otra cita.`,
      );
    }

    const appointment = this.appointmentRepository.create({
      ...rest,
      date,
      startTime,
      endTime,
      client,
      worker,
      service,
    });

    return this.appointmentRepository.save(appointment);
  }

  findAll() {
    return this.appointmentRepository.find();
  }

  findOne(id: number) {
    return this.appointmentRepository.findOneBy({ id });
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentRepository.update(id, updateAppointmentDto);
  }

  remove(id: number) {
    return this.appointmentRepository.delete(id);
  }
}
