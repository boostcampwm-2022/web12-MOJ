import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { Example } from './entities/example.entity';
import { Problem } from './entities/problem.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem) private problemRepository: Repository<Problem>,
    @InjectRepository(Example) private exampleRepository: Repository<Example>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async create(createProblemDTO: CreateProblemDTO, userId: number) {
    await this.dataSource.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        const problem = this.problemRepository.create({
          ...createProblemDTO,
          userId,
        });
        const savedProblem = await transactionEntityManager.save(problem);
        const problemId = savedProblem.id;

        for (const problemExample of createProblemDTO.examples) {
          const example = this.exampleRepository.create({
            problemId,
            ...problemExample,
          });
          await transactionEntityManager.save(example);
        }
      },
    );
  }

  async findOne(id: number, userId: number | false) {
    const problem = await this.problemRepository.findOneBy({ id });

    if (!problem) throw new NotFoundException('해당 문제가 없습니다.');

    if (!problem.visible) {
      if (!userId || problem.userId !== userId) {
        throw new ForbiddenException('권한이 없습니다.');
      }
    }

    const example = await this.exampleRepository.find({
      select: ['id', 'input', 'output'],
      where: { problemId: id },
    });

    return { ...problem, examples: example };
  }
}
