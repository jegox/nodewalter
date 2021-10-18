import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GeoPointsDTO } from './dto/geo-points.dto';

@ApiTags('orders')
@UseGuards(AuthGuard('jwt'))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    return await this.orderService.create(createOrderDto, req.user.userId);
  }

  @Post('calculate-service')
  @HttpCode(HttpStatus.OK)
  calculateService(@Body() geoPointsDto: GeoPointsDTO) {
    return this.orderService.calculateValueService(geoPointsDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @Patch('next-tracking-step/:id')
  @HttpCode(HttpStatus.OK)
  async updateTrackingStep(@Param('id') id: string) {
    return await this.orderService.nextStep(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(id);
  }
}
