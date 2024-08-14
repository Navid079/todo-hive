import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from '../../services/database/prisma.service';
import UserRepository from './models/user.repo';
import { JwtService } from '../../services/database/jwt.service';
import { ConfigModule } from '@nestjs/config';
import UserTokenRepository from './models/user-token.repo';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserTokenRepository,
    PrismaService,
    JwtService,
  ],
})
export class UserModule {}
