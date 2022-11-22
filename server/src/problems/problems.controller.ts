import { Body, Controller, Post } from '@nestjs/common';
import { CreateProblemDTO } from './dtos/create-problem.dto';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post()
  async create(@Body() createProblemDTO: CreateProblemDTO) {
    console.log(createProblemDTO);
    return this.problemsService.create(createProblemDTO);
  }
}
