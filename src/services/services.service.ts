import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
    private readonly usersService: UsersService,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const worker = await this.usersService.findWorker(
      createServiceDto.workerId,
    );

    const service = this.servicesRepository.create({
      ...createServiceDto,
      users: [worker],
    });

    return this.servicesRepository.save(service);
  }

  findAll() {
    return this.servicesRepository.find();
  }

  findOne(id: number) {
    return this.servicesRepository.findOneBy({ id });
  }

  async findWorkerService(workerId: number, serviceId: number) {
    const service = await this.servicesRepository
      .createQueryBuilder('service')
      .innerJoin('service.users', 'user')
      .where('user.id = :workerId', { workerId })
      .andWhere('service.id = :serviceId', { serviceId })
      .getOne();

    if (!service) {
      throw new BadRequestException('Servicio no encontrado');
    }

    return service;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return this.servicesRepository.update(id, updateServiceDto);
  }

  remove(id: number) {
    return this.servicesRepository.delete(id);
  }
}
