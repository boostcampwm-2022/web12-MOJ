import { IsNotEmpty, IsString, IsInt, Max, Min, Equals } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmissionDTO {
  @IsNotEmpty()
  @IsString()
  code: string;

  @Type(() => TestCase)
  testCases: TestCase[];

  @IsNotEmpty()
  @IsInt()
  @Max(10000)
  @Min(100)
  timeLimit: number;

  @Equals(512)
  @IsInt()
  memoryLimit: number;
}

class TestCase {
  @IsNotEmpty()
  @IsString()
  input: string;

  @IsNotEmpty()
  @IsString()
  output: string;
}
