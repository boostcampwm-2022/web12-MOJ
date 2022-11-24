import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
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
  async postOauthRedirect(
    @Query() githubLoginDTO: GithubLoginDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user: User = await this.usersService.postOauthRedirect(
      githubLoginDTO,
    );
    const session: any = req.session;

    session.userId = user.id;
    session.userName = user.name;

    res.status(HttpStatus.OK).json({});
  }

  @Get('login-status')
  getLoginStatus(@Req() req: Request) {
    const session: any = req.session;

    if (!!session.userId && !!session.userName) {
      return { userName: session.userName };
    }

    throw new HttpException(
      '로그인이 되어있지 않습니다.',
      HttpStatus.UNAUTHORIZED,
    );
  }

  @Post('logout')
  async postLogout(@Req() req: Request) {
    await promisify(req.session.destroy.bind(req.session))();

    return {};
  }
}
