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
import { exec, spawn } from 'child_process';
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
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async createSubmission(submissionId: number, containerIndex: number) {
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

    const [problem, testcases] = await Promise.all([
      // TODO: 추후 언어 추가 예정
      /*
      this.languageRepository.findOne({
        select: {
          language: true,
        },
        where: {
          id: submission.languageId,
        },
      }),
      */
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
    testcases.reduce((acc, cur, idx) => {
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

    const execPromise = async (cmd: string) => {
      return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
          if (err) {
            reject(err);
          } else {
            resolve({ stdout, stderr });
          }
        });
      });
    };

    await execPromise(
      `NAME=judger-${containerIndex} ./docker/run.sh ${containerIndex}`,
    );

    await execPromise(
      `docker cp ${submissionPath}/. judger-${containerIndex}:/submission`,
    );

    const scoringProcess = spawn('docker', [
      'exec',
      `judger-${containerIndex}`,
      'python3',
      '/judger/run.py',
      problem.timeLimit.toString(),
      problem.memoryLimit.toString(),
    ]);

    return await new Promise((resolve, reject) => {
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
          reject(err);
        }
        resolve(null);
      });
    });
  }
}
