import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ORDER } from 'src/common/models/models';
import { OrderSchema } from './schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ORDER.name,
        useFactory: () => {
          return OrderSchema;
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
