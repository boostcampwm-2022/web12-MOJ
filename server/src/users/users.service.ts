import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map, lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly http: HttpService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async postOauthRedirect(code: string) {
    try {
      const accessToken: string = await this.getAccessToken(code);
      const githubUserData = await this.getUserDataFromGithub(accessToken);
      const userFromDB = await this.userRepository.findOneBy({
        githubId: +githubUserData.id,
      });
      if (userFromDB) return userFromDB;

      const newUser = new User();

      newUser.githubId = githubUserData.id;
      newUser.name = githubUserData.userName;

      await this.userRepository.save(newUser);

      return newUser;
    } catch (err) {
      return err.message;
    }
  }

  async getAccessToken(code: string) {
    const requestURL = 'https://github.com/login/oauth/access_token';
    const clientID = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const request = this.http
      .post(
        requestURL,
        {
          client_id: clientID,
          client_secret: clientSecret,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      .pipe(
        map((res) => {
          if (res.status === 200) return res.data;
          throw new Error(`Github Server Error: ${res.status}`);
        }),
        map((data) => data.access_token),
        map((token) => {
          if (!token) throw new Error('no token');
          return token;
        }),
      );
    return await lastValueFrom(request);
  }

  async getUserDataFromGithub(accessToken: string) {
    const request = this.http
      .get('https://api.github.com/user', {
        headers: {
          Accept: 'application/json',
          Authorization: `token ${accessToken}`,
        },
      })
      .pipe(
        map((res) => {
          if (res.status === 200) return res.data;
          throw new Error(`Github Server Error: ${res.status}`);
        }),
        map((data) => {
          if (data) return { id: data.id, userName: data.login };
          throw new Error('There is no github user');
        }),
      );

    return await lastValueFrom(request);
  }
}
