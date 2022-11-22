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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('github-login')
  async postOauthRedirect(
    @Query('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user: User = await this.usersService.postOauthRedirect(code);
    const session: any = req.session;

    session.userId = user.id;
    session.userName = user.name;

    res.status(HttpStatus.OK).end();
  }

  @Get('login-status')
  getLoginStatus(@Req() req: Request, @Res() res: Response) {
    const session: any = req.session;

    if (!!session.userId && !!session.userName) {
      res.status(HttpStatus.OK).json({ userName: session.userName });
    }

    throw new HttpException(
      '로그인이 되어있지 않습니다.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
