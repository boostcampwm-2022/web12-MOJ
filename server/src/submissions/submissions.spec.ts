import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsService } from './submissions.service';

describe('Submissions', () => {
  let provider: SubmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmissionsService],
    }).compile();

    provider = module.get<SubmissionsService>(SubmissionsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
