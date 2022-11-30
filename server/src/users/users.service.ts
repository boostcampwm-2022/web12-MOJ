import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GithubLoginDTO } from './dtos/github-login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly http: HttpService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(githubLoginDTO: GithubLoginDTO) {
    try {
      const accessToken: string = await this.getAccessToken(
        githubLoginDTO.code,
      );

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
    const response = await this.http.axiosRef.post(
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
    );

    if (response.status !== 200)
      throw new Error(`Github Server Error: ${response.status}`);
    if (!response.data.access_token) throw new Error('no token');

    return response.data.access_token;
  }

  async getUserDataFromGithub(accessToken: string) {
    const response = await this.http.axiosRef.get(
      'https://api.github.com/user',
      {
        headers: {
          Accept: 'application/json',
          Authorization: `token ${accessToken}`,
        },
      },
    );

    if (response.status !== 200)
      throw new Error(`Github Server Error: ${response.status}`);
    if (!response.data) throw new Error('There is no github user');

    return { id: response.data.id, userName: response.data.login };
  }
}
