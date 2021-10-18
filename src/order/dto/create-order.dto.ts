import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';

enum Payments {
  Efectivo,
  Tarjeta,
}

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsNotEmpty()
  @IsNumber()
  readonly declaredValue: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Payments)
  readonly paymentType: Payments;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsNumber()
  readonly serviceValue: number;

  @IsNotEmpty()
  @IsNumber()
  readonly estimateTime: number;

  @IsNotEmpty()
  @IsNumber()
  readonly distance: number;

  @IsNotEmpty()
  @IsNumber()
  readonly distanceTotal: number;
}
