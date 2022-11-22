import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
  ) {}

  async findAll(page: number): Promise<Record<string, any>> {
    const pageSize = 20;
    const submissions = await this.resultRepository.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { id: 'DESC' },
    });

    const submissionCount = await this.resultRepository.count();
    const pageCount = Math.ceil(submissionCount / 20);

    return { submissions, pageCount, currentPage: Number(page) };
  }
}
