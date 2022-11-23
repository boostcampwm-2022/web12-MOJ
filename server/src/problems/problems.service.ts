import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { GetTestCaseDTO } from './dtos/get-testcase.dto';
import { Example } from './entities/example.entity';
import { Problem } from './entities/problem.entity';
import { Testcase } from './entities/testcase.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem) private problemRepository: Repository<Problem>,
    @InjectRepository(Example) private exampleRepository: Repository<Example>,
    @InjectRepository(Testcase)
    private testcaseRepository: Repository<Testcase>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async create(createProblemDTO: CreateProblemDTO) {
    await this.dataSource.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        const problem = this.problemRepository.create(createProblemDTO);
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

  async getTestCase(getTestCaseDTO: GetTestCaseDTO, userId: number) {
    const [testCases, problem] = await Promise.all([
      this.testcaseRepository.find({
        select: { id: true, input: true, output: true },
        where: { problemId: getTestCaseDTO.id },
      }),
      this.problemRepository.findOne({
        select: { title: true, userId: true },
        where: { id: getTestCaseDTO.id },
      }),
    ]);

    if (!problem) {
      throw new HttpException(
        '해당 문제가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (problem.userId !== userId) {
      throw new HttpException('접근 권한이 없습니다.', HttpStatus.FORBIDDEN);
    }

    return { title: problem.title, testCases };
  }
}
