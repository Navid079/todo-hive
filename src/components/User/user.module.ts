import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from '../../services/database/prisma.service';
import UserRepository from './models/user.repo';
import { ConfigModule } from '@nestjs/config';
import UserTokenRepository from './models/user-token.repo';
import JwtService from '../../services/database/jwt.service';
import GetUserMiddleware from '../../middlewares/get-user.middleware';
import AuthenticateMiddleware from '../../middlewares/authenticate.middleware';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserTokenRepository,
    PrismaService,
    JwtService,
    GetUserMiddleware,
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetUserMiddleware, AuthenticateMiddleware)
      .exclude(
        { path: 'user/login', method: RequestMethod.POST },
        { path: 'user/signup', method: RequestMethod.POST },
      )
      .forRoutes('user');
  }
}
