import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  async create(@Body() createProblemDTO: CreateProblemDTO) {
    return this.problemsService.create(createProblemDTO);
  }

  @Get('/:id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('문제 번호 형식이 숫자가 아닙니다.'),
      }),
    )
    id: number,
  ) {
    return this.problemsService.findOne(id);
  }
}
