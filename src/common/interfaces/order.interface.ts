import * as mongoose from 'mongoose';

export interface IOrder extends Document {
  city: string;
  date: Date;
  declaredValue: string;
  distance: number;
  distanceTotal: number;
  estimateTime: number;
  userId: mongoose.Schema.Types.ObjectId;
  paymentType: string;
  phone: string;
  serviceValue: number;
  trackingStep: string;
}
