import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Token } from './entity';

import { UserService } from '../user';

export class AuthService {
  private tokenRepository: Repository<Token>;
  private userService: UserService;

  constructor(tokenRepository: Repository<Token>, userService: UserService) {
    this.tokenRepository = tokenRepository;
    this.userService = userService;
  }

  async createToken(email: string): Promise<Token> {
    const token = new Token();
    const users = await this.userService.findByEmail(email);

    if (!users) {
      throw new Error(`User with Email: ${email} not found.`);
    }

    if (Array.isArray(users) && users.length != 1) {
      throw new Error(`Ambiguous result fetching user by Email ${email}`);
    }

    const user = users[0];

    token.token = randomUUID();
    token.user = user;

    return await this.tokenRepository.save(token);
  }

  async findByToken(tokenStr: string): Promise<Token[] | null> {
    const token = await this.tokenRepository.find({
      where: {
        token: tokenStr
      },
      relations: ['user']
    });

    if (!token) {
      return null;
    } else {
      return token;
    }
  }
}
