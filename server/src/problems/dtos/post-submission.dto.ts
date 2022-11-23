import { IsString, IsNotEmpty } from 'class-validator';

export class PostSubmissionDTO {
  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
