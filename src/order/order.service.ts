import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { IOrder } from 'src/common/interfaces/order.interface';
import { IPosition } from 'src/common/interfaces/other.interface';
import { ORDER } from 'src/common/models/models';
import { CreateOrderDto } from './dto/create-order.dto';
import { GeoPointsDTO } from './dto/geo-points.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  private readonly costKilometer = 4000;

  constructor(@InjectModel(ORDER.name) private readonly model: Model<IOrder>) {}

  async create(createOrderDto: CreateOrderDto, userId: any): Promise<IOrder> {
    return await this.model.create({
      ...createOrderDto,
      date: new Date(),
      userId: new Types.ObjectId(userId),
      trackingStep: 'Inicio',
    });
  }

  async findAll(): Promise<IOrder[]> {
    return await this.model.find();
  }

  async findOne(id: string): Promise<IOrder> {
    return await this.model.findById(id);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<boolean> {
    const { modifiedCount } = await this.model.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updateOrderDto },
    );

    return !!modifiedCount;
  }

  async remove(id: string): Promise<boolean> {
    const removed = await this.model.findByIdAndRemove(id);
    return !!removed;
  }

  async nextStep(id: string): Promise<any> {
    const trackingStep = ['Inicio', 'Llegada', 'Entrega', 'Evaluación'];
    const order = await this.findOne(id);

    const index = trackingStep.indexOf(order.trackingStep);
    if (index === 3)
      throw new HttpException(
        'Tracking step is not available.',
        HttpStatus.BAD_REQUEST,
      );

    return await this.update(id, { trackingStep: trackingStep[index + 1] });
  }

  calculateValueService(geoPoints: GeoPointsDTO) {
    const { points } = geoPoints;
    const distances = [];
    for (let i = 0; i < points.length - 1; i++) {
      distances.push(this.__positionDistance(points[i], points[i + 1]));
    }

    const distance = distances.reduce((acc, cur) => acc + cur);
    if (distance <= 1) return { price: this.costKilometer, distance };

    return { price: this.costKilometer * distance, distance };
  }

  private __positionDistance(origin: IPosition, destination: IPosition) {
    const { lat: lat1, lng: lon1 } = origin;
    const { lat: lat2, lng: lon2 } = destination;

    const toRad = (point: number) => (point * Math.PI) / 180;

    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);

    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = (R * c) / 1000;
    return parseFloat(d.toFixed(2));
  }
}
