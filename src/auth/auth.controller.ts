import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UserDTO } from '../user/dto/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { OTPCodeDTO, PhoneDTO } from './dto/phone.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Req() req) {
    return await this.authService.signIn(req.user);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() userDTO: UserDTO) {
    return await this.authService.signUp(userDTO);
  }

  @Post('generate-otp')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async generateOTP(@Body() body: PhoneDTO, @Req() req: any) {
    const delivered = await this.authService.sendOTPCode(
      body.phoneNumber,
      req.user.userId,
    );

    return delivered && 'Codigo OTP enviado';
  }

  @Post('validate-otp')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async validateOTP(@Body() body: OTPCodeDTO, @Req() req: any) {
    const delivered = await this.authService.validateOTPCode(
      body.code,
      req.user.userId,
    );

    return delivered && 'Codigo OTP enviado';
  }
}
