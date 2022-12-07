import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from 'src/submissions/entities/language.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import { Example } from './entities/example.entity';
import { Problem } from './entities/problem.entity';
import { Testcase } from './entities/testcase.entity';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Problem,
      Example,
      Testcase,
      Submission,
      Language,
    ]),
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
    HttpModule,
  ],
  providers: [ProblemsService],
  controllers: [ProblemsController],
})
export class ProblemsModule {}
