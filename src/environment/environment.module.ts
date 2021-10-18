import { Module } from '@nestjs/common';
import { EnvironmentService } from './environment.service';

@Module({
  providers: [
    {
      provide: EnvironmentService,
      useValue: new EnvironmentService(),
    },
  ],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
