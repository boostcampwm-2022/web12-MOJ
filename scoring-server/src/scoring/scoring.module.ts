import { Module } from '@nestjs/common';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { Language } from './entities/language.entity';
import { Submission } from './entities/submission.entity';
import { Testcase } from './entities/testcase.entity';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem, Language, Submission, Testcase]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [ScoringController],
  providers: [ScoringService],
})
export class ScoringModule {}
