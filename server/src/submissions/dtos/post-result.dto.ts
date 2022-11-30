import { IsInt, Min, Max } from 'class-validator';

export class PostResultDTO {
  @IsInt()
  @Min(0)
  @Max(6)
  state: number;

  @IsInt()
  maxTime: number;

  @IsInt()
  maxMemory: number;
}
