import { IsInt } from 'class-validator';

export class GetTestCaseDTO {
  @IsInt()
  id: number;
}
