import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';

class TestCaseDTO {
  @IsString()
  input: string;

  @IsString()
  output: string;
}

export class PostTestCaseDTO {
  @ValidateNested()
  @Type(() => TestCaseDTO)
  testcase: TestCaseDTO[];
}
