import {
  Controller,
  Req,
  BadRequestException,
  Get,
  Param,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get(':id')
  async getSubmissions(
    @Req() req: Request,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('문제 번호가 숫자가 아닙니다.'),
      }),
    )
    submissionId: number,
  ) {
    const session: any = req.session;

    if (!session.userId || !session.userName) {
      throw new UnauthorizedException('로그인이 되어있지 않습니다.');
    }

    return await this.submissionsService.getSubmissions(submissionId);
  }
}
