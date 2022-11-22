import { Controller, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response, Request } from 'express';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('oauth')
  async getOauthRedirect(
    @Query('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user: User = await this.usersService.getOauthRedirect(code);
    const session: any = req.session;

    session.userId = user.id;
    session.userName = user.name;

    res.status(HttpStatus.OK).end();
  }
}
