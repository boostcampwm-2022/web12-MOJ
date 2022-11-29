import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { SubmissionDTO } from './dtos/post-submission.dto';

@Injectable()
export class ScoringService {
  async createSubmission(submissionDTO: SubmissionDTO) {
    const py = spawn('python3', ['./python/run.py', submissionDTO.code]);

    py.stdout.on('data', (data) => {
      console.log(data.toString());
    });
  }
}
