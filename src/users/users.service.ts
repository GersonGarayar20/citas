import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.save(createUserDto);
    const { password, ...res } = user;
    return { ...res };
  }

  findUserByEmailWithPassword(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'email',
        'password',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async findClient(id: number) {
    const client = await this.usersRepository.findOne({
      where: {
        id,
        role: Role.CLIENT,
      },
    });

    if (!client) {
      throw new BadRequestException('Cliente no encontrado.');
    }
    return client;
  }

  async findWorker(id: number) {
    const worker = await this.usersRepository.findOne({
      where: {
        id,
        role: Role.WORKER,
      },
    });

    if (!worker) {
      throw new BadRequestException('Trabajador no encontrado.');
    }
    return worker;
  }

  findOneWithServices(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['services'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
