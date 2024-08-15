import { Injectable, UnauthorizedException } from '@nestjs/common';

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

  async updateTokenNonceById(id: number, oldNonce: string, newNonce: string) {
    const foundToken = await this.prismaService.userToken.findFirst({
      where: { id },
    });

    if (!foundToken) throw new UnauthorizedException('Invalid token');

    if (foundToken.latestNonce !== oldNonce) {
      await this.prismaService.userToken.delete({ where: { id } });
      throw new UnauthorizedException('Invalid Token');
    }

    await this.prismaService.userToken.update({
      where: { id },
      data: { latestNonce: newNonce },
    });
  }
}
