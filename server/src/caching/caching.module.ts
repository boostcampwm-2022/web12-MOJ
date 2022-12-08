import { Module, CacheModule, forwardRef } from '@nestjs/common';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { CachingService } from './caching.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => SubmissionsModule),
  ],
  exports: [CachingService],
  providers: [CachingService],
})
export class CachingModule {}
