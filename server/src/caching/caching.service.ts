import { CACHE_MANAGER, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  SubmissionsService,
  SubmissionType,
} from 'src/submissions/submissions.service';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingService {
  constructor(
    @Inject(forwardRef(() => SubmissionsService))
    private readonly submissionService: SubmissionsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron('* * * * * *')
  async handleSubmissionCaching() {
    const newCache = await this.submissionService.findLatest(100);

    const promises = [
      this.cacheManager.set('cache:submissions:start', newCache.at(-1).id),
      this.cacheManager.set('cache:submissions:end', newCache.at(0).id),
      this.cacheManager.set('cache:submissions', newCache),
    ];

    await Promise.all(promises);
  }

  async findAllSubmission(): Promise<SubmissionType[]> {
    return await this.cacheManager.get('cache:submissions');
  }

  async findCachedSubmissionRange() {
    const promises = [
      this.cacheManager.get('cache:submissions:start'),
      this.cacheManager.get('cache:submissions:end'),
    ];

    const [start, end] = await Promise.all(promises);

    return {
      start,
      end,
    };
  }
}
