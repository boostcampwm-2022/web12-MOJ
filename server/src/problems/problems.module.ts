import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Example } from './entities/example.entity';
import { Problem } from './entities/problem.entity';
import { Testcase } from './entities/testcase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, Example, Testcase])],
})
export class ProblemsModule {}
