import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export default class CodeDto {
  @ApiProperty({ example: '123456', type: 'string', required: true })
  @IsNumberString({}, { message: 'Confirmation code must be 6 digits' })
  @IsNotEmpty({ message: 'Confirmation code is required' })
  @Length(6, 6, { message: 'Confirmation code must be 6 digits' })
  code: string;
}
