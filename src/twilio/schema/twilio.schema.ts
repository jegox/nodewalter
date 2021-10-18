import * as mongoose from 'mongoose';

export const TwilioSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    phone: { type: String, required: true },
    expiredTime: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);
