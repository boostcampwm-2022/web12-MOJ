import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { Result } from './entities/result.entity';
import { State } from './entities/state.entity';
import { Submission } from './entities/submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Language, Result, State, Submission])],
})
export class SubmissionsModule {}
