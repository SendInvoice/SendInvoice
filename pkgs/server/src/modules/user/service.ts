import { In, Repository } from 'typeorm';

import { User } from './entity';

export type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

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

    return this.userRepository.findBy({id:In([inserted.identifiers])});
  }

  async deleteUser(id: string): Promise<boolean> {
    const inserted = await this.userRepository.delete({
      id
    });

    return !!inserted.affected;
  }

  //   async getTitleById(id: string): Promise<TitleListItem | null> {
//     const title = await this.titleRepository.findOneById(id);

//     if (!title) {
//       return null;
//     }

//     return {
//       ...title,
//       coverImageUrl: title.coverImageId
//         ? `http://localhost:3000/api/v1/images/${title.coverImageId}`
//         : null
//     };
//   }
}
