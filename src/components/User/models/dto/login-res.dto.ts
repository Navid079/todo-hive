import { ApiResponseProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class LoginResponseDto {
  @ApiResponseProperty({ type: UserDto })
  user: UserDto;

  @ApiResponseProperty({ example: 'this.is.a.token', type: 'string' })
  accessToken: string;

  @ApiResponseProperty({ example: 'this.is.a.token', type: 'string' })
  refreshToken: string;
}
