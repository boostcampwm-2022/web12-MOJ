import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { Language } from './entities/language.entity';
import { Submission } from './entities/submission.entity';
import { Testcase } from './entities/testcase.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ScoringService } from './scoring.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem, Language, Submission, Testcase]),
    HttpModule,
  ],
  controllers: [],
  providers: [ScoringService, ConfigService],
  exports: [ScoringService],
})
export class ScoringModule {}
