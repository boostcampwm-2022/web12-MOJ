import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { spawn } from 'child_process';
import { Testcase } from './entities/testcase.entity';
import { Repository } from 'typeorm';
import { Problem } from './entities/problem.entity';
import { Submission } from './entities/submission.entity';
import { Language } from './entities/language.entity';
@Injectable()
export class ScoringService {
  constructor(
    @InjectRepository(Testcase)
    private testcaseRepository: Repository<Testcase>,
    @InjectRepository(Problem) private problemRepository: Repository<Problem>,
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async createSubmission(submissionId: number) {
    const submission = await this.submissionRepository.findOne({
      select: {
        code: true,
        languageId: true,
        problemId: true,
      },
      where: {
        id: submissionId,
      },
    });

    if (!submission) {
      throw new NotFoundException('해당 제출이 없습니다.');
    }

    const [language, problem, testcases] = await Promise.all([
      this.languageRepository.findOne({
        select: {
          language: true,
        },
        where: {
          id: submission.languageId,
        },
      }),
      this.problemRepository.findOne({
        select: { timeLimit: true, memoryLimit: true },
        where: {
          id: submission.problemId,
        },
      }),
      this.testcaseRepository.find({
        select: {
          input: true,
          output: true,
        },
        where: {
          problemId: submission.problemId,
        },
      }),
    ]);
  }
}
