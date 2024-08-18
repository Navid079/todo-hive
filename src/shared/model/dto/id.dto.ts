import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

export default class IdDto {
  @ApiProperty({ example: '1', type: 'number', required: true })
  @IsNotEmpty({ message: 'Id is required' })
  @IsInt({ message: 'Id must be a positive integer' })
  @IsPositive({ message: 'Id must be a positive integer' })
  id: number;
}
