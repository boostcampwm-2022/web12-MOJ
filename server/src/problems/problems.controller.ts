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
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { GetTestCaseDTO } from './dtos/get-testcase.dto';
import { ProblemsService } from './problems.service';
import { Request } from 'express';

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

  @Get(':id/tc')
  async getTestcase(
    @Req() req: Request,
    @Param() getTestCaseDTO: GetTestCaseDTO,
  ) {
    const session: any = req.session;

    if (!session.userId || !session.userName) {
      throw new HttpException(
        '로그인이 되어있지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.problemsService.getTestCase(getTestCaseDTO, session.userId);
  }
}
