import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  BadRequestException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { PostTestCaseDTO } from './dtos/post-testcase.dto';
import { UpdateProblemDTO } from './dtos/update-problem.dto';
import { ProblemsService } from './problems.service';
import { PostSubmissionDTO } from './dtos/post-submission.dto';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createProblemDTO: CreateProblemDTO,
  ) {
    const session: any = req.session;

    if (!!session.userId && !!session.userName) {
      return this.problemsService.create(createProblemDTO, session.userId);
    } else {
      throw new UnauthorizedException('로그인이 되어있지 않습니다.');
    }
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('username') username: string | undefined,
  ) {
    const session: any = req.session;

    if (username && !session.userId) throw new UnauthorizedException();

    return this.problemsService.findAll(page, username, session);
  }

  @Get('/:id')
  async findOne(
    @Req() req: Request,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('문제 번호가 숫자가 아닙니다.'),
      }),
    )
    id: number,
  ) {
    const session: any = req.session;

    if (!!session.userId && !!session.userName) {
      return this.problemsService.findOne(id, session.userId);
    } else {
      return this.problemsService.findOne(id, false);
    }
  }

  @Patch('/:id')
  async updateOne(
    @Req() req: Request,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('문제 번호가 숫자가 아닙니다.'),
      }),
    )
    id: number,
    @Body() updateProblemDTO: UpdateProblemDTO,
  ) {
    const session: any = req.session;
    if (!session.userId) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    return this.problemsService.updateOne(id, session, updateProblemDTO);
  }

  @Get(':id/tc')
  async getTestcase(
    @Req() req: Request,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('문제 번호가 숫자가 아닙니다.'),
      }),
    )
    id: number,
  ) {
    const session: any = req.session;

    if (!session.userId || !session.userName) {
      throw new HttpException(
        '로그인이 되어있지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.problemsService.getTestCase(id, session.userId);
  }

  @Post(':id/tc')
  async postTestcase(
    @Req() req: Request,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('문제 번호가 숫자가 아닙니다.'),
      }),
    )
    problemId: number,
    @Body() postTestCaseDTO: PostTestCaseDTO,
  ) {
    const session: any = req.session;

    if (!session.userId || !session.userName) {
      throw new UnauthorizedException('로그인이 되어있지 않습니다.');
    }

    return this.problemsService.postTestcase(
      session.userId,
      problemId,
      postTestCaseDTO,
    );
  }

  @Post(':id/submissions')
  async postSubmission(
    @Req() req: Request,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('문제 번호가 숫자가 아닙니다.'),
      }),
    )
    problemId: number,
    @Body() postSubmissionDTO: PostSubmissionDTO,
  ) {
    const session: any = req.session;

    if (!session.userId || !session.userName) {
      throw new UnauthorizedException('로그인이 되어있지 않습니다.');
    }

    return this.problemsService.postSubmission(
      session.userId,
      problemId,
      postSubmissionDTO,
    );
  }
}
