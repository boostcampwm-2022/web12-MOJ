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

  @IsNotEmpty({ message: '예제 출력은 비워둘 수 없습니다.' })
  @IsOptional()
  output: string;
}

export class UpdateProblemDTO {
  @IsNotEmpty({ message: '제목은 비워둘 수 없습니다.' })
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

  @IsNotEmpty({ message: '본문은 비워둘 수 없습니다.' })
  @IsOptional()
  content: string;

  @IsNotEmpty({ message: '입력은 비워둘 수 없습니다.' })
  @IsOptional()
  input: string;

  @IsNotEmpty({ message: '출력은 비워둘 수 없습니다.' })
  @IsOptional()
  output: string;

  @IsNotEmpty({ message: '예제 설명은 비워둘 수 없습니다.' })
  @IsOptional()
  explanation: string;

  @ValidateNested()
  @Type(() => Example)
  examples: Example[];

  @IsBoolean()
  @IsOptional()
  visible: boolean;
}
