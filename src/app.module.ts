import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './components/User/user.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [UserModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes("*");
  }
}
