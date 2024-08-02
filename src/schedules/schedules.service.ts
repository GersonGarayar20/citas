import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly usersService: UsersService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const worker = await this.usersService.findOne(createScheduleDto.workerId);

    if (!worker) {
      throw new NotFoundException(
        `Worker with ID ${createScheduleDto.workerId} not found.`,
      );
    }

    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      worker,
    });
    return this.scheduleRepository.save(schedule);
  }

  findAll() {
    return this.scheduleRepository.find();
  }

  findOne(id: number) {
    return this.scheduleRepository.findOneBy({ id });
  }

  async findOneByWorker(id: number) {
    const schedule = this.scheduleRepository.findOne({
      where: { worker: { id } },
    });

    if (!schedule) {
      throw new BadRequestException(
        'el trabajador no tiene horarios asignados',
      );
    }

    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const { workerId } = updateScheduleDto;

    // Verificar si el trabajador existe (si workerId está presente en el DTO)
    if (workerId) {
      const worker = await this.usersService.findOne(workerId);
      if (!worker) {
        throw new NotFoundException(`Worker with ID ${workerId} not found.`);
      }
    }

    const result = await this.scheduleRepository.update(id, updateScheduleDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule with ID ${id} not found.`);
    }
  }

  remove(id: number) {
    return this.scheduleRepository.delete(id);
  }
}
