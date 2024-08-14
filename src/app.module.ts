import { Module } from '@nestjs/common';
import { UserModule } from './components/User/user.module';

@Module({
  imports: [UserModule],
})
export class AppModule {}
