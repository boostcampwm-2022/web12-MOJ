import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from 'src/submissions/entities/language.entity';
import { Problem } from 'src/problems/entities/problem.entity';
import { User } from 'src/users/entities/user.entity';
import { Result } from './entities/result.entity';
import { State } from './entities/state.entity';
import { PostResultDTO } from './dtos/post-result.dto';

export interface SubmissionType {
  id: number;
  user: string;
  createAt: string;
  title: string;
  time: number;
  result: string;
}

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(Problem)
    private problemRepository: Repository<Problem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
  ) {}

  async findLatest(count: number): Promise<SubmissionType[]> {
    const submissions: SubmissionType[] = await this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndMapOne(
        'submission.user',
        User,
        'user',
        'user.id = submission.userId',
      )
      .leftJoinAndMapOne(
        'submission.problemId',
        Problem,
        'problem',
        'problem.id = submission.problemId',
      )
      .leftJoinAndMapOne(
        'submission.id',
        Result,
        'result',
        'result.submissionId = submission.id',
      )
      .leftJoinAndMapOne(
        'submission.result',
        State,
        'state',
        'state.id = result.stateId',
      )
      .select([
        'submission.id AS id',
        'user.name AS user',
        'problem.title AS title',
        'result.time AS time',
        'state.name AS result',
      ])
      .addSelect('submission.createdAt', 'createdAt')
      .orderBy('submission.id', 'DESC')
      .limit(count)
      .getRawMany();

    return submissions;
  }

  async findAllByRange(start: number, end: number) {
    const submissions = await this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndMapOne(
        'submission.user',
        User,
        'user',
        'user.id = submission.userId',
      )
      .leftJoinAndMapOne(
        'submission.problemId',
        Problem,
        'problem',
        'problem.id = submission.problemId',
      )
      .leftJoinAndMapOne(
        'submission.id',
        Result,
        'result',
        'result.submissionId = submission.id',
      )
      .leftJoinAndMapOne(
        'submission.result',
        State,
        'state',
        'state.id = result.stateId',
      )
      .select([
        'submission.id AS id',
        'user.name AS user',
        'problem.title AS title',
        'result.time AS time',
        'state.name AS result',
      ])
      .addSelect('submission.createdAt', 'createdAt')
      .andWhere({ id: Between(start, end) })
      .orderBy('submission.id', 'DESC')
      .getRawMany();
    return { submissions };
  }

  async findAll(page: number) {
    const pageSize = 20;

    const submissions = await this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndMapOne(
        'submission.user',
        User,
        'user',
        'user.id = submission.userId',
      )
      .leftJoinAndMapOne(
        'submission.problemId',
        Problem,
        'problem',
        'problem.id = submission.problemId',
      )
      .leftJoinAndMapOne(
        'submission.id',
        Result,
        'result',
        'result.submissionId = submission.id',
      )
      .leftJoinAndMapOne(
        'submission.result',
        State,
        'state',
        'state.id = result.stateId',
      )
      .select([
        'submission.id AS id',
        'user.name AS user',
        'problem.title AS title',
        'result.time AS time',
        'state.name AS result',
      ])
      .addSelect('submission.createdAt', 'createdAt')
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .orderBy('submission.id', 'DESC')
      .getRawMany();

    const allSubmissionsCount = await this.submissionRepository.count();
    const pageCount = Math.ceil(allSubmissionsCount / pageSize);
    return { submissions, currentPage: page, pageCount };
  }

  async findOne(submissionID: number, userId: number) {
    const submission = await this.submissionRepository.findOneBy({
      id: submissionID,
    });

    if (!submission) {
      throw new NotFoundException('?????? ????????? ???????????? ????????????.');
    }

    const problemId = submission.problemId;

    const problemOwnerId = (
      await this.problemRepository.findOne({
        select: { userId: true },
        where: {
          id: submission.problemId,
        },
      })
    ).userId;

    if (problemOwnerId !== userId && submission.userId !== userId) {
      const [{ count }] = await this.resultRepository
        .createQueryBuilder('result')
        .innerJoinAndMapOne(
          'result.submissionId',
          (subQuery) =>
            subQuery
              .select()
              .from(Submission, 'submission')
              .where('submission.userId = :userid', { userid: userId })
              .andWhere('submission.problemId = :problemid', {
                problemid: problemId,
              }),
          't1',
          't1.id = result.submissionId',
        )
        .where('result.stateId = :stateId', { stateId: 1 })
        .select('COUNT(*) as count')
        .getRawMany();

      if (Number(count) === 0) {
        throw new ForbiddenException('????????? ?????? ??? ?????? ???????????????.');
      }
    }

    const promises = [];

    promises.push(
      this.resultRepository.findOne({
        select: {
          stateId: true,
          time: true,
          memory: true,
        },
        where: {
          submissionId: submissionID,
        },
      }),
    );

    promises.push(
      this.languageRepository.findOne({
        select: {
          language: true,
        },
        where: {
          id: submission.languageId,
        },
      }),
    );

    promises.push(
      this.userRepository.findOne({
        select: {
          name: true,
        },
        where: {
          id: submission.userId,
        },
      }),
    );

    promises.push(
      this.problemRepository.findOneBy({
        id: submission.problemId,
      }),
    );

    const [result, language, user, problem] = await Promise.all(promises);

    if (!problem) throw new NotFoundException('?????? ????????? ????????????.');

    const state = !result
      ? { name: null }
      : await this.stateRepository.findOne({
          select: {
            name: true,
          },
          where: {
            id: result.stateId,
          },
        });

    return {
      submission: {
        id: submission.id,
        user: user.name,
        code: submission.code,
        language: language.language,
        datetime: submission.createdAt.getTime(),
        state: state.name,
        stateId: result?.stateId ?? 0,
        time: result?.time,
        memory: result?.memory ?? 0,
      },
      problem: {
        title: problem.title,
      },
    };
  }

  async createResult(submissionId: number, postResultDTO: PostResultDTO) {
    const submission = await this.submissionRepository.findOneBy({
      id: submissionId,
    });

    if (!submission) {
      throw new NotFoundException('???????????? ?????? ???????????????.');
    }

    const result = await this.resultRepository.findOneBy({ submissionId });

    if (!!result) {
      throw new ConflictException('?????? ????????? ?????? ?????????????????????.');
    }

    try {
      const newResult = new Result();

      newResult.time = postResultDTO.maxTime;
      newResult.memory = postResultDTO.maxMemory;
      newResult.stateId = postResultDTO.state;
      newResult.submissionId = submissionId;

      await this.resultRepository.save(newResult);
    } catch (err) {
      return err.message;
    }
  }
}
