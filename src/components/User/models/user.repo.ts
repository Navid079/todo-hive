import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import IUser from './interfaces/user.interface';
import { PrismaService } from '../../../services/database/prisma.service';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export default class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: Partial<IUser>): Promise<UserDto> {
    const { password } = user;

    const foundUser = await this.prismaService.user.findFirst({
      where: {
        username: user.username,
      },
    });

    if (foundUser) throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
    const createdUser = await this.prismaService.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: hashedPassword,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        registrationDate: new Date(),
      },
    });

    return plainToClass(UserDto, createdUser);
  }

  async findUserByCredentials(user: Partial<IUser>): Promise<UserDto> {
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        username: user.username,
      },
    });

    if (!foundUser)
      throw new NotFoundException(
        'Username does not exist. Are you trying to signup?',
      );

    const isCorrectPassword = await bcrypt.compare(
      user.password,
      foundUser.password,
    );

    if (!isCorrectPassword)
      throw new UnauthorizedException(
        'Password is wrong. Recheck your username and password',
      );

    return plainToClass(UserDto, foundUser);
  }
}
