import { IsString, Length, Matches } from 'class-validator';
import IUser from '../interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto implements Partial<IUser> {
  @ApiProperty({ example: 'john-doe123', type: 'string', required: true })
  @IsString({ message: 'Username must be a string' })
  @Matches(/[a-zA-Z](([.-_])[a-zA-Z0-9-]+)*/, {
    message:
      'Username must start and end with english letters' +
      ' and can only have english letters, digits, and .-_',
  })
  @Length(3, 20, {
    message:
      'Username cannot be less than 3 characters or more than 20 characters',
  })
  username: string;

  @ApiProperty({ example: 'StrongP@ssw0rd', type: 'string', required: true })
  @IsString({ message: 'Password must be a string' })
  password?: string;
}
