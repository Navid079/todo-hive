import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';
import IUser from '../interfaces/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto implements Partial<IUser> {
  @ApiProperty({ example: 'John', type: 'string', required: true })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Matches(/[a-zA-Z.', -]+/, {
    message: "First Name can only include english letters, spaces and ,.',-",
  })
  @Length(3, 15, {
    message:
      'First Name cannot be less than 3 characters or more than 15 characters',
  })
  firstName: string;

  @ApiProperty({ example: 'Doe', type: 'string', required: false })
  @IsString({ message: 'Last name must be a string' })
  @Matches(/[a-zA-Z.', -]*/, {
    message: "Last Name can only include english letters, spaces and ,.',-",
  })
  @Length(0, 15, {
    message: 'Last Name cannot be more than 15 characters',
  })
  @IsOptional()
  lastName?: string;

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
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password?: string;

  @ApiProperty({
    example: 'john.doe@email.com',
    type: 'string',
    required: true,
  })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid Email' })
  email?: string;
}
