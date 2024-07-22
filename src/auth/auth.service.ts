import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findUserByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      user,
      token,
    };
  }
  async register({ name, email, password }: RegisterDto) {
    const user = await this.usersService.findUserByEmailWithPassword(email);

    if (user) {
      throw new BadRequestException();
    }

    return await this.usersService.create({
      name,
      email,
      password: await hash(password, 10),
    });
  }
}
