import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProblemDTO } from './dtos/create-problem.dto';
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
}
