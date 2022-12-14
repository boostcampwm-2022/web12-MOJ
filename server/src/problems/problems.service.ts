import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { PostTestCaseDTO } from './dtos/post-testcase.dto';
import { UpdateProblemDTO } from './dtos/update-problem.dto';
import { PostSubmissionDTO } from './dtos/post-submission.dto';
import { Example } from './entities/example.entity';
import { Problem } from './entities/problem.entity';
import { Testcase } from './entities/testcase.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import { Language } from 'src/submissions/entities/language.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProblemsService {
  constructor(
    private readonly http: HttpService,
    @InjectRepository(Problem) private problemRepository: Repository<Problem>,
    @InjectRepository(Example) private exampleRepository: Repository<Example>,
    @InjectRepository(Testcase)
    private testcaseRepository: Repository<Testcase>,
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly configService: ConfigService,
    @InjectQueue('scoring') private scoringQueue: Queue,
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

  async findOneTestCase(id: number, userId: number) {
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
      throw new NotFoundException('?????? ????????? ???????????? ????????????.');
    }

    if (problem.userId !== userId) {
      throw new ForbiddenException('?????? ????????? ????????????.');
    }

    return { title: problem.title, testCases };
  }

  async findOne(id: number, userId: number | false) {
    const problem = await this.problemRepository.findOneBy({ id });

    if (!problem) throw new NotFoundException('?????? ????????? ????????????.');

    if (!problem.visible) {
      if (!userId || problem.userId !== userId) {
        throw new ForbiddenException('????????? ????????????.');
      }
    }

    const example = await this.exampleRepository.find({
      select: ['id', 'input', 'output'],
      where: { problemId: id },
    });

    return { ...problem, examples: example };
  }

  async updateOne(
    id: number,
    session: any,
    updateProblemDTO: UpdateProblemDTO,
  ) {
    const problem = await this.problemRepository.findOneBy({ id });
    if (!problem) throw new NotFoundException('?????? ????????? ????????????.');
    if (problem.userId !== session.userId) {
      throw new ForbiddenException('????????? ????????????.');
    }

    if (updateProblemDTO.visible === true && !problem.visible) {
      const testcaseCount = await this.testcaseRepository.countBy({
        problemId: problem.id,
      });

      if (testcaseCount === 0) {
        throw new ConflictException(
          'TC??? ?????? ?????? ????????? ?????? ????????? ????????? ??? ????????????.',
        );
      }
    }

    Object.assign(problem, updateProblemDTO);
    await this.dataSource.manager.transaction(
      async (transactionEntityManager: EntityManager) => {
        await transactionEntityManager.save(problem);
        if (updateProblemDTO.examples) {
          await transactionEntityManager
            .createQueryBuilder()
            .delete()
            .from(Example)
            .where('problemId = :id', { id: id })
            .execute();

          await transactionEntityManager
            .createQueryBuilder()
            .insert()
            .into(Example)
            .values(
              updateProblemDTO.examples.map((example) => ({
                ...example,
                problemId: id,
              })),
            )
            .execute();
        }
      },
    );
  }

  async findAll(
    page: number,
    username: string | undefined,
    session: { userId: number; userName: string },
  ) {
    if (!username) {
      const problems = await this.problemRepository
        .createQueryBuilder('problem')
        .select(['problem.id', 'problem.title'])
        .where('problem.visible = :visible', { visible: true })
        .leftJoin(
          (qb) => {
            return qb
              .select('submission.problemId', 'problem_id')
              .addSelect('COUNT(*)', 'count')
              .from(Submission, 'submission')
              .groupBy('problem_id');
          },
          'submission',
          'problem.id = "submission"."problem_id"',
        )
        .leftJoin(User, 'user', 'user.id = problem.userId')
        .addSelect('user.name')
        .addSelect('COALESCE(submission.count, 0)', 'count')
        .offset((page - 1) * 20)
        .limit(20)
        .orderBy('problem.id', 'DESC')
        .getRawMany();

      const problemCount = await this.problemRepository.count({
        where: { visible: true },
      });
      const pageCount = Math.ceil(problemCount / 20);

      return {
        problems: problems.map(
          ({ problem_id, problem_title, count, user_name }) => {
            return {
              id: problem_id,
              title: problem_title,
              count: count,
              username: user_name,
            };
          },
        ),
        pageCount,
        currentPage: Number(page),
      };
    } else if (session.userName === username) {
      const problems = await this.problemRepository
        .createQueryBuilder('problem')
        .select([
          'problem.id',
          'problem.title',
          'problem.visible',
          'problem.createdAt',
        ])
        .where('problem.userId = :userId', { userId: session.userId })
        // .andWhere('problem.deletedAt IS NOT NULL')
        .skip((page - 1) * 20)
        .take(20)
        .orderBy('problem.id', 'DESC')
        .getMany();

      const problemCount = await this.problemRepository.count({
        where: { userId: session.userId },
      });
      const pageCount = Math.ceil(problemCount / 20);
      return { problems, pageCount, currentPage: Number(page) };
    } else {
      throw new ForbiddenException('?????? ????????? ????????? ????????? ??? ????????????.');
    }
  }

  async createSubmission(
    userId: number,
    problemId: number,
    postSubmissionDTO: PostSubmissionDTO,
  ) {
    const problem = await this.problemRepository.findOneBy({ id: problemId });

    if (!problem) throw new NotFoundException('?????? ????????? ????????????.');

    if (!problem.visible) {
      throw new ForbiddenException('????????? ????????????.');
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
      throw new NotFoundException('?????? ????????? ???????????? ????????????.');

    const newSubmission = new Submission();

    newSubmission.code = postSubmissionDTO.code;
    newSubmission.languageId = language.id;
    newSubmission.problemId = problemId;
    newSubmission.userId = userId;

    await this.submissionRepository.save(newSubmission);

    const scoringJob = await this.scoringQueue.add(
      {
        data: newSubmission.id,
      },
      {
        jobId: newSubmission.id,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
    // const response = await this.http.axiosRef.post(
    //   this.configService.get('SCORING_SERVER') + `/scoring/${newSubmission.id}`,
    // );

    // if (scoringJob.status !== 201)
    //   throw new InternalServerErrorException('server error');
  }

  async createTestCase(
    userId: number,
    problemId: number,
    postTestCaseDTO: PostTestCaseDTO,
  ) {
    const problem = await this.problemRepository.findOneBy({ id: problemId });

    if (!problem) throw new NotFoundException('?????? ????????? ????????????.');

    if (!userId || problem.userId !== userId) {
      throw new ForbiddenException('????????? ????????????.');
    }

    if (postTestCaseDTO.testcase.length > 50) {
      throw new BadRequestException(
        '????????? ????????? ????????? 50?????? ?????? ??? ????????????.',
      );
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

  async deleteProblem(userId: number, problemId: number) {
    const problem = await this.problemRepository.findOne({
      select: {
        userId: true,
      },
      where: {
        id: problemId,
      },
    });

    if (problem.userId !== userId) {
      throw new ForbiddenException('????????? ????????????. ');
    }

    await this.problemRepository
      .createQueryBuilder('problem')
      .softDelete()
      .where('id = :id', {
        id: problemId,
      })
      .andWhere('deletedAt IS NULL')
      .execute();
  }
}
