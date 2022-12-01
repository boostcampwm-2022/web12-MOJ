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
import { execSync, spawn } from 'child_process';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScoringService {
  private queue = [];
  private isReady = true;

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

  async insertQueue(submissionId: number) {
    this.queue.push(submissionId);
  }

  @Cron('* * * * * *')
  async handleCron() {
    if (this.isReady && this.queue.length > 0) {
      this.isReady = false;
      const submissionId = this.queue.shift();
      await this.createSubmission(submissionId);
    }
  }

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

    const promises = [];
    const rootPath = this.configService.get('FILE_ROOT');
    const codeFileName = randomUUID();
    const submissionPath = path.resolve(rootPath, submissionId.toString());
    await fs.mkdir(submissionPath);
    const codeFilePath = path.resolve(submissionPath, codeFileName);
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

    const dockerContainer = execSync(`NAME=judger-${1} ./docker/run.sh`);

    const copyFile = execSync(
      `docker cp ${submissionPath}/. judger-${1}:/submission`,
    );

    const scoringProcess = spawn('docker', [
      'exec',
      'judger-1',
      'python3',
      '/judger/run.py',
      problem.timeLimit.toString(),
      problem.memoryLimit.toString(),
    ]);

    scoringProcess.stdout.on('data', async (data) => {
      fs.rm(submissionPath, { recursive: true, force: true });

      const resultArray = [
        '정답',
        '오답',
        '컴파일 에러',
        '시간 초과',
        '런타임 에러',
      ];

      try {
        const { result, memory, time } = JSON.parse(data.toString());
        const resultNumber = resultArray.findIndex((v) => v === result);

        const response = await this.httpService.axiosRef.post(
          this.configService.get('API_SERVER_URL') +
            `/api/submissions/results/${submissionId}`,
          {
            state: resultNumber === -1 ? 5 : resultNumber + 1,
            maxTime: time ?? 0,
            maxMemory: memory ?? 0,
          },
        );
        if (response.status !== 201)
          throw new InternalServerErrorException('server error');
      } catch (err) {
        console.log(err);
      }
      this.isReady = true;
    });
  }
}
