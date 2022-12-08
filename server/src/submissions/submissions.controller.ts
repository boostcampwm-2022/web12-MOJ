import {
  Controller,
  Req,
  BadRequestException,
  Get,
  Param,
  ParseIntPipe,
  UnauthorizedException,
  Query,
  DefaultValuePipe,
  Post,
  Body,
} from '@nestjs/common';
import { Request } from 'express';
import { PostResultDTO } from './dtos/post-result.dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('start', new DefaultValuePipe(-1), ParseIntPipe) start: number,
    @Query('end', new DefaultValuePipe(-1), ParseIntPipe) end: number,
  ) {
    if (start === -1 || end === -1) {
      return this.submissionsService.findAll(page);
    }
    return this.submissionsService.findAllByRange(start, end);
  }

  @Get(':id')
  async findOne(
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

    return await this.submissionsService.findOne(submissionId);
  }

  @Post('results/:id')
  async createResult(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('문제 번호가 숫자가 아닙니다.'),
      }),
    )
    submissionId: number,
    @Body() postResultDTO: PostResultDTO,
  ) {
    return this.submissionsService.createResult(submissionId, postResultDTO);
  }
}
