import { Module } from '@nestjs/common';
import { ScoringModule } from './scoring/scoring.module';

@Module({
  imports: [ScoringModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
