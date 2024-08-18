import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 } from 'uuid';

import { SignupDto } from '../models/dto/signup.dto';
import { UserDto } from '../models/dto/user.dto';
import UserRepository from '../models/user.repo';
import { LoginDto } from '../models/dto/login.dto';
import UserTokenRepository from '../models/user-token.repo';
import JwtService from '../../../services/database/jwt.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userTokenRepository: UserTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signupUser(user: SignupDto): Promise<UserDto> {
    return this.userRepository.createUser(user);
  }

  async loginUser(
    user: LoginDto,
  ): Promise<{ user: UserDto; accessToken: string; refreshToken: string }> {
    const loggedInUser = await this.userRepository.findUserByCredentials(user);

    const nonce = v4();

    const tokenId = await this.userTokenRepository.createToken({
      latestNonce: nonce,
      ownerId: loggedInUser.id,
    });
    const [accessToken, refreshToken] = this.jwtService.sign(
      { id: tokenId },
      tokenId.toString() + '#' + nonce + '#' + new Date().toISOString(),
    );

    return { user: loggedInUser, accessToken, refreshToken };
  }

  async trustToken(token: string, code: string) {
    if (code !== '123456')
      throw new UnauthorizedException('Confirmation code is wrong');
    const payload = this.jwtService.decode(token);
    const tokenId = payload.id as string;

    await this.userTokenRepository.updateToken(+tokenId, { trusted: true });
  }

  async revokeToken(loggedInTokenId: number, tokenId: number) {
    const loggedInToken =
      await this.userTokenRepository.findTokenById(loggedInTokenId);
    if (!loggedInToken.trusted)
      throw new ForbiddenException('You cannot do this');

    const targetToken = await this.userTokenRepository.findTokenById(tokenId);
    if (!targetToken || loggedInToken.ownerId !== targetToken.ownerId)
      throw new NotFoundException('Token not found');

    await this.userTokenRepository.deleteTokenById(tokenId);
  }
}
