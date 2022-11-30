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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Problem,
      Example,
      Testcase,
      Submission,
      Language,
    ]),
    HttpModule,
  ],
  providers: [ProblemsService],
  controllers: [ProblemsController],
})
export class ProblemsModule {}
