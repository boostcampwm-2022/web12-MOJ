import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from 'src/submissions/entities/language.entity';
import { Problem } from 'src/problems/entities/problem.entity';
import { User } from 'src/users/entities/user.entity';
import { Result } from './entities/result.entity';
import { State } from './entities/state.entity';
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

  async findAll(page: number) {
    const pageSize = 20;

    const submissions = await this.submissionRepository
      .createQueryBuilder('submission')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('submission.id', 'DESC')
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
      ? { name: '채점 중' }
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
}
