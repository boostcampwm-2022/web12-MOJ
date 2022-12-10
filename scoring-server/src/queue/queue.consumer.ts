import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { ScoringService } from 'src/scoring/scoring.service';
import { Job } from 'bull';

class MyPromise<T> extends Promise<T> {
  submissionId: number;

  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    super(executor);
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): MyPromise<TResult1 | TResult2> {
    return new MyPromise((resolve, reject) => {
      super.then(
        (value) => {
          resolve(onfulfilled(value));
        },
        (reason) => {
          reject(onrejected(reason));
        },
      );
    });
  }
}

@Processor('scoring')
export class Consumer {
  constructor(
    private readonly scoringService: ScoringService,
    private readonly configService: ConfigService,
  ) {}

  private containerCount = parseInt(
    this.configService.get('CONTAINER_COUNT') || '1',
  );
  private promises = [];
  private isReadyContainer = Array.from(
    { length: this.containerCount },
    (_, i) => i,
  );

  @Process()
  async handleSubmission(job: Job) {
    const containerIndex = this.isReadyContainer.shift();
    const executeScoring = new MyPromise(async (resolve) => {
      await this.scoringService.createSubmission(job.data.data, containerIndex);
      this.isReadyContainer.push(containerIndex);
      resolve(job.data.data);
    });

    executeScoring.submissionId = job.data.data;

    this.promises.push(executeScoring);

    if (this.promises.length === 3) {
      const idx = await Promise.race(this.promises);
      this.promises = this.promises.filter((val) => val.submissionId !== idx);
    }
  }
}
