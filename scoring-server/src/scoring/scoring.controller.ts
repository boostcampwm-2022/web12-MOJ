import { Body, Controller, Post } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { SubmissionDTO } from './dtos/post-submission.dto';

@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post()
  async createSubmission(@Body() submissionDTO: SubmissionDTO) {
    return this.scoringService.createSubmission(submissionDTO);
  }
}
