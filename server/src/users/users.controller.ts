import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response, Request } from 'express';
import { User } from './entities/user.entity';
import { promisify } from 'util';
import { GithubLoginDTO } from './dtos/github-login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('github-login')
  async createUser(
    @Query() githubLoginDTO: GithubLoginDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user: User = await this.usersService.createUser(githubLoginDTO);
    const session: any = req.session;

    session.userId = user.id;
    session.userName = user.name;

    res.status(HttpStatus.OK).json({});
  }

  @Get('login-status')
  findOneUser(@Req() req: Request) {
    const session: any = req.session;

    if (!!session.userId && !!session.userName) {
      return { userName: session.userName };
    }

    throw new UnauthorizedException('로그인이 되어있지 않습니다.');
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    await promisify(req.session.destroy.bind(req.session))();

    return {};
  }
}
