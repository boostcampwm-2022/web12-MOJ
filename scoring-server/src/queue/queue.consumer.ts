import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { ScoringService } from 'src/scoring/scoring.service';
import { Job } from 'bull';

type MyPromise = Promise<any> & {
  submissionId: number;
};

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
    console.log(containerIndex);
    const promise = new Promise(async (resolve) => {
      await this.scoringService.createSubmission(job.data.data, containerIndex);
      this.isReadyContainer.push(containerIndex);
      resolve(null);
    }).then(() => {
      return job.data.data;
    }) as MyPromise;

    promise.submissionId = job.data.data;

    this.promises.push(promise);

    if (this.promises.length === 3) {
      const idx = await Promise.race(this.promises);
      this.promises = this.promises.filter((val) => val.submissionId !== idx);
    }
  }
}
