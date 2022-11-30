import { Test, TestingModule } from '@nestjs/testing';
import { ScoringService } from './scoring.service';

describe('Scoring', () => {
  let provider: ScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoringService],
    }).compile();

    provider = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
