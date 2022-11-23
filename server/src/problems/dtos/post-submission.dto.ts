import { IsString } from 'class-validator';

export class PostSubmissionDTO {
  @IsString()
  language: string;

  @IsString()
  code: string;
}
