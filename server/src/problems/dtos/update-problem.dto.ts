import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
  IsInt,
  Equals,
  IsBoolean,
  IsOptional,
  IsDefined,
} from 'class-validator';

class Example {
  @IsDefined()
  @IsOptional()
  input: string;

  @IsNotEmpty()
  @IsOptional()
  output: string;
}

export class UpdateProblemDTO {
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @Max(10000)
  @Min(100)
  @IsInt()
  @IsOptional()
  timeLimit: number;

  @Equals(512)
  @IsInt()
  @IsOptional()
  memoryLimit: number;

  @IsNotEmpty()
  @IsOptional()
  content: string;

  @IsNotEmpty()
  @IsOptional()
  input: string;

  @IsNotEmpty()
  @IsOptional()
  output: string;

  @IsNotEmpty()
  @IsOptional()
  explanation: string;

  @ValidateNested()
  @Type(() => Example)
  examples: Example[];

  @IsBoolean()
  @IsOptional()
  visible: boolean;
}
