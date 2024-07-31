import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enum/role.enum';
import { ServicesService } from 'src/services/services.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { clientId, workerId, serviceId, ...rest } = createAppointmentDto;

    const client = await this.usersService.findOne(clientId);
    const worker = await this.usersService.findOne(workerId);
    const service = await this.servicesService.findOne(serviceId);

    if (!client || !worker || !service) {
      throw new BadRequestException('cliente, usuario, o servicio no existe');
    }

    if (client.role !== Role.CLIENT) {
      throw new BadRequestException('el cliente no es cliente');
    }

    if (worker.role !== Role.WORKER) {
      throw new BadRequestException('el trabajador no es trabajador');
    }

    const appointment = this.appointmentRepository.create({
      ...rest,
      endTime: '17:00',
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
