import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { GetTestCaseDTO } from './dtos/get-testcase.dto';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  async create(@Body() createProblemDTO: CreateProblemDTO) {
    console.log(createProblemDTO);
    return this.problemsService.create(createProblemDTO);
  }

  @Get(':id/tc')
  async getTestcase(
    @Req() req: Request,
    @Param() getTestCaseDTO: GetTestCaseDTO,
  ) {
    const session: any = req.session;

    if (!session.userId) {
      throw new HttpException(
        '로그인이 되어있지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.problemsService.getTestCase(getTestCaseDTO, session.userId);
  }
}
