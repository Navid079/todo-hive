import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Patch,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from './models/dto/signup.dto';
import { UserDto } from './models/dto/user.dto';
import { ErrorDto } from '../../util/error/error.dto';
import { LoginDto } from './models/dto/login.dto';
import { Request, Response } from 'express';
import CodeDto from '../../shared/model/dto/code.dto';
import IdDto from '../../shared/model/dto/id.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiResponse({
    status: 201,
    type: UserDto,
  })
  @ApiResponse({
    status: 409,
    type: ErrorDto,
  })
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

    res.cookie('_at', accessToken, { httpOnly: false });
    res.cookie('_rt', refreshToken, { httpOnly: true });
    return user;
  }

  @Get('info')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, type: UserDto })
  async info(@Req() req: Request) {
    return req.user;
  }

  @Put('token/trust')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200 })
  async trustToken(@Req() req: Request, @Body() body: CodeDto) {
    const accessToken = req.cookies._at;
    await this.userService.trustToken(accessToken, body.code);

    return;
  }

  @Patch('token/revoke')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200 })
  async revokeToken(@Req() req: Request, @Body() body: IdDto) {
    await this.userService.revokeToken(req.tokenId, body.id);
  }
}
