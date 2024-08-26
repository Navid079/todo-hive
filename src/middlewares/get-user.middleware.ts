import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import JwtService, { VerifyStatus } from '../services/database/jwt.service';
import UserRepository from '../components/User/models/user.repo';
import { v4 } from 'uuid';
import UserTokenRepository from '../components/User/models/user-token.repo';

@Injectable()
export default class GetUserMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly userTokenRepository: UserTokenRepository,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies._at as string | undefined;

    if (!accessToken) return next();

    const refreshToken = req.cookies._rt as string | undefined;
    const [jwtVerifyStatus, payload, refreshPayload] = this.jwtService.verify(
      accessToken,
      refreshToken,
    );

    switch (jwtVerifyStatus) {
      case VerifyStatus.Verified: {
        const user = await this.userRepository.findUserByTokenId(+payload.id);
        if (!user) return next();

        req.user = user;
        req.tokenId = +payload.id;
        break;
      }
      case VerifyStatus.Expired: {
        const [tokenId, nonce] = refreshPayload.split('#');
        const newNonce = v4();

        // This will throw an UnauthorizedException if nonce is invalid
        await this.userTokenRepository.updateTokenNonceById(
          +tokenId,
          nonce,
          newNonce,
        );

        const [accessToken, refreshToken] = this.jwtService.sign(
          { id: tokenId },
          tokenId.toString() + '#' + newNonce + '#' + new Date().toISOString(),
        );

        res.cookie('_at', accessToken, { httpOnly: false });
        res.cookie('_rt', refreshToken, { httpOnly: true });

        const user = await this.userRepository.findUserByTokenId(+tokenId);
        req.user = user;
        req.tokenId = +tokenId;
        break;
      }
    }

    return next();
  }
}
