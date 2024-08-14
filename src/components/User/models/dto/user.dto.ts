import { Exclude } from 'class-transformer';
import IUser from '../interfaces/user.interface';
import { ApiResponseProperty } from '@nestjs/swagger';

export class UserDto implements Partial<IUser> {
  @ApiResponseProperty({ example: 1, type: 'number' })
  id: number;

  @ApiResponseProperty({ example: 'John', type: 'string' })
  firstName: string;

  @ApiResponseProperty({ example: 'Doe', type: 'string' })
  lastName?: string;

  @ApiResponseProperty({ example: 'john-doe123', type: 'string' })
  username: string;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @ApiResponseProperty({
    example: 'john.doe@email.com',
    type: 'string',
  })
  email?: string;

  @ApiResponseProperty({ example: 'This is my bio', type: 'string' })
  bio?: string;

  @ApiResponseProperty({
    example: 'https://www.istockphoto.com/photos/avatar',
    type: 'string',
  })
  profilePicture?: string;

  @ApiResponseProperty({ example: new Date(), type: 'Date' })
  registrationDate?: Date;
}
