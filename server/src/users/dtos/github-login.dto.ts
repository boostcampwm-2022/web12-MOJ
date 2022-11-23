import { IsNotEmpty, IsString } from 'class-validator';

export class GithubLoginDTO {
  @IsNotEmpty()
  @IsString()
  code: string;
}
