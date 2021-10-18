import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { EnvironmentService } from '../environment/environment.service';
import { EnvironmentModule } from '../environment/environment.module';
import { TwilioModule } from 'src/twilio/twilio.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvironmentModule],
      useFactory: async (_env: EnvironmentService) => ({
        secret: _env.get('JWT_SECRET'),
        signOptions: {
          expiresIn: _env.get('EXPIRES_IN'),
          audience: _env.get('APP_URL'),
        },
      }),
      inject: [EnvironmentService],
    }),
    TwilioModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, EnvironmentService],
})
export class AuthModule {}
