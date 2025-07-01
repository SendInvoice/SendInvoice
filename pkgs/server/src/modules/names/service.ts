import { Repository } from 'typeorm';

import { Name, NameProfession } from './entities';

export type CreateNameDto = Omit<Name, 'id' | 'createdAt' | 'updatedAt'>;

export class NameService {
  private nameRepository: Repository<Name>;
  private nameProfessionRepository: Repository<NameProfession>;

  constructor(nameRepository: Repository<Name>, nameProfessionRepository: Repository<NameProfession>) {
    this.nameRepository = nameRepository;
    this.nameProfessionRepository = nameProfessionRepository;
  }

  async getNames(): Promise<Name[]> {
    return await this.nameRepository.find({
      relations: {
        professions: true
      }
    });
  }

  async getNameById(id: string): Promise<Name | null> {
    const name = await this.nameRepository.findOneById(id);

    if (!name) {
      return null;
    }

    return name;
  }

  async createName(dto: CreateNameDto): Promise<Name[]> {
    const name = new Name();

    name.name = dto.name;
    name.birthDate = dto.birthDate;
    name.deathDate = dto.deathDate;

    const inserted = await this.nameRepository.insert(name);

    return this.nameRepository.findByIds(inserted.identifiers);
  }

  async deleteName(id: string): Promise<boolean> {
    const deleted = await this.nameRepository.delete({
      id
    });

    return !!deleted.affected;
  }
}
