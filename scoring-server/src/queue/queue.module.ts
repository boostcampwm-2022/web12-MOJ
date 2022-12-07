import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScoringModule } from 'src/scoring/scoring.module';
import { Consumer } from './queue.consumer';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'scoring',
    }),
    ScoringModule,
  ],
  providers: [Consumer],
})
export class QueueModule {}
