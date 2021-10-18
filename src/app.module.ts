import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EnvironmentModule } from './environment/environment.module';
import { EnvironmentService } from './environment/environment.service';
import { OrderModule } from './order/order.module';
import { TwilioModule } from './twilio/twilio.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [EnvironmentModule],
      useFactory: async (_env: EnvironmentService) => ({
        uri: _env.get('URI_MONGODB'),
      }),
      inject: [EnvironmentService],
    }),
    UserModule,
    AuthModule,
    EnvironmentModule,
    OrderModule,
    TwilioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
