import { ApiResponseProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiResponseProperty({
    example: 'Something not found',
    type: 'string | string[]',
  })
  message: string | string[];

  @ApiResponseProperty({ example: 'NotFound', type: 'string' })
  error: string;

  @ApiResponseProperty({ example: 404, type: 'number' })
  statusCode: number;
}
