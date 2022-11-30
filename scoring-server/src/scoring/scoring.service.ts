import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Testcase } from './entities/testcase.entity';
import { Repository } from 'typeorm';
import { Problem } from './entities/problem.entity';
import { Submission } from './entities/submission.entity';
import { Language } from './entities/language.entity';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { promises as fs } from 'fs';
import { spawn } from 'child_process';
import { HttpService } from '@nestjs/axios';

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
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async createSubmission(submissionId: number) {
    console.log('start');
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

    const promises = [];
    const rootPath = this.configService.get('FILE_ROOT');
    const codeFilePath = path.resolve(rootPath, randomUUID());
    const testcaseFilePaths = testcases.reduce((acc, cur, idx) => {
      const inputPath = `${codeFilePath}.${(idx + 1).toString()}.in`;
      const outputPath = `${codeFilePath}.${(idx + 1).toString()}.out`;

      promises.push(
        fs.writeFile(inputPath, cur.input, 'utf-8'),
        fs.writeFile(outputPath, cur.output, 'utf-8'),
      );

      acc.push(inputPath, outputPath);
      return acc;
    }, []);

    promises.push(fs.writeFile(codeFilePath, submission.code, 'utf-8'));

    await Promise.all(promises);

    const scoringProcess = spawn('python3', [
      './python/run.py',
      language.language,
      problem.timeLimit,
      problem.memoryLimit,
      codeFilePath,
      ...testcaseFilePaths,
    ]);

    scoringProcess.stdout.on('data', async (data) => {
      fs.unlink(codeFilePath);
      testcaseFilePaths.forEach((path) => {
        fs.unlink(path);
      });

      try {
        const response = await this.httpService.axiosRef.post(
          this.configService.get('API_SERVER_URL') +
            `/api/submissions/results/${submissionId}`,
          {
            state: +data.toString(),
            maxTime: 100 + Math.floor(Math.random() * 4000),
            maxMemory: 20 + Math.floor(Math.random() * 100),
          },
        );
        if (response.status !== 201)
          throw new InternalServerErrorException('server error');
      } catch (err) {
        console.log(err);
      }
    });
  }
}
