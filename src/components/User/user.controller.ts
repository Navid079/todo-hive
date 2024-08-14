import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from './models/dto/signup.dto';
import { UserDto } from './models/dto/user.dto';
import { ErrorDto } from '../../util/error/error.dto';
import { LoginDto } from './models/dto/login.dto';
import { Response } from 'express';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiResponse({ status: 201, type: UserDto })
  @ApiResponse({ status: 409, type: ErrorDto })
  async signup(@Body() body: SignupDto): Promise<UserDto> {
    const createdUser = await this.userService.signupUser(body);
    return createdUser;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 404, type: ErrorDto })
  @ApiResponse({ status: 401, type: ErrorDto })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const { user, accessToken, refreshToken } =
      await this.userService.loginUser(body);

    res.cookie('_at', accessToken, { httpOnly: true });
    res.cookie('_rt', refreshToken, { httpOnly: true });
    return user;
  }
}
