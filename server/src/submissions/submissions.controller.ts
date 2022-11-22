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
    @Query('page')
    page: number,
  ) {
    try {
      const submissions = await this.submissionsService.findAll(page);
      return submissions;
    } catch (e) {
      console.error(e);
    }
  }
}
