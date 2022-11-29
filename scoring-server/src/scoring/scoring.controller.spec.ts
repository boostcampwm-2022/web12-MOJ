import { Test, TestingModule } from '@nestjs/testing';
import { ScoringController } from './scoring.controller';

describe('ScoringController', () => {
  let controller: ScoringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoringController],
    }).compile();

    controller = module.get<ScoringController>(ScoringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
