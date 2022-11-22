import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { Example } from './entities/example.entity';
import { Problem } from './entities/problem.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem) private problemRepository: Repository<Problem>,
    @InjectRepository(Example) private exampleRepository: Repository<Example>,
  ) {}

  async create(createProblemDTO: CreateProblemDTO) {
    const problem = this.problemRepository.create(createProblemDTO);
    const savedProblem = await this.problemRepository.save(problem);
    const problemId = savedProblem.id;

    for (const problemExample of createProblemDTO.examples) {
      const example = this.exampleRepository.create({
        problemId,
        ...problemExample,
      });
      await this.exampleRepository.save(example);
    }
  }
}
