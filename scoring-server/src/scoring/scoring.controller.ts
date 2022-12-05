import {
  Controller,
  Param,
  Post,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ScoringService } from './scoring.service';

@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post(':id')
  createSubmission(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('제출 번호가 숫자가 아닙니다.'),
      }),
    )
    submissionId: number,
  ) {
    return this.scoringService.insertQueue(submissionId);
  }
}
