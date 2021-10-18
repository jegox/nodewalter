import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { UserDTO } from '../user/dto/user.dto';
import { TwilioService } from 'src/twilio/twilio.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly twilioService: TwilioService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getByUsername(username);
    const isValidPassword = await this.userService.checkPassword(
      password,
      user.password,
    );

    if (user && isValidPassword) return user;

    return null;
  }

  async signIn(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(userDTO: UserDTO) {
    return this.userService.store(userDTO);
  }

  async sendOTPCode(phone: string, userId: string): Promise<boolean> {
    const code = Date.now().toString().slice(-5);
    const { errorCode } = await this.twilioService.sendSMS(
      phone,
      `Tu codigo de verificación es: ${code}`,
    );

    !errorCode && (await this.twilioService.saveOTPCode(code, userId, phone));
    return !errorCode;
  }

  async validateOTPCode(code: string, userId: string): Promise<boolean> {
    const twilio = await this.twilioService.getOTPCode(code, userId);

    if (!twilio)
      throw new HttpException('Code not authorized.', HttpStatus.BAD_REQUEST);

    if (twilio.expiredTime >= Date.now())
      await this.sendOTPCode(twilio.phone, userId);

    return await this.twilioService.removeOTPCode(code, twilio.phone);
  }
}
