import { Type } from 'class-transformer';
import {
  IsString,
  ValidateNested,
  IsDefined,
  IsNotEmpty,
} from 'class-validator';

class TestCaseDTO {
  @IsDefined()
  @IsString()
  input: string;

  @IsNotEmpty()
  @IsString()
  output: string;
}

export class PostTestCaseDTO {
  @ValidateNested()
  @Type(() => TestCaseDTO)
  testcase: TestCaseDTO[];
}
