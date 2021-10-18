import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;
}

export class OTPCodeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly code: string;
}
