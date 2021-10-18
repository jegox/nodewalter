import * as mongoose from 'mongoose';

export interface ITwilio extends Document {
  code: string;
  expiredTime: number;
  userId: mongoose.Types.ObjectId;
  phone: string;
}
