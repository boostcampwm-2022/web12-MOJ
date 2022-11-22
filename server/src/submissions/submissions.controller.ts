import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Get()
  async findAll(
    @Query(
      'page',
      new DefaultValuePipe(1),
      new ParseIntPipe({
        exceptionFactory: () => {
          return new BadRequestException('page가 지정된 형식이 아닙니다.');
        },
      }),
    )
    page: number,
  ) {
    const submissions = await this.submissionsService.findAll(page);
    return submissions;
  }
}
