import { Module } from '@nestjs/common';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';

@Module({
  controllers: [ScoringController],
  providers: [ScoringService],
})
export class ScoringModule {}
