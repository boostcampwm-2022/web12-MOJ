import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScoringModule } from 'src/scoring/scoring.module';
import { Consumer } from './queue.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'scoring',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ScoringModule,
  ],
  providers: [Consumer],
})
export class QueueModule {}
