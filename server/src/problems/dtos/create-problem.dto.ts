import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
  IsInt,
  Equals,
  IsDefined,
} from 'class-validator';

class Example {
  @IsDefined()
  input: string;

  @IsNotEmpty()
  output: string;
}

export class CreateProblemDTO {
  @IsNotEmpty()
  title: string;

  @Max(10000)
  @Min(100)
  @IsInt()
  timeLimit: number;

  @Equals(512)
  @IsInt()
  memoryLimit: number;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  input: string;

  @IsNotEmpty()
  output: string;

  @IsNotEmpty()
  explanation: string;

  @ValidateNested()
  @Type(() => Example)
  examples: Example[];
}
