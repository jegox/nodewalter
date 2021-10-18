import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    date: { type: Date, required: true },
    declaredValue: { type: Number, required: true },
    distance: { type: Number, required: true },
    distanceTotal: { type: Number, required: true },
    estimateTime: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    paymentType: {
      type: String,
      required: true,
      enum: ['Efectivo', 'Tarjeta'],
    },
    phone: { type: String, required: true },
    serviceValue: { type: Number, required: true },
    trackingStep: {
      type: String,
      required: true,
      enum: ['Inicio', 'Llegada', 'Entrega', 'Evaluación'],
    },
  },
  { timestamps: true, versionKey: false },
);
