import {
  HttpException,
  HttpStatus,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { GetTestCaseDTO, PostTestCaseDTO } from './dtos/get-testcase.dto';
import { PostSubmissionDTO } from './dtos/post-submission.dto';
import { Example } from './entities/example.entity';
import { Problem } from './entities/problem.entity';
import { Testcase } from './entities/testcase.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import { Language } from 'src/submissions/entities/language.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem) private problemRepository: Repository<Problem>,
    @InjectRepository(Example) private exampleRepository: Repository<Example>,
    @InjectRepository(Testcase)
    private testcaseRepository: Repository<Testcase>,
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
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

  async getTestCase(id: number, userId: number) {
    const [testCases, problem] = await Promise.all([
      this.testcaseRepository.find({
        select: { id: true, input: true, output: true },
        where: { problemId: id },
      }),
      this.problemRepository.findOne({
        select: { title: true, userId: true },
        where: { id },
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


  async postSubmission(
    userId: number,
    problemId: number,
    postSubmissionDTO: PostSubmissionDTO,
  ) {
    const problem = await this.problemRepository.findOneBy({ id: problemId });

    if (!problem) throw new NotFoundException('해당 문제가 없습니다.');

    if (!problem.visible || problem.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    const language = await this.languageRepository.findOne({
      select: {
        id: true,
      },
      where: {
        language: postSubmissionDTO.language,
      },
    });

    if (!language)
      throw new NotFoundException('해당 언어는 지원하지 않습니다.');

    const newSubmission = new Submission();

    newSubmission.code = postSubmissionDTO.code;
    newSubmission.languageId = language.id;
    newSubmission.problemId = problemId;
    newSubmission.userId = userId;

    await this.submissionRepository.save(newSubmission);
  }


  async postTestcase(
    userId: number,
    problemId: number,
    postTestCaseDTO: PostTestCaseDTO,
  ) {
    const problem = await this.problemRepository.findOneBy({ id: problemId });

    if (!problem) throw new NotFoundException('해당 문제가 없습니다.');

    if (!userId || problem.userId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.dataSource.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        await transactionEntityManager
          .createQueryBuilder()
          .delete()
          .from(Testcase)
          .where('problemId = :id', { id: problemId })
          .execute();

        await transactionEntityManager
          .createQueryBuilder()
          .insert()
          .into(Testcase)
          .values(
            [...postTestCaseDTO.testcase].map((tc) => ({
              ...tc,
              problemId: problemId,
            })),
          )
          .execute();
      },
    );
  }
}
