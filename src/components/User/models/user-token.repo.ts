import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../services/database/prisma.service';
import IUserToken from './interfaces/user-token.interface';

@Injectable()
export default class UserTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createToken(token: Partial<IUserToken>): Promise<number> {
    const createdToken = await this.prismaService.userToken.create({
      data: { ownerId: token.ownerId, latestNonce: token.latestNonce },
    });

    return createdToken.id;
  }
}
