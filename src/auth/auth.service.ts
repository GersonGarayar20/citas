import { BadRequestException, Injectable } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: LoginDto) {
    return 'login';
  }
  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findUserByEmailWithPassword(email);

    if (user) {
      throw new BadRequestException();
    }

    await this.usersService.create({
      name,
      email,
      password: await hash(password, 10),
    });
    return 'register';
  }
}
