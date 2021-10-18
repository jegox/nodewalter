import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TwilioModule as TwilioSMSModule } from 'nestjs-twilio';

import { TWILIO } from '../common/models/models';
import { EnvironmentModule } from 'src/environment/environment.module';
import { EnvironmentService } from 'src/environment/environment.service';
import { TwilioService } from './twilio.service';
import { TwilioSchema } from './schema/twilio.schema';

@Module({
  imports: [
    EnvironmentModule,
    MongooseModule.forFeatureAsync([
      {
        name: TWILIO.name,
        useFactory: () => {
          return TwilioSchema;
        },
      },
    ]),
    TwilioSMSModule.forRootAsync({
      imports: [EnvironmentModule],
      useFactory: async (_env: EnvironmentService) => ({
        accountSid: _env.get('TWILIO_ACCOUNT_SID'),
        authToken: _env.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [EnvironmentService],
    }),
  ],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}
