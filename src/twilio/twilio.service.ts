import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { TWILIO } from '../common/models/models';
import { EnvironmentService } from 'src/environment/environment.service';
import { Model, Types } from 'mongoose';
import { ITwilio } from 'src/common/interfaces/twilio.interface';

@Injectable()
export class TwilioService {
  constructor(
    @InjectTwilio() private readonly client: TwilioClient,
    private _env: EnvironmentService,
    @InjectModel(TWILIO.name) private readonly model: Model<ITwilio>,
  ) {}

  async sendSMS(phoneNumber: string, body: string) {
    try {
      return await this.client.messages.create({
        body,
        from: this._env.get('TWILIO_PHONE_NUMBER'),
        to: phoneNumber,
      });
    } catch (e) {
      console.log({ e });
      throw new Error(e);
    }
  }

  async saveOTPCode(
    code: string,
    userId: string,
    phone: string,
  ): Promise<ITwilio> {
    const date = new Date();
    const expiredTime = date.setMinutes(date.getMinutes() + 1);
    return await this.model.create({ code, userId, expiredTime, phone });
  }

  async getOTPCode(code: string, userId: string): Promise<ITwilio> {
    return await this.model.findOne({
      code,
      userId: new Types.ObjectId(userId),
    });
  }

  async removeOTPCode(code: string, phone: string): Promise<boolean> {
    const { deletedCount } = await this.model.remove({ code, phone });
    return !!deletedCount;
  }
}
