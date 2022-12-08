import {
  ConflictException,
  forwardRef,
  Inject,
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
import { CachingService } from 'src/caching/caching.service';

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
    @Inject(forwardRef(() => CachingService))
    private readonly cachingService: CachingService,
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
    const cachedRange = await this.cachingService.findCachedSubmissionRange();
    if (cachedRange.start <= start && cachedRange.end >= end) {
      const cachedSumbission = await this.cachingService.findAllSubmission();
      return {
        submissions: cachedSumbission.filter(
          (submission) => submission.id >= start && submission.id <= end,
        ),
      };
    }

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
    const range = await this.submissionRepository.find({
      select: { id: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        id: 'DESC',
      },
    });

    const start = range.at(-1).id,
      end = range.at(0).id;

    const cachedRange = await this.cachingService.findCachedSubmissionRange();
    if (cachedRange.start <= start && cachedRange.end >= end) {
      const cachedSumbission = await this.cachingService.findAllSubmission();
      const allSubmissionsCount = await this.submissionRepository.count();
      const pageCount = Math.ceil(allSubmissionsCount / pageSize);
      return {
        submissions: cachedSumbission.filter(
          (submission) => submission.id >= start && submission.id <= end,
        ),
        currentPage: page,
        pageCount,
      };
    }

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

  async findOne(submissionID: number) {
    // TODO: 403 구현

    const submission = await this.submissionRepository.findOneBy({
      id: submissionID,
    });

    if (!submission) {
      throw new NotFoundException('해당 제출이 존재하지 않습니다.');
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

    if (!problem) throw new NotFoundException('해당 문제가 없습니다.');

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
      throw new NotFoundException('존재하지 않는 제출입니다. ');
    }

    const result = await this.resultRepository.findOneBy({ submissionId });

    if (!!result) {
      throw new ConflictException('해당 제출은 이미 채점되었습니다. ');
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
