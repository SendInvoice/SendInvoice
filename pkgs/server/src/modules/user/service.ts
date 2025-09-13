import { In, Repository } from 'typeorm';

import { User } from './entity';

export type CreateUserDto = {
  name: string;
  surname: string;
  email: string;
}

export class UserService {
  private userRepository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }

  async getUser(): Promise<User[]> {
    const user = await this.userRepository.find();

    return user;
  }

  async createUser(dto: CreateUserDto): Promise<User[]> {
    const user = new User();

    user.name = dto.name;
    user.surname = dto.surname;
    user.email = dto.email;

    const inserted = await this.userRepository.insert(user);

    return this.userRepository.findBy({ id: In([inserted.identifiers[0].id]) });
  }

  async deleteUser(id: string): Promise<boolean> {
    const inserted = await this.userRepository.delete({
      id
    });

    return !!inserted.affected;
  }

  // FIXME: Use findById as nameCreateCVParams
  async findById(id: string): Promise<User[] | null> {
    const user = await this.userRepository.findBy({
      id
    });

    if (!user) {
      return null;
    } else {
      return user;
    }
  }

  async findByEmail(email: string): Promise<User[] | null> {
    const user = await this.userRepository.findBy({
      email
    });

    if (!user) {
      return null;
    } else {
      return user;
    }
  }
}
